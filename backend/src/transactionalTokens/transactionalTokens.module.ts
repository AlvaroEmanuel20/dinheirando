import { Module } from '@nestjs/common';
import { TransactionalTokensService } from './transactionalTokens.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionalToken,
  TransactionalTokenSchema,
} from './schemas/transactionalToken.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionalToken.name, schema: TransactionalTokenSchema },
    ]),
    JwtModule,
    ConfigModule,
  ],
  providers: [TransactionalTokensService],
  exports: [TransactionalTokensService],
})
export class TransactionalTokensModule {}
