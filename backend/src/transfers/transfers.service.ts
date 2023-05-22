import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transfer } from './schemas/transfer.schema';
import { Model } from 'mongoose';
import { CreateTransferDto, UpdateTransferDto } from './dto/transfers.dto';
import { Account } from 'src/accounts/schemas/account.schema';
import defineDateFilter from 'src/shared/utils/defineDateFilter';

export interface TransfersQuery {
  sort?: 'asc' | 'desc';
  limit?: number;
  fromDate?: string; //ISO 8601
  toDate?: string; //ISO 8601
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectModel(Transfer.name)
    private readonly Transfer: Model<Transfer>,
    @InjectModel(Account.name)
    private readonly Account: Model<Account>,
  ) {}

  async showTransfers(userId: string, query: TransfersQuery) {
    const dateRange = defineDateFilter(query.fromDate, query.toDate);
    return await this.Transfer.find({ user: userId })
      .sort({ createdAt: query.sort })
      .limit(query.limit)
      .populate('fromAccount', 'name')
      .populate('toAccount', 'name')
      .gte('createdAt', dateRange[0])
      .lte('createdAt', dateRange[1]);
  }

  async showTransfer(transferId: string, userId: string) {
    return await this.Transfer.findOne({ _id: transferId, user: userId })
      .populate('fromAccount', 'name')
      .populate('toAccount', 'name');
  }

  async createTransfer(data: CreateTransferDto, userId: string) {
    const fromAccountExists = await this.Account.findOne({
      user: userId,
      _id: data.fromAccount,
    });

    if (!fromAccountExists) throw new Error('From account not found');

    const toAccountExists = await this.Account.findOne({
      user: userId,
      _id: data.toAccount,
    });

    if (!toAccountExists) throw new Error('To account not found');

    const newTransfer = await this.Transfer.create({
      user: userId,
      ...data,
    });

    fromAccountExists.amount -= data.value;
    toAccountExists.amount += data.value;
    await fromAccountExists.save();
    await toAccountExists.save();

    return { transferId: newTransfer._id };
  }

  async updateTransfer(
    data: UpdateTransferDto,
    transferId: string,
    userId: string,
  ) {
    const { value, fromAccount, toAccount, createdAt } = data;

    const transfer = await this.Transfer.findById(transferId);
    if (!transfer) throw new Error('Transfer not found');

    const newFromAccount = await this.Account.findById(fromAccount);
    const newToAccount = await this.Account.findById(toAccount);

    if (fromAccount && fromAccount != transfer.fromAccount) {
      if (fromAccount === transfer.toAccount)
        throw new Error('From account is equals to account');
      if (!newFromAccount) throw new Error('New from account not found');

      const oldFromAccount = await this.Account.findById(transfer.fromAccount);

      oldFromAccount.amount += transfer.value;
      newFromAccount.amount -= transfer.value;
      transfer.fromAccount = newFromAccount.id;
      await newFromAccount.save();
      await oldFromAccount.save();
      await transfer.save();
    }

    if (toAccount && toAccount != transfer.toAccount) {
      if (toAccount === transfer.fromAccount)
        throw new Error('To account is equals from account');
      if (!newToAccount) throw new Error('New to account not found');

      const oldToAccount = await this.Account.findById(transfer.toAccount);

      oldToAccount.amount -= transfer.value;
      newToAccount.amount += transfer.value;
      transfer.toAccount = newToAccount.id;
      await newToAccount.save();
      await oldToAccount.save();
      await transfer.save();
    }

    if (value && value != transfer.value) {
      const fromAccount = await this.Account.findById(transfer.fromAccount);
      const toAccount = await this.Account.findById(transfer.toAccount);

      if (fromAccount && toAccount) {
        const difference = value - transfer.value;
        fromAccount.amount -= difference;
        toAccount.amount += difference;
        await fromAccount.save();
        await toAccount.save();
      }
    }

    await this.Transfer.updateOne(
      { _id: transferId, user: userId },
      {
        value,
        createdAt,
        fromAccount,
        toAccount,
      },
    ).orFail();
    return { transferId };
  }

  async deleteTransfer(transferId: string, userId: string) {
    const transfer = await this.Transfer.findById(transferId);
    if (!transfer) throw new Error('Transfer not found');

    const fromAccount = await this.Account.findById(transfer.fromAccount);
    const toAccount = await this.Account.findById(transfer.toAccount);

    if (fromAccount && toAccount) {
      fromAccount.amount += transfer.value;
      toAccount.amount -= transfer.value;
      await fromAccount.save();
      await toAccount.save();
    }

    await this.Transfer.deleteOne({ _id: transferId, user: userId }).orFail();
    return { transferId };
  }
}
