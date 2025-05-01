import { Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import * as validator from 'validator';

dotenv.config();

export const changeUsername = async (
  req: Request,
  name: string,
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

    if (!name || name.length <= 0) {
      throw new BadRequestException('No name provided');
    }

    if (name.length < 5 || name.length > 10) {
      throw new BadRequestException(
        'Username must be minimum 5 characters and maximum 10',
      );
    }

    if (user.username === name) {
      throw new BadRequestException('No changes detected');
    }

    if (!validator.isAlphanumeric(name)) {
      throw new BadRequestException('Name must be alphanumeric');
    }

    const exists = await userService.findUsername(name);
    if (exists) {
      throw new BadRequestException('The username is already in use');
    }

    user.username = name;
    user.save();

    return {
      valid: true,
      message: 'username changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in username change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
