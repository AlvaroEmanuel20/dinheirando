import { Module } from '@nestjs/common';
import { ServiceTokensService } from './serviceTokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ServiceToken,
  ServiceTokenSchema,
} from './schemas/serviceToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceToken.name, schema: ServiceTokenSchema },
    ]),
  ],
  providers: [ServiceTokensService],
  exports: [ServiceTokensService],
})
export class ServiceTokensModule {}
