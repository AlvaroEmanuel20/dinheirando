import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transactions.dto';
import { Account } from 'src/accounts/schemas/account.schema';
import { Category } from 'src/categories/schemas/category.schema';

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
    @InjectModel(Account.name)
    private readonly Account: Model<Account>,
    @InjectModel(Category.name)
    private readonly Category: Model<Category>,
  ) {}

  async showTransactions(userId: string, query: TransactionsQuery) {
    return await this.Transaction.find({ user: userId })
      .sort(query.sort)
      .limit(query.limit)
      .where({ type: query.type })
      .populate('category', 'name')
      .populate('account', 'name');
  }

  async showTransaction(transactionId: string) {
    return await this.Transaction.findById(transactionId)
      .populate('category', 'name')
      .populate('account', 'name');
  }

  async createTransaction(data: CreateTransactionDto, userId: string) {
    const categoryExists = await this.Category.findOne({
      userId,
      _id: data.category,
    });

    if (!categoryExists) throw new Error('Category not found');

    const accountExists = await this.Account.findOne({
      userId,
      _id: data.account,
    });

    if (!accountExists) throw new Error('Account not found');

    const newTransaction = await this.Transaction.create({
      user: userId,
      ...data,
    });

    if (data.type === 'income') {
      accountExists.amount += data.value;
      await accountExists.save();
    } else if (data.type === 'expense') {
      accountExists.amount -= data.value;
      await accountExists.save();
    }

    categoryExists.totalOfTransactions += data.value;
    await categoryExists.save();

    return { transactionId: newTransaction._id };
  }

  async updateTransaction(data: UpdateTransactionDto, transactionId: string) {
    const { name, createdAt, value, type, category, account } = data;

    const transaction = await this.Transaction.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    if (category && category !== transaction.category) {
      const newCategory = await this.Category.findById(category);
      if (!newCategory) throw new Error('New category not found');
    }

    if (account && account !== transaction.account) {
      const newAccount = await this.Account.findById(account);
      const oldAccount = await this.Account.findById(transaction.account);

      if (!newAccount) throw new Error('New account not found');

      if (oldAccount) {
        if (transaction.type === 'income') {
          oldAccount.amount -= transaction.value;
          newAccount.amount += transaction.value;
        } else if (transaction.type === 'expense') {
          oldAccount.amount += transaction.value;
          newAccount.amount -= transaction.value;
        }

        await newAccount.save();
        await oldAccount.save();
      }

      transaction.account = newAccount.id;
      await transaction.save();
    }

    if (type && type !== transaction.type) {
      const account = await this.Account.findById(transaction.account);

      if (account) {
        if (type === 'income') {
          account.amount += transaction.value * 2;
          transaction.type = 'income';
        } else if (type === 'expense') {
          account.amount -= transaction.value * 2;
          transaction.type = 'expense';
        }

        await account.save();
        await transaction.save();
      }
    }

    if (value && value !== transaction.value) {
      const account = await this.Account.findById(transaction.account);

      if (account) {
        const difference = value - transaction.value;
        transaction.type === 'income'
          ? (account.amount += difference)
          : (account.amount -= difference);

        await account.save();
      }
    }

    await this.Transaction.findByIdAndUpdate(transactionId, {
      name,
      createdAt,
      type,
      value,
      category,
      account,
    }).orFail();
    return { transactionId };
  }

  async deleteTransaction(transactionId: string) {
    const transaction = await this.Transaction.findById(transactionId);
    if (!transaction) throw new Error('Transaction not found');

    const account = await this.Account.findById(transaction.account);
    if (account) {
      if (transaction.type === 'expense') {
        account.amount += transaction.value;
        await account.save();
      } else if (transaction.type === 'income') {
        account.amount -= transaction.value;
        await account.save();
      }
    }

    await this.Transaction.findByIdAndDelete(transactionId).orFail();
    return { transactionId };
  }
}
