import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account } from './schemas/account.schema';
import { CreateAccountDto, UpdateAccountDto } from './dto/accounts.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private readonly Account: Model<Account>,
  ) {}

  async showAccounts(userId: string) {
    return await this.Account.find({ user: userId });
  }

  async showAccount(accountId: string) {
    return await this.Account.findById(accountId);
  }

  async createAccount(data: CreateAccountDto, userId: string) {
    const newAccount = await this.Account.create({
      user: userId,
      ...data,
    });

    return { accountId: newAccount._id };
  }

  async updateAccount(data: UpdateAccountDto, accountId: string) {
    await this.Account.findByIdAndUpdate(accountId, data).orFail();
    return { accountId };
  }

  async deleteAccount(accountId: string) {
    await this.Account.findByIdAndDelete(accountId).orFail();
    return { accountId };
  }
}
