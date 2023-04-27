export class CreateUserDto {
  avatar?: string;
  isVerified?: boolean;
  isGoogleAccount?: boolean;
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  avatar?: string;
  name?: string;
  email?: string;
  password?: string;
  incomeGoal?: number;
  expenseGoal?: number;
}

export class ResetPasswordDto {
  email: string;
}

export class PutResetPasswordDto {
  password: string;
  confirmPassword: string;
}
