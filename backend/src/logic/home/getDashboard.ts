import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { TaskService } from 'src/services/task.service';

dotenv.config();

export interface Task {
  workspaceId: string;
  workspaceName: string;
  name: string;
  description: string;
  deadline: Date;
  createdAt: Date;
}

export const getDashboard = async (
  req: Request,
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

    const count = {
      workspaceCount: user.tenants.length,
      taskCount: user.tasks.length,
    };

    let taskInfo: Task[] = [];

    for (const task of user.tasks) {
      const exists = await taskService.findById(task.toString());
      if (!exists) {
        throw new BadRequestException('Invalid Task');
      }
      const workspace = await workspaceService.findById(
        exists.workspace.toString(),
      );
      if (!workspace) {
        throw new BadRequestException('Invalid workspace');
      }
      taskInfo.push({
        workspaceId: workspace._id.toString(),
        workspaceName: workspace.name,
        name: exists.name,
        description: exists.description,
        deadline: exists.deadline,
        createdAt: exists.createdAt,
      });
    }

    taskInfo.sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    );

    return {
      valid: true,
      message: 'Fetched Dashboard stats successfully',
      count,
      taskInfo,
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in fetching dashboard: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
