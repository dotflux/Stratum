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

export const updateSteps = async (
  req: Request,
  id: string,
  taskId: string,
  steps: Steps[],
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

    if (!taskId) {
      throw new BadRequestException('No id provided');
    }

    const taskDoc = await taskService.findById(taskId);
    if (!taskDoc) {
      throw new UnauthorizedException('Invalid task id');
    }

    const isMember = workspace.members.includes(user._id);
    if (!isMember) {
      throw new UnauthorizedException('Not a member');
    }

    const taskInWorkspace = workspace.tasks.includes(taskDoc._id);
    if (!taskInWorkspace) {
      throw new UnauthorizedException('Not a valid task');
    }

    const isAdmin = workspace.admins.includes(user._id);
    const isOwner = workspace.owner.equals(user._id);
    const isAssigned = taskDoc.assignedTo.equals(user._id);

    if (!isAssigned && !isAdmin && !isOwner) {
      throw new UnauthorizedException('Cant edit that task');
    }

    if (!steps || steps.length <= 0) {
      throw new BadRequestException('Steps not provided');
    }

    if (taskDoc.steps === steps) {
      throw new BadRequestException('Invalid request');
    }

    taskDoc.steps = steps;
    taskDoc.save();

    return {
      valid: true,
      message: 'Tasks updated successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace updating task steps: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
