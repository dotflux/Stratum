import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Workspace, WorkspaceDocument } from 'src/models/workspace.schema';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name)
    private WorkspaceModel: Model<WorkspaceDocument>,
  ) {}

  async createWorkspace(
    name: string,
    description: string,
    defaultRole: string,
    owner: Types.ObjectId,
    members: Types.ObjectId[] = [],
    admins: Types.ObjectId[] = [],
  ) {
    const newWorkspace = new this.WorkspaceModel({
      name,
      description,
      defaultRole,
      owner,
      members,
      admins,
    });

    return newWorkspace.save();
  }

  async findWorkspacename(Workspacename: string) {
    return await this.WorkspaceModel.findOne({ Workspacename: Workspacename });
  }

  async findById(id: string) {
    return await this.WorkspaceModel.findOne({ _id: id });
  }

  async removeTaskById(id: string, taskId: string) {
    return await this.WorkspaceModel.updateOne(
      { _id: id },
      { $pull: { tasks: new Types.ObjectId(taskId) } },
    );
  }

  async addLog(id: string, log: string) {
    return await this.WorkspaceModel.updateOne(
      { _id: id },
      {
        $push: {
          logs: {
            log,
            date: new Date(),
          },
        },
      },
    ).exec();
  }

  async removeUser(id: Types.ObjectId, user: Types.ObjectId) {
    await this.WorkspaceModel.findByIdAndUpdate(
      id,
      { $pull: { members: user } },
      { new: true },
    );
  }

  async removeAdmin(id: Types.ObjectId, user: Types.ObjectId) {
    await this.WorkspaceModel.findByIdAndUpdate(
      id,
      { $pull: { admins: user } },
      { new: true },
    );
  }

  async deleteById(id: Types.ObjectId) {
    await this.WorkspaceModel.deleteOne({ _id: id });
  }

  async removeMember(id: Types.ObjectId, user: Types.ObjectId) {
    await this.WorkspaceModel.findByIdAndUpdate(
      id,
      { $pull: { members: user } },
      { new: true },
    );
  }
}
