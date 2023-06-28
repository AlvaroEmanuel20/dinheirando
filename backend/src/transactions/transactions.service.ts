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
import defineDateFilter from 'src/shared/utils/defineDateFilter';
import CustomBusinessError from 'src/shared/utils/CustomBusinessError';

export interface TransactionsQuery {
  sort?: 'asc' | 'desc';
  limit?: number;
  type?: 'income' | 'expense';
  fromDate?: string; //ISO 8601 Date
  toDate?: string; //ISO 8601 Date
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
    const dateRange = defineDateFilter(query.fromDate, query.toDate);

    if (query.type === 'expense' || query.type === 'income') {
      return await this.Transaction.find({ user: userId })
        .sort({ createdAt: query.sort })
        .limit(query.limit)
        .where({ type: query.type })
        .populate('category', 'name')
        .populate('account', 'name')
        .gte('createdAt', dateRange[0])
        .lte('createdAt', dateRange[1]);
    }

    return await this.Transaction.find({ user: userId })
      .sort({ createdAt: query.sort })
      .limit(query.limit)
      .populate('category', 'name')
      .populate('account', 'name')
      .gte('createdAt', dateRange[0])
      .lte('createdAt', dateRange[1]);
  }

  async showTransaction(transactionId: string, userId: string) {
    return await this.Transaction.findOne({ _id: transactionId, user: userId })
      .populate('category', 'name')
      .populate('account', 'name');
  }

  async showTotal(userId: string) {
    const dateRange = defineDateFilter();
    const transactions = await this.Transaction.find({
      user: userId,
    })
      .gte('createdAt', dateRange[0])
      .lte('createdAt', dateRange[1]);

    const total = transactions.reduce((acc, value) => (acc += value.value), 0);
    const totalIncome = transactions
      .filter((value) => value.type === 'income')
      .reduce((acc, value) => (acc += value.value), 0);
    const totalExpense = transactions
      .filter((value) => value.type === 'expense')
      .reduce((acc, value) => (acc += value.value), 0);

    return { total, totalIncome, totalExpense };
  }

  async createTransaction(data: CreateTransactionDto, userId: string) {
    const categoryExists = await this.Category.findOne({
      user: userId,
      _id: data.category,
    });

    if (!categoryExists)
      throw new CustomBusinessError('Category not found', 404);

    const accountExists = await this.Account.findOne({
      user: userId,
      _id: data.account,
    });

    if (!accountExists) throw new CustomBusinessError('Account not found', 404);

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

  async updateTransaction(
    data: UpdateTransactionDto,
    transactionId: string,
    userId: string,
  ) {
    const { name, createdAt, value, type, category, account } = data;

    const transaction = await this.Transaction.findById(transactionId);
    if (!transaction)
      throw new CustomBusinessError('Transaction not found', 404);

    if (category && category != transaction.category) {
      const newCategory = await this.Category.findById(category);
      const oldCategory = await this.Category.findById(transaction.category);
      if (!newCategory)
        throw new CustomBusinessError('New category not found', 404);

      newCategory.totalOfTransactions += transaction.value;
      oldCategory.totalOfTransactions -= transaction.value;
      await newCategory.save();
      await oldCategory.save();
    }

    if (account && account != transaction.account) {
      const newAccount = await this.Account.findById(account);
      const oldAccount = await this.Account.findById(transaction.account);

      if (!newAccount)
        throw new CustomBusinessError('New account not found', 404);

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
      const category = await this.Category.findById(transaction.category);

      category.totalOfTransactions += value - category.totalOfTransactions;
      await category.save();

      if (account) {
        const difference = value - transaction.value;
        transaction.type === 'income'
          ? (account.amount += difference)
          : (account.amount -= difference);

        await account.save();
      }
    }

    await this.Transaction.updateOne(
      { _id: transactionId, user: userId },
      {
        name,
        createdAt,
        type,
        value,
        category,
        account,
      },
    ).orFail();
    return { transactionId };
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const transaction = await this.Transaction.findById(transactionId);
    if (!transaction)
      throw new CustomBusinessError('Transaction not found', 404);

    const category = await this.Category.findById(transaction.category);
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

    await this.Transaction.deleteOne({
      _id: transactionId,
      user: userId,
    }).orFail();

    category.totalOfTransactions -= transaction.value;
    await category.save();

    return { transactionId };
  }
}
