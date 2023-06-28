import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}

export class AccountIdDto {
  @ApiProperty()
  accountId: string;
}

export class CreateAccountDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  amount: number;
}

export class UpdateAccountDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  amount?: number;
}

export class AccountsTotalDto {
  @ApiProperty()
  total: number;
}
