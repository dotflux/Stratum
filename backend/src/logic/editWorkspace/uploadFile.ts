import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { FileService } from 'src/services/file.service';

dotenv.config();

export const uploadFile = async (
  req: Request,
  id: string,
  file: Express.Multer.File,
  userService: UserService,
  workspaceService: WorkspaceService,
  fileService: FileService,
) => {
  try {
    const token = req.cookies?.user_token; // Extract token from cookies

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    if (!decoded?.id) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await userService.findById(decoded?.id);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const workspace = await workspaceService.findById(id);
    if (!workspace) {
      throw new UnauthorizedException('Invalid workspace id');
    }

    const isMember = workspace.members.includes(user._id);
    if (!isMember) {
      throw new UnauthorizedException('Not a member');
    }
    const isAdmin = workspace.admins.includes(user._id);
    const isOwner = workspace.owner.equals(user._id);

    if (!isAdmin && !isOwner) {
      throw new UnauthorizedException(
        'That action requires administrator action',
      );
    }

    if (!file) throw new BadRequestException('No file uploaded');

    const MAX_FILE_SIZE = {
      free: 10 * 1024 * 1024, // 10MB
      pro: 25 * 1024 * 1024, // 25MB
    };

    const limit =
      MAX_FILE_SIZE[user.tier as keyof typeof MAX_FILE_SIZE] ??
      MAX_FILE_SIZE.free;

    if (file.size > limit) {
      throw new BadRequestException(
        `Your plan allows file uploads up to ${limit / (1024 * 1024)}MB`,
      );
    }

    const fileMetadata = {
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: user._id,
      workspace: workspace._id,
    };

    const newFile = await fileService.createFile(
      fileMetadata.originalName,
      fileMetadata.fileName,
      fileMetadata.mimeType,
      fileMetadata.size,
      fileMetadata.path,
      fileMetadata.uploadedBy,
      fileMetadata.workspace,
    );

    await workspaceService.addLog(id, `${user.username} uploaded a file`);

    return {
      valid: true,
      message: 'File uploaded successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace uploading file: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
