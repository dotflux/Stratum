import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import { TaskService } from 'src/services/task.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export interface Steps {
  task: string;
  done: boolean;
}

export const listTasks = async (
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
    const isAdmin = workspace.admins.includes(user._id);
    const isOwner = workspace.owner.equals(user._id);

    let taskInfo: {
      taskId: string;
      name: string;
      description: string;
      deadline: Date;
      steps: Steps[];
      assignedTo: string;
      createdAt: Date;
    }[] = [];

    if (workspace.tasks.length > 0) {
      for (const task of workspace.tasks) {
        const taskDoc = await taskService.findById(task.toString());
        if (!taskDoc) {
          throw new BadRequestException('Invalid task id');
        }
        taskInfo.push({
          taskId: taskDoc._id.toString(),
          name: taskDoc.name,
          description: taskDoc.description,
          deadline: taskDoc.deadline,
          steps: taskDoc.steps,
          assignedTo: taskDoc.assignedUsername,
          createdAt: taskDoc.createdAt,
        });
      }
    }

    return {
      valid: true,
      message: 'Tasks listed successfully',
      tasks: taskInfo,
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace listing tasks: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
