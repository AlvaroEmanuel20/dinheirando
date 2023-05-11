import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class TransferDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  fromAccount: string | Types.ObjectId;

  @ApiProperty()
  toAccount: string | Types.ObjectId;

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
  fromAccount: string | Types.ObjectId;

  @ApiProperty()
  toAccount: string | Types.ObjectId;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}

export class UpdateTransferDto {
  @ApiPropertyOptional()
  fromAccount: string | Types.ObjectId;

  @ApiPropertyOptional()
  toAccount: string | Types.ObjectId;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  createdAt: Date;
}
