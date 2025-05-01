import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DummyEmailChange,
  DummyEmailChangeDocument,
} from 'src/models/dummyEmailChange.schema';

@Injectable()
export class DummyEmailChangeService {
  constructor(
    @InjectModel(DummyEmailChange.name)
    private userModel: Model<DummyEmailChangeDocument>,
  ) {}

  async createUser(email: string, otp: string) {
    const newUser = new this.userModel({ email, otp });
    return newUser.save();
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async deleteByEmail(email: string) {
    return await this.userModel.deleteOne({ email: email });
  }
}
