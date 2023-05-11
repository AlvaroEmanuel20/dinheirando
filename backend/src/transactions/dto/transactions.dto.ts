import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

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
  category: string | Types.ObjectId;

  @ApiProperty()
  account: string | Types.ObjectId;
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
  category: string | Types.ObjectId;

  @ApiProperty()
  account: string | Types.ObjectId;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  type: 'income' | 'expense';

  @ApiPropertyOptional()
  category: string | Types.ObjectId;

  @ApiPropertyOptional()
  account: string | Types.ObjectId;
}
