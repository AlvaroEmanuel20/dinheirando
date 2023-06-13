export interface User {
  _id: string;
  avatar: string;
  avatarUrl: string;
  name: string;
  email: string;
  isVerified: boolean;
  isGoogleAccount: boolean;
  incomeGoal: number;
  expenseGoal: number;
}

export interface UserId {
  userId: string;
}
