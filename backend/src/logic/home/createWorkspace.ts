import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export const createWorkspace = async (
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

    const allWorkspaces = await workspaceService.findOwnerWorkspaces(user._id);
    if (user.tier === 'free' && allWorkspaces.length === 1) {
      throw new BadRequestException({
        valid: false,
        error: 'Free plan can only create 1 workspace',
      });
    }

    if (user.tier === 'pro' && allWorkspaces.length >= 10) {
      throw new BadRequestException({
        valid: false,
        error: 'Pro plan can only create 10 workspace',
      });
    }

    if (!req.body.workspaceName || req.body.workspaceName.length <= 0) {
      throw new BadRequestException({
        valid: false,
        error: 'Workspace name must be provided',
      });
    }

    if (req.body.workspaceName.length >= 20) {
      throw new BadRequestException({
        valid: false,
        error: 'Workspace name must be less than 20 characters',
      });
    }

    if (req.body.description.length >= 120) {
      throw new BadRequestException({
        valid: false,
        error: 'Workspace description must be less than 120 characters',
      });
    }

    const workspaceName = req.body.workspaceName;
    const description = req.body.description;
    const defaultRole = req.body.defaultRole;
    const usernames = req.body.usernames;

    if (usernames.length > 10) {
      throw new BadRequestException({
        valid: false,
        error: "Can't pick more than 10 initial members",
      });
    }

    if (user.tier === 'free' && usernames.length >= 5) {
      throw new BadRequestException({
        valid: false,
        error: 'Free plan can only have 5 members in workspace',
      });
    }

    if (user.tier === 'pro' && usernames.length >= 15) {
      throw new BadRequestException({
        valid: false,
        error: 'Pro plan can only have 15 members in workspace',
      });
    }

    let members: Types.ObjectId[] = [user._id];

    if (usernames.length > 0) {
      for (const member of usernames) {
        const exists = await userService.findUsername(member);
        if (!exists) {
          throw new BadRequestException({
            valid: false,
            error: 'Valid usernames must be provided',
          });
        }
        members.push(exists._id);
      }
    }

    let admins: Types.ObjectId[] = [];

    if (defaultRole === 'Admin' && usernames.length > 0) {
      for (const member of usernames) {
        const exists = await userService.findUsername(member);
        if (!exists) {
          throw new BadRequestException({
            valid: false,
            error: 'Valid usernames must be provided',
          });
        }
        admins.push(exists._id);
      }
    }

    const newWorkspace = await workspaceService.createWorkspace(
      workspaceName,
      description,
      defaultRole,
      user._id,
      members,
      admins,
    );

    await workspaceService.addLog(
      newWorkspace._id.toString(),
      `${user.username} created the workspace: ${newWorkspace.name}`,
    );

    if (usernames.length > 0) {
      for (const member of usernames) {
        const exists = await userService.findUsername(member);
        if (!exists) {
          throw new BadRequestException({
            valid: false,
            error: 'Valid usernames must be provided',
          });
        }
        exists.tenants.push({
          id: newWorkspace._id,
          role: defaultRole.toLowerCase(),
          joinedAt: new Date(),
        });
        await exists.save();
        await workspaceService.addLog(
          newWorkspace._id.toString(),
          `${user.username} added ${exists.username}`,
        );
      }
    }

    user.tenants.push({
      id: newWorkspace._id,
      role: 'admin',
      joinedAt: new Date(),
    });
    if (!user.rewardLog.createdWorkspace) {
      user.strats += 500;
      user.rewardLog.createdWorkspace = true;
      user.save();
    }
    user.save();

    return { valid: true, message: 'Workspace created' };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in creating workspace: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
