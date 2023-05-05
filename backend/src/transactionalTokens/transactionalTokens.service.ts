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
    private readonly transactionalTokenModel: Model<TransactionalToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async findByUserAndScope(userId: string, scope: Scope) {
    return await this.transactionalTokenModel.findOne({ user: userId, scope });
  }

  async find(token: string) {
    return await this.transactionalTokenModel.findOne({ token });
  }

  async create(userId: string, scope: Scope) {
    let token: string;

    const newToken = this.jwtService.sign(
      { userId, scope },
      {
        secret: this.configService.get<string>('TRANSACTIONAL_JWT_SECRET'),
        expiresIn: scope === 'PASSWORD' ? '3h' : '1d',
      },
    );

    await this.transactionalTokenModel.create({
      token: newToken,
      user: userId,
      scope,
    });

    return token;
  }

  async invalidateToken(token: string) {
    await this.transactionalTokenModel.updateOne(
      { token },
      { isInvalid: true },
    );
  }

  async invalidateTokens(userId: string, scope: Scope) {
    await this.transactionalTokenModel.updateMany(
      { user: userId, scope },
      { isInvalid: true },
    );
  }

  async verify(token: string): Promise<TransactionalTokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('TRANSACTIONAL_JWT_SECRET'),
    });
  }
}
