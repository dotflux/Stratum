import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { WorkspaceService } from 'src/services/workspace.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';

dotenv.config();

export const changeRole = async (
  req: Request,
  id: string,
  memberUser: string,
  newRole: string,
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

    if (!isAdmin && !isOwner) {
      throw new BadRequestException('This is an administrator action');
    }
    const member = await userService.findUsername(memberUser);
    if (!member) {
      throw new BadRequestException('Not a valid user');
    }

    if (member._id === user._id) {
      throw new BadRequestException('Can not change your own role');
    }

    if (workspace.owner.equals(member._id)) {
      throw new BadRequestException('Can not change the owner role');
    }

    const tenant = member.tenants.find((tenant) => tenant.id.toString() === id);
    if (!tenant) {
      throw new BadRequestException('Something went wrong');
    }

    if (tenant.role === newRole.toLowerCase()) {
      throw new BadRequestException('No changes to role were made');
    }

    if (newRole === 'Member' && workspace.admins.includes(member._id)) {
      await workspaceService.removeAdmin(workspace._id, member._id);
    } else if (newRole === 'Admin' && !workspace.admins.includes(member._id)) {
      workspace.admins.push(member._id);
      await workspace.save();
    }

    tenant.role = newRole.toLowerCase();
    await member.save();

    await workspaceService.addLog(
      id,
      `${user.username} changed the role of ${member.username} to ${newRole}`,
    );

    return {
      valid: true,
      message: 'Members role changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in workspace member role change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
