import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transactions.dto';

export interface TransactionsQuery {
  sort?: 'asc' | 'desc';
  limit?: number;
  type?: 'income' | 'expense';
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly Transaction: Model<Transaction>,
  ) {}

  async showTransactions(userId: string, query: TransactionsQuery) {
    return await this.Transaction.find({ user: userId })
      .sort(query.sort)
      .limit(query.limit)
      .where({ type: query.type });
  }

  async showTransaction(transactionId: string) {
    return await this.Transaction.findById(transactionId);
  }

  async createTransaction(data: CreateTransactionDto, userId: string) {
    const newTransaction = await this.Transaction.create({
      user: userId,
      ...data,
    });

    return { transactionId: newTransaction._id };
  }

  async updateTransaction(data: UpdateTransactionDto, transactionId: string) {
    await this.Transaction.findByIdAndUpdate(transactionId, data).orFail();
    return { transactionId };
  }

  async deleteTransaction(transactionId: string) {
    await this.Transaction.findByIdAndDelete(transactionId).orFail();
    return { transactionId };
  }
}
