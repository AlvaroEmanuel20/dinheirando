import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, default: 0 })
  totalOfTransactions: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
