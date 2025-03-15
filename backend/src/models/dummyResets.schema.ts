import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DummyResetsDocument = HydratedDocument<DummyResets>;

@Schema()
export class DummyResets {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now, expires: '5m' }) // TTL index: auto-delete after 5 mins
  createdAt: Date;
}

export const DummyResetsSchema = SchemaFactory.createForClass(DummyResets);
