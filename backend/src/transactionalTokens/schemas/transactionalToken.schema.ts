import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TransactionalTokenDocument = HydratedDocument<TransactionalToken>;

@Schema()
export class TransactionalToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({
    required: true,
    enum: ['EMAIL', 'PASSWORD'],
  })
  scope: string;
}

export const TransactionalTokenSchema =
  SchemaFactory.createForClass(TransactionalToken);
