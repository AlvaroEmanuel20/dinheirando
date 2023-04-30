import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isGoogleAccount: boolean;

  @ApiProperty()
  incomeGoal: number;

  @ApiProperty()
  expenseGoal: number;
}

export class UserIdDto {
  @ApiProperty()
  userId: string;
}

export class CreateUserDto {
  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  isVerified?: boolean;

  @ApiPropertyOptional()
  isGoogleAccount?: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  avatar?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  incomeGoal?: number;

  @ApiPropertyOptional()
  expenseGoal?: number;
}

export class ResetPasswordDto {
  @ApiProperty()
  email: string;
}

export class PutResetPasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  token: string;
}
