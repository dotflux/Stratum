import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { FileService } from 'src/services/file.service';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

export const deleteFile = async (
  req: Request,
  id: string,
  fileId: string,
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
        'That action requires administrator permission',
      );
    }

    const file = await fileService.findById(fileId);
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await fileService.deleteById(fileId);

    const filePath = path.join(
      process.cwd(),
      'uploads',
      file.workspace.toString(),
      file.fileName,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await workspaceService.addLog(id, `${user.username} deleted a file`);

    return {
      valid: true,
      message: 'File deleted successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace deleting file: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
