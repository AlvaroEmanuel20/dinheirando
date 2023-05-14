export interface TransactionsTotals {
  total: number;
  totalIncome: number;
  totalExpense: number;
}

export interface Transaction {
  _id: string;
  name: string;
  value: number;
  createdAt: Date;
  type: 'income' | 'expense';
  category: {
    _id: string;
    name: string;
  };
  account: {
    _id: string;
    name: string;
  };
}

export interface TransactionId {
  transactionId: string;
}
