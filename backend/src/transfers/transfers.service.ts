import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transfer } from './schemas/transfer.schema';
import { Model } from 'mongoose';
import { CreateTransferDto, UpdateTransferDto } from './dto/transfers.dto';

export interface TransfersQuery {
  sort?: 'asc' | 'desc';
  limit?: number;
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectModel(Transfer.name)
    private readonly Transfer: Model<Transfer>,
  ) {}

  async showTransfers(userId: string, query: TransfersQuery) {
    return await this.Transfer.find({ user: userId })
      .sort(query.sort)
      .limit(query.limit);
  }

  async showTransfer(transferId: string) {
    return await this.Transfer.findById(transferId);
  }

  async createTransfer(data: CreateTransferDto, userId: string) {
    const newTransfer = await this.Transfer.create({
      user: userId,
      ...data,
    });

    return { transferId: newTransfer._id };
  }

  async updateTransfer(data: UpdateTransferDto, transferId: string) {
    await this.Transfer.findByIdAndUpdate(transferId, data).orFail();
    return { transferId };
  }

  async deleteTransfer(transferId: string) {
    await this.Transfer.findByIdAndDelete(transferId).orFail();
    return { transferId };
  }
}
