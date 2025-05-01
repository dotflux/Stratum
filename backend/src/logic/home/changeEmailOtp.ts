import { Request, Response } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { DummyEmailChangeService } from 'src/services/dummyEmailChange.service';

dotenv.config();
export const changeEmailOtp = async (
  req: Request,
  userService: UserService,
  dummyEmailService: DummyEmailChangeService,
  otp: string,
  res: Response,
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

    const authToken = req.cookies?.email_token; // Extract token from cookies

    if (!authToken) {
      throw new UnauthorizedException('No token provided');
    }

    // Verify JWT
    const authDecoded = jwt.verify(
      authToken,
      process.env.JWT_SECRET as string,
    ) as {
      dummyMail: string;
    };

    if (!authDecoded?.dummyMail) {
      throw new UnauthorizedException('Invalid token (no email)');
    }

    const dummyDoc = await dummyEmailService.findUserByEmail(
      authDecoded.dummyMail,
    );
    if (!dummyDoc) {
      throw new UnauthorizedException('Invalid token (not found)');
    }
    if (!otp) {
      throw new BadRequestException('Otp must be provided');
    }

    if (otp !== dummyDoc.otp) {
      throw new BadRequestException('Incorrect OTP');
    }

    user.email = dummyDoc.email;
    user.save();
    await dummyEmailService.deleteByEmail(dummyDoc.email);
    res.clearCookie('email_token');

    return {
      valid: true,
      message: 'Email change otp done successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in email change otp: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
