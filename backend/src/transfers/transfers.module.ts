import { Module } from '@nestjs/common';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transfer, TransferSchema } from './schemas/transfer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transfer.name, schema: TransferSchema },
    ]),
  ],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}
