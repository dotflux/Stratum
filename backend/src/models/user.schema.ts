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

  @Prop({ type: Number, default: 0 })
  strats: number;

  @Prop({ type: String, default: 'free' })
  tier: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }], default: [] })
  tasks: Types.ObjectId[];

  @Prop({
    type: {
      createdWorkspace: { type: Boolean, default: false },
      addedMembers: { type: [Types.ObjectId], default: [] },
    },
    default: () => ({}),
  })
  rewardLog: {
    createdWorkspace: boolean;
    assignedTasks: Types.ObjectId[];
    completedTasks: Types.ObjectId[];
    addedMembers: Types.ObjectId[];
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
