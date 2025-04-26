import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export const changeDescription = async (
  req: Request,
  id: string,
  description: string,
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

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('This is an administrator action');
    }

    if (description.length <= 0) {
      throw new BadRequestException('No description provided');
    }

    if (description.length >= 120) {
      throw new BadRequestException(
        'Workspace description cant exceed 120 characters',
      );
    }

    if (workspace.description === description) {
      throw new BadRequestException('No changes detected');
    }

    workspace.description = description;
    await workspace.save();

    await workspaceService.addLog(
      id,
      `${user.username} changed the workspace description`,
    );

    return {
      valid: true,
      message: 'Workspace description changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace description change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
