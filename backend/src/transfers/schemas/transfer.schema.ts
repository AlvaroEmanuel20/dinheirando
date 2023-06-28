import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { User } from 'src/users/schemas/user.schema';

export type TransferDocument = HydratedDocument<Transfer>;

@Schema()
export class Transfer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  fromAccount: Account;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  toAccount: Account;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const TransferSchema = SchemaFactory.createForClass(Transfer);
