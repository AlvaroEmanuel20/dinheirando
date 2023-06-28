import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { Category } from 'src/categories/schemas/category.schema';
import { User } from 'src/users/schemas/user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  account: Account;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
