export interface User {
  _id: string;
  avatar: string;
  name: string;
  email: string;
  isVerified: boolean;
  isGoogleAccount: boolean;
  incomeGoal: number;
  expenseGoal: number;
}
