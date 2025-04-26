import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

export interface UserData {
  username: string;
  tenants: { id: Types.ObjectId; role: string; joinedAt: Date }[];
}

dotenv.config();

export const authWorkspace = async (
  req: Request,
  userService: UserService,
  workspaceService: WorkspaceService,
  id: string,
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
    let role: string = 'member';
    if (workspace.owner.equals(user._id)) {
      role = 'owner';
    } else if (isAdmin) {
      role = 'admin';
    }
    let administrator: boolean = false;

    if (isAdmin || workspace.owner.equals(user._id)) {
      administrator = true;
    }

    const workspaceData = {
      name: workspace.name,
      description: workspace.description,
      members: workspace.members,
      tasks: workspace.tasks,
      role: role,
      username: user.username,
      administrator,
      defaultRole: workspace.defaultRole,
    };

    return { valid: true, workspace: workspaceData };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace auth validation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
