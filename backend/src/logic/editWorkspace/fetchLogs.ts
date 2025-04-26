import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export interface Log {
  log: string;
  date: Date;
}

export const fetchLogs = async (
  req: Request,
  id: string,
  userService: UserService,
  workspaceService: WorkspaceService,
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

    if (workspace.logs.length <= 0) {
      throw new BadRequestException('No logs available');
    }

    return {
      valid: true,
      message: 'logs retreived successfully',
      logs: workspace.logs,
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace fetching logs: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
