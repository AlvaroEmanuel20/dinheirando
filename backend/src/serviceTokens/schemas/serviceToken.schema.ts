//Service token are tokens used in transactional operations, refresh auth...

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ServiceTokenDocument = HydratedDocument<ServiceToken>;

@Schema()
export class ServiceToken {
  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ required: true, enum: ['REFRESH', 'TRANSACTIONAL'] })
  serviceType: string;
}

export const ServiceTokenSchema = SchemaFactory.createForClass(ServiceToken);
