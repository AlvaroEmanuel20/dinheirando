import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { TransactionalTokensModule } from 'src/transactionalTokens/transactionalTokens.module';
import { ConfigModule } from '@nestjs/config';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/auth/schemas/refreshToken.schema';
import {
  TransactionalToken,
  TransactionalTokenSchema,
} from 'src/transactionalTokens/schemas/transactionalToken.schema';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import {
  Transaction,
  TransactionSchema,
} from 'src/transactions/schemas/transaction.schema';
import {
  Transfer,
  TransferSchema,
} from 'src/transfers/schemas/transfer.schema';
import { Account, AccountSchema } from 'src/accounts/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: TransactionalToken.name, schema: TransactionalTokenSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Transfer.name, schema: TransferSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
    MailModule,
    TransactionalTokensModule,
    ConfigModule,
  ],
  controllers: [UsersController, PasswordController],
  providers: [UsersService, PasswordService],
  exports: [UsersService],
})
export class UsersModule {}
