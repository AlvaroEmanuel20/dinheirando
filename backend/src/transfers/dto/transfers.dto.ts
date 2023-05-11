import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';

export class TransferDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fromAccount: string | Types.ObjectId | Account;

  @ApiProperty()
  toAccount: string | Types.ObjectId | Account;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}

export class TransferIdDto {
  @ApiProperty()
  transferId: string;
}

export class CreateTransferDto {
  @ApiProperty()
  fromAccount: string | Types.ObjectId | Account;

  @ApiProperty()
  toAccount: string | Types.ObjectId | Account;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}

export class UpdateTransferDto {
  @ApiPropertyOptional()
  fromAccount?: string | Types.ObjectId | Account;

  @ApiPropertyOptional()
  toAccount?: string | Types.ObjectId | Account;

  @ApiPropertyOptional()
  value?: number;

  @ApiPropertyOptional()
  createdAt?: Date;
}
