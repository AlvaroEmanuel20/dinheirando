export class CreateUserDto {
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
