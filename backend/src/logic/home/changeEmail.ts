import { Request } from 'express';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Types } from 'mongoose';
import { DummyEmailChangeService } from 'src/services/dummyEmailChange.service';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import { generateOTP } from '../otpGenerator';
import sendEmail from '../mailer';
import { Response } from 'express';

dotenv.config();
export const changeEmail = async (
  req: Request,
  userService: UserService,
  dummyEmailService: DummyEmailChangeService,
  email: string,
  password: string,
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

    if (email === user.email) {
      throw new BadRequestException('The email is the current email');
    }

    const emailExists = await userService.findUserByEmail(email);
    if (emailExists) {
      throw new BadRequestException('This email is already in use');
    }

    const inProcess = await dummyEmailService.findUserByEmail(email);
    if (inProcess) {
      throw new BadRequestException(
        'This email is already undergoing change process',
      );
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestException('Not a valid email');
    }
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      throw new BadRequestException('Must fill both fields');
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Incorrect Password');
    }
    const otp: string = generateOTP();

    await dummyEmailService.createUser(email, otp);
    await sendEmail(
      email,
      `Email change for Stratum`,
      `Your one time password (otp) for changing email in the app stratum is -> ${otp} .If this was not requested by you then you can simply ignore it`,
    );

    const authToken = jwt.sign({ dummyMail: email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    res.cookie('email_token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    return {
      valid: true,
      message: 'Email changed successfully',
    };
  } catch (error) {
    if (
      error instanceof BadRequestException ||
      error instanceof UnauthorizedException
    ) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in email change: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
