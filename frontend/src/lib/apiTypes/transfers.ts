export interface Transfer {
  _id: string;
  fromAccount: {
    _id: string;
    name: string;
  };
  toAccount: {
    _id: string;
    name: string;
  };
  value: number;
  createdAt: Date;
}
