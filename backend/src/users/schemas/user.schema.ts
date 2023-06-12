import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar: string;

  @Prop()
  avatarUrl: string;

  @Prop({ required: true, default: false })
  isGoogleAccount: boolean;

  @Prop({ required: true, default: false })
  isVerified: boolean;

  @Prop({ required: true, default: 0 })
  incomeGoal: number;

  @Prop({ required: true, default: 0 })
  expenseGoal: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
