import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(username: string, email: string, password: string) {
    const newUser = new this.userModel({ username, email, password });
    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findUsername(username: string) {
    return await this.userModel.findOne({ username: username });
  }

  async findById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async removeTaskById(id: string, taskId: string) {
    return await this.userModel.updateOne(
      { _id: id },
      { $pull: { tasks: new Types.ObjectId(taskId) } },
    );
  }

  async removeTenantByWorkspaceId(userId: string, workspaceId: string) {
    return await this.userModel.updateOne(
      { _id: userId },
      { $pull: { tenants: { id: new Types.ObjectId(workspaceId) } } },
    );
  }
}
