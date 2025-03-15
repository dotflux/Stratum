import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DummyUserDocument = HydratedDocument<DummyUser>;

@Schema()
export class DummyUser {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now, expires: '5m' }) // TTL index: auto-delete after 5 mins
  createdAt: Date;
}

export const DummyUserSchema = SchemaFactory.createForClass(DummyUser);
