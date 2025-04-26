import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import { TaskService } from 'src/services/task.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export interface Member {
  username: string;
  role: string;
  tasks: number;
}

export const listMembers = async (
  req: Request,
  id: string,
  userService: UserService,
  workspaceService: WorkspaceService,
  taskService: TaskService,
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

    let members: Member[] = [];

    for (const member of workspace.members) {
      const exists = await userService.findById(member.toString());
      if (!exists) {
        throw new BadRequestException('Not a valid member');
      }
      const taskDocs = await taskService.findAllTasks(
        exists._id,
        workspace._id,
      );
      const taskCount = taskDocs.length;
      const isAdmin = workspace.admins.includes(exists._id);
      const isOwner = workspace.owner.equals(exists._id);

      let role = 'Member'; // Default role

      if (isOwner) {
        role = 'Owner';
      } else if (isAdmin) {
        role = 'Admin';
      }
      members.push({ username: exists.username, role, tasks: taskCount });
    }

    return {
      valid: true,
      message: 'Members listed successfully',
      members,
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace listing members: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
