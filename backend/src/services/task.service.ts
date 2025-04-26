import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from 'src/models/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private TaskModel: Model<TaskDocument>,
  ) {}

  async createTask(
    name: string,
    description: string,
    assignedTo: Types.ObjectId,
    assignedUsername: string,
    workspace: Types.ObjectId,
    steps: { task: string; done: boolean }[],
    deadline: Date,
  ) {
    const newTask = new this.TaskModel({
      name,
      description,
      assignedTo,
      assignedUsername,
      workspace,
      steps,
      deadline,
    });
    return newTask.save();
  }

  async findTaskName(taskName: string) {
    return await this.TaskModel.findOne({ name: taskName });
  }

  async findById(id: string) {
    return await this.TaskModel.findOne({ _id: id });
  }

  async deleteById(id: string) {
    return await this.TaskModel.deleteOne({ _id: id });
  }

  async findAllTasks(id: Types.ObjectId, workspaceId: Types.ObjectId) {
    return await this.TaskModel.find({
      assignedTo: id,
      workspace: workspaceId,
    });
  }

  async findAllWorkspaceTasks(workspaceId: Types.ObjectId) {
    return await this.TaskModel.find({
      workspace: workspaceId,
    });
  }
}
