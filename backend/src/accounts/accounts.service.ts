import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './schemas/account.schema';
import { CreateAccountDto, UpdateAccountDto } from './dto/accounts.dto';
import { Transaction } from 'src/transactions/schemas/transaction.schema';
import { Transfer } from 'src/transfers/schemas/transfer.schema';
import CustomBusinessError from 'src/shared/utils/CustomBusinessError';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly Account: Model<Account>,
    @InjectModel(Transaction.name)
    private readonly Transaction: Model<Transaction>,
    @InjectModel(Transfer.name) private readonly Transfer: Model<Transfer>,
  ) {}

  async showAccounts(userId: string) {
    return await this.Account.find({ user: userId });
  }

  async showAccount(accountId: string, userId: string) {
    return await this.Account.findOne({ _id: accountId, user: userId });
  }

  async showTotal(userId: string) {
    const accounts = await this.Account.find({ user: userId });
    const total = accounts.reduce((acc, value) => (acc += value.amount), 0);
    return { total };
  }

  async createAccount(data: CreateAccountDto, userId: string) {
    const newAccount = await this.Account.create({
      user: userId,
      ...data,
    });

    return { accountId: newAccount._id };
  }

  async updateAccount(
    data: UpdateAccountDto,
    accountId: string,
    userId: string,
  ) {
    await this.Account.updateOne(
      { _id: accountId, user: userId },
      data,
    ).orFail();
    return { accountId };
  }

  async deleteAccount(accountId: string, userId: string) {
    const transactionsUsedAccount = await this.Transaction.find({
      account: accountId,
    });

    if (transactionsUsedAccount.length > 0)
      throw new CustomBusinessError(
        'There are transactions using this account',
        409,
      );

    const transfersUsedAccount = await this.Transfer.find({
      $or: [{ fromAccount: accountId }, { toAccount: accountId }],
    });

    if (transfersUsedAccount.length > 0)
      throw new CustomBusinessError(
        'There are transfers using this account',
        409,
      );

    await this.Account.deleteOne({ _id: accountId, user: userId }).orFail();
    return { accountId };
  }
}
