import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [
      {
        id: { type: Types.ObjectId, ref: 'Workspace', required: true },
        role: { type: String, required: true, enum: ['admin', 'member'] },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  tenants: { id: Types.ObjectId; role: string; joinedAt: Date }[];
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasks: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
