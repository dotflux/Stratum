import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { DummyEmailChangeService } from 'src/services/dummyEmailChange.service';

dotenv.config();
export const checkState = async (
  req: Request,
  userService: UserService,
  dummyEmailService: DummyEmailChangeService,
) => {
  try {
    const token = req.cookies?.email_token; // Extract token from cookies

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      dummyMail: string;
    };

    if (!decoded?.dummyMail) {
      throw new UnauthorizedException('Invalid token');
    }

    const dummyUser = await dummyEmailService.findUserByEmail(
      decoded?.dummyMail,
    );
    if (!dummyUser) {
      throw new UnauthorizedException('No such user in process');
    }

    return { valid: true, email: decoded.dummyMail };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in checking email change state: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
