import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

export const isLogged = async (req: Request, userService: UserService) => {
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

    return { valid: true, id: decoded.id };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in signup token validation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
