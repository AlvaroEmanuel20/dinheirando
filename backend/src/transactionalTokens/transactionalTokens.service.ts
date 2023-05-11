import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TransactionalToken } from './schemas/transactionalToken.schema';

type Scope = 'EMAIL' | 'PASSWORD';

export interface TransactionalTokenPayload {
  userId: string;
  scope: Scope;
  exp: number;
  iat: number;
}

@Injectable()
export class TransactionalTokensService {
  constructor(
    @InjectModel(TransactionalToken.name)
    private readonly TransactionalToken: Model<TransactionalToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async create(userId: string, scope: Scope) {
    let token: string;

    const newToken = this.jwtService.sign(
      { userId, scope },
      {
        secret: this.configService.get<string>('TRANSACTIONAL_JWT_SECRET'),
        expiresIn: scope === 'PASSWORD' ? '3h' : '1d',
      },
    );

    await this.TransactionalToken.create({
      token: newToken,
      user: userId,
      scope,
    });

    return token;
  }

  async verify(token: string): Promise<TransactionalTokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('TRANSACTIONAL_JWT_SECRET'),
    });
  }
}
