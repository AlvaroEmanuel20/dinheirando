import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { Category } from 'src/categories/schemas/category.schema';

export class TransactionDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  type: 'income' | 'expense';

  @ApiProperty()
  category: string | Types.ObjectId | Category;

  @ApiProperty()
  account: string | Types.ObjectId | Account;
}

export class TransactionIdDto {
  @ApiProperty()
  transactionId: string;
}

export class CreateTransactionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  type: 'income' | 'expense';

  @ApiProperty()
  category: string | Types.ObjectId | Category;

  @ApiProperty()
  account: string | Types.ObjectId | Account;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  value?: number;

  @ApiPropertyOptional()
  createdAt?: Date;

  @ApiPropertyOptional()
  type?: 'income' | 'expense';

  @ApiPropertyOptional()
  category?: string | Types.ObjectId | Category;

  @ApiPropertyOptional()
  account?: string | Types.ObjectId | Account;
}

export class TransactionsTotalDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  totalIncome: number;

  @ApiProperty()
  totalExpense: number;
}
