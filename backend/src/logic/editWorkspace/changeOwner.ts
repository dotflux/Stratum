import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export const changeOwner = async (
  req: Request,
  id: string,
  ownerUsername: string,
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

    if (!isOwner) {
      throw new BadRequestException(
        'This action can only be performed by the owner',
      );
    }

    const ownerUser = await userService.findUsername(ownerUsername);
    if (!ownerUser) {
      throw new BadRequestException('Not a valid username');
    }

    if (ownerUser._id === user._id) {
      throw new BadRequestException('Cant transfer ownership to yourself');
    }

    if (workspace.owner.equals(ownerUser._id)) {
      throw new BadRequestException('That person is already the owner');
    }

    const tenant = ownerUser.tenants.find(
      (tenant) => tenant.id.toString() === id,
    );
    if (!tenant) {
      throw new BadRequestException('Something went wrong');
    }

    tenant.role = 'admin';
    workspace.owner = ownerUser._id;
    if (!isAdmin) {
      workspace.admins.push(user._id);
    }
    await workspace.save();
    await ownerUser.save();

    await workspaceService.addLog(
      id,
      `${user.username} transfered the ownership to ${ownerUser.username}`,
    );

    return {
      valid: true,
      message: 'Workspace owner changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace owner change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
