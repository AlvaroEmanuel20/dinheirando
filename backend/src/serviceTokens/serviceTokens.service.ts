import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServiceToken } from './schemas/serviceToken.schema';
import { Model, Types } from 'mongoose';

type ServiceType = 'REFRESH' | 'TRANSACTIONAL';

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
}
