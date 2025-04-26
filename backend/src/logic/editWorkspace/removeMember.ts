import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { TaskService } from 'src/services/task.service';

dotenv.config();

export const removeMember = async (
  req: Request,
  id: string,
  username: string,
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

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('This is an administrator action');
    }

    const toBeRemoved = await userService.findUsername(username);
    if (!toBeRemoved) {
      throw new BadRequestException('Not a valid member');
    }

    if (workspace.owner.equals(toBeRemoved._id)) {
      throw new BadRequestException('Can not kick the owner');
    }

    if (toBeRemoved._id === user._id) {
      throw new BadRequestException('Can not kick yourself');
    }

    if (workspace.admins.includes(toBeRemoved._id)) {
      await workspaceService.removeAdmin(workspace._id, toBeRemoved._id);
    }

    await workspaceService.removeUser(workspace._id, toBeRemoved._id);

    const tasks = await taskService.findAllTasks(
      toBeRemoved._id,
      workspace._id,
    );

    for (const task of tasks) {
      await userService.removeTaskById(
        toBeRemoved._id.toString(),
        task._id.toString(),
      );
      await workspaceService.removeTaskById(
        workspace._id.toString(),
        task._id.toString(),
      );
      await taskService.deleteById(task._id.toString());
    }

    await userService.removeTenantByWorkspaceId(toBeRemoved._id.toString(), id);

    await workspaceService.addLog(
      id,
      `${user.username} removed ${toBeRemoved.username}`,
    );

    return {
      valid: true,
      message: 'Member removed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace removing members: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
