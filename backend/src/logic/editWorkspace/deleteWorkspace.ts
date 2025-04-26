import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { TaskService } from 'src/services/task.service';
import { FileService } from 'src/services/file.service';

dotenv.config();

export const deleteWorkspace = async (
  req: Request,
  id: string,
  workspaceName: string,
  userService: UserService,
  workspaceService: WorkspaceService,
  taskService: TaskService,
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
    const isOwner = workspace.owner.equals(user._id);

    if (!isOwner) {
      throw new BadRequestException(
        'This action can only be performed by the owner',
      );
    }

    if (workspaceName !== workspace.name) {
      throw new BadRequestException('The name does not match');
    }

    const tasks = await taskService.findAllWorkspaceTasks(workspace._id);
    for (const task of tasks) {
      const exists = await userService.findById(task.assignedTo.toString());
      if (!exists) {
        throw new BadRequestException('Invalid user');
      }
      await userService.removeTaskById(
        exists._id.toString(),
        task._id.toString(),
      );
      await taskService.deleteById(task._id.toString());
    }

    for (const member of workspace.members) {
      const exists = await userService.findById(member.toString());
      if (!exists) {
        throw new BadRequestException('Invalid user');
      }
      await userService.removeTenantByWorkspaceId(exists._id.toString(), id);
    }

    const files = await fileService.findAll(workspace._id);
    for (const file of files) {
      const exists = await fileService.findById(file._id.toString());
      if (!exists) {
        throw new BadRequestException('Invalid file');
      }
      await fileService.deleteById(file._id.toString());
    }

    await workspaceService.deleteById(workspace._id);

    return {
      valid: true,
      message: 'Workspace deleted successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace delete: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
