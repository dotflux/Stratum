import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DummyUser, DummyUserDocument } from 'src/models/dummyUser.schema';

@Injectable()
export class DummyUserService {
  constructor(
    @InjectModel(DummyUser.name) private userModel: Model<DummyUserDocument>,
  ) {}

  async createUser(
    username: string,
    email: string,
    password: string,
    otp: string,
  ) {
    const newUser = new this.userModel({ username, email, password, otp });
    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findUsername(username: string) {
    return await this.userModel.findOne({ username: username });
  }

  async deleteByEmail(email: string) {
    return await this.userModel.deleteOne({ email: email });
  }
}
