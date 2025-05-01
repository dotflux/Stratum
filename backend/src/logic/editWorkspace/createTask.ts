import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import { TaskService } from 'src/services/task.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export const createTask = async (
  req: Request,
  name: string,
  description: string,
  assignedTo: string,
  steps: string[],
  deadline: { days: number; hours: number; minutes: number },
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

    const isMember = workspace.members.some((member) =>
      member.equals(user._id),
    );
    if (!isMember) {
      throw new UnauthorizedException('Not a member');
    }
    const isAdmin = workspace.admins.includes(user._id);
    const isOwner = workspace.owner.equals(user._id);

    if (!isAdmin && !isOwner) {
      throw new UnauthorizedException({
        valid: false,
        error: 'This is an administrator action',
      });
    }

    if (user.tier === 'free' && workspace.tasks.length >= 30) {
      throw new BadRequestException({
        valid: false,
        error: 'Free plan only allows 30 total tasks',
      });
    }

    if (user.tier === 'pro' && workspace.tasks.length >= 100) {
      throw new BadRequestException({
        valid: false,
        error: 'Pro plan only allows 100 total tasks',
      });
    }

    if (name.length <= 0) {
      throw new BadRequestException({
        valid: false,
        error: 'This field is required',
      });
    }

    if (name.length >= 20) {
      throw new BadRequestException({
        valid: false,
        error: 'Task name cant exceed 20 characters',
      });
    }

    const taskExists = await taskService.findTaskName(name);
    if (taskExists) {
      const inWorkspace = workspace.tasks.includes(taskExists._id);
      if (inWorkspace) {
        throw new BadRequestException({
          valid: false,
          error: 'Task already exists',
        });
      }
    }

    let assignedUserId: Types.ObjectId;

    if (assignedTo.length > 0) {
      const assignedUser = await userService.findUsername(assignedTo);
      if (!assignedUser) {
        throw new BadRequestException({
          valid: false,
          error: "Assigned user doesn't exist",
        });
      }
      const userInWorkspace = workspace.members.includes(assignedUser._id);
      if (!userInWorkspace) {
        throw new BadRequestException({
          valid: false,
          error: 'This user is not in the workspace',
        });
      }
      assignedUserId = assignedUser._id;
    } else {
      assignedUserId = user._id;
    }

    const totalMinutes =
      deadline.days * 24 * 60 + deadline.hours * 60 + deadline.minutes;

    if (totalMinutes < 30) {
      throw new BadRequestException({
        valid: false,
        error: 'Deadline must be at least 30 minutes.',
      });
    }

    if (totalMinutes > 30 * 24 * 60) {
      throw new BadRequestException({
        valid: false,
        error: 'Deadline cannot exceed 30 days.',
      });
    }

    const totalMs =
      (deadline.days * 24 * 60 * 60 +
        deadline.hours * 60 * 60 +
        deadline.minutes * 60) *
      1000;

    const deadlineDate = new Date(Date.now() + totalMs);

    let taskSteps: { task: string; done: boolean }[] = [];

    if (steps.length > 0) {
      for (const step of steps) {
        taskSteps.push({ task: step, done: false });
      }
    }

    const assingedUserDocument = await userService.findById(
      assignedUserId.toString(),
    );
    if (!assingedUserDocument) {
      throw new BadRequestException({
        valid: false,
        error: "Assigned user doesn't exist",
      });
    }

    const newTask = await taskService.createTask(
      name,
      description,
      assignedUserId,
      assingedUserDocument.username,
      workspace._id,
      taskSteps,
      deadlineDate,
    );

    const selfAssigned = newTask.assignedTo.equals(user._id);

    workspace.tasks.push(newTask._id);
    assingedUserDocument.tasks.push(newTask._id);
    await workspace.save();
    await assingedUserDocument.save();
    if (selfAssigned) {
      await workspaceService.addLog(
        id,
        `${user.username} assigned himself the task: ${name}`,
      );
    } else {
      await workspaceService.addLog(
        id,
        `${user.username} assigned ${assingedUserDocument.username} the task: ${name}`,
      );
    }

    user.strats += 5;
    user.save();

    return { valid: true, message: 'Task created successfully' };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in task creation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
