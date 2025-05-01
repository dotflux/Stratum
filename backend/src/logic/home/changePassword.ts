import { Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

dotenv.config();

export const changePassword = async (
  req: Request,
  newPassword: string,
  currentPassword: string,
  userService: UserService,
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

    if (newPassword.length > 12 || newPassword.length < 8) {
      throw new BadRequestException(
        'New password must be min 8 and max 12 letters',
      );
    }

    if (newPassword === currentPassword) {
      throw new BadRequestException('New password cant be same as current');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password cant be same as current');
    }

    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) {
      throw new BadRequestException('Incorrect current password');
    }

    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.save();

    return {
      valid: true,
      message: 'password changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in password change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
