import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  DummyResets,
  DummyResetsDocument,
} from 'src/models/dummyResets.schema';

@Injectable()
export class DummyResetsService {
  constructor(
    @InjectModel(DummyResets.name)
    private userModel: Model<DummyResetsDocument>,
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
