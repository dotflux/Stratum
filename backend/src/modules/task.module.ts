import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from 'src/models/task.schema';
import { TaskService } from 'src/services/task.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
  ],
  exports: [TaskService],
  providers: [TaskService],
})
export class TaskModule {}
