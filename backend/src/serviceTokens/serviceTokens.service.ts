import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceToken } from './schemas/serviceToken.schema';
import { Model, Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type ServiceType = 'REFRESH' | 'TRANSACTIONAL_EMAIL' | 'TRANSACTIONAL_PASSWORD';

export interface CreateServiceToken {
  token: string;
  user: string | Types.ObjectId;
  serviceType: ServiceType;
}

@Injectable()
export class ServiceTokensService {
  constructor(
    @InjectModel(ServiceToken.name)
    private readonly tokenModel: Model<ServiceToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async deleteTokens(user: string | Types.ObjectId, type: ServiceType) {
    return await this.tokenModel.deleteMany({
      user,
      serviceType: type,
    });
  }

  async create(data: CreateServiceToken) {
    const newToken = await this.tokenModel.create(data);
    return { token: newToken.token };
  }

  async createTransactional(userId: string, type: ServiceType) {
    let token: string;
    const secret = this.configService.get<string>('TRANSACTIONAL_JWT_SECRET');

    if (type === 'TRANSACTIONAL_EMAIL') {
      await this.deleteTokens(userId, 'TRANSACTIONAL_EMAIL');
      token = this.jwtService.sign(
        { userId, type },
        { expiresIn: '1d', secret },
      );
    } else {
      await this.deleteTokens(userId, 'TRANSACTIONAL_PASSWORD');
      token = this.jwtService.sign(
        { userId, type },
        { expiresIn: '3h', secret },
      );
    }

    await this.tokenModel.create({
      token,
      user: userId,
      serviceType: type,
    });

    return token;
  }

  async verifyTransactional(token: string) {
    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('TRANSACTIONAL_JWT_SECRET'),
    });
  }
}
