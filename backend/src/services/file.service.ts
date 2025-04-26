import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File, FileDocument } from 'src/models/file.schema';
import path from 'path';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name)
    private FileModel: Model<FileDocument>,
  ) {}

  async createFile(
    originalName: string,
    fileName: string,
    mimeType: string,
    size: number,
    path: string,
    uploadedBy: Types.ObjectId,
    workspace: Types.ObjectId,
  ) {
    const file = new this.FileModel({
      originalName,
      fileName,
      mimeType,
      size,
      path,
      uploadedBy,
      workspace,
    });

    return file.save();
  }

  async findFilesByWorkspace(workspaceId: Types.ObjectId) {
    return this.FileModel.find({ workspace: workspaceId }).sort({
      createdAt: -1,
    });
  }

  async findById(fileId: string) {
    return this.FileModel.findById(fileId);
  }

  async deleteById(id: string) {
    await this.FileModel.deleteOne({ _id: id });
  }

  async findAll(id: Types.ObjectId) {
    return this.FileModel.find({ workspace: id });
  }
}
