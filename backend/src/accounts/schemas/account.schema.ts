import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema()
export class Account {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, default: 0 })
  amount: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
