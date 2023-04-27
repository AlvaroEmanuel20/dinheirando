import { Module } from '@nestjs/common';
import { ServiceTokensService } from './serviceTokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceToken,
  ServiceTokenSchema,
} from './schemas/serviceToken.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceToken.name, schema: ServiceTokenSchema },
    ]),
    JwtModule,
    ConfigModule,
  ],
  providers: [ServiceTokensService],
  exports: [ServiceTokensService],
})
export class ServiceTokensModule {}
