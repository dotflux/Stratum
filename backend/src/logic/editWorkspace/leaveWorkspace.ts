import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { TaskService } from 'src/services/task.service';

dotenv.config();

export const leaveWorkspace = async (
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

    if (workspace.members.length === 1) {
      throw new BadRequestException('Just delete the workspace');
    }

    const isOwner = workspace.owner.equals(user._id);
    const isAdmin = workspace.admins.includes(user._id);

    if (isOwner && workspace.admins.length > 0) {
      const randomAdmin =
        workspace.admins[Math.floor(Math.random() * workspace.admins.length)];
      workspace.owner = randomAdmin;
      await workspace.save();
    }
    if (isOwner && workspace.admins.length === 0) {
      const randomMember =
        workspace.members[Math.floor(Math.random() * workspace.members.length)];
      workspace.owner = randomMember;
      await workspace.save();
    }
    if (isAdmin) {
      await workspaceService.removeAdmin(workspace._id, user._id);
    }

    await workspaceService.removeMember(workspace._id, user._id);
    await userService.removeTenantByWorkspaceId(user._id.toString(), id);

    const tasks = await taskService.findAllTasks(user._id, workspace._id);
    for (const task of tasks) {
      const exists = await taskService.findById(task._id.toString());
      if (!exists) {
        throw new BadRequestException('Invalid task');
      }
      await userService.removeTaskById(
        user._id.toString(),
        task._id.toString(),
      );
      await workspaceService.removeTaskById(id, task._id.toString());
      await taskService.deleteById(task._id.toString());
    }

    await workspaceService.addLog(id, `${user.username} left the workspace`);

    return {
      valid: true,
      message: 'Workspace left successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace leaving: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
