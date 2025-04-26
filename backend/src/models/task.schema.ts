import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  assignedTo: Types.ObjectId;

  @Prop({ required: true })
  assignedUsername: string;

  @Prop({ type: Types.ObjectId, ref: 'Workspace', required: true })
  workspace: Types.ObjectId;

  @Prop({
    type: [
      {
        task: { type: String, required: true },
        done: { type: Boolean, default: false },
      },
    ],
    default: [],
  })
  steps: { task: string; done: boolean }[];

  @Prop({ type: Date, required: true })
  deadline: Date;

  @Prop({ default: Date.now }) // TTL index: auto-delete after 5 mins
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
