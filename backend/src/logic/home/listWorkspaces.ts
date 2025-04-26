import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

export interface WorkspaceData {
  name: string;
  description: string;
  id: Types.ObjectId;
  memberCount: number;
  role: string;
}

dotenv.config();

export const listWorkspaces = async (
  req: Request,
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

    const workspaceData: WorkspaceData[] = [];
    for (const workspace of user.tenants) {
      const exists = await workspaceService.findById(workspace.id.toString());
      if (!exists) {
        throw new BadRequestException({
          valid: false,
          error: 'Workspace doesnt exist',
        });
      }
      workspaceData.push({
        name: exists.name,
        description: exists.description,
        memberCount: exists.members.length,
        role: workspace.role,
        id: exists._id,
      });
    }

    return { valid: true, workspaces: workspaceData };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in listing workspaces: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
