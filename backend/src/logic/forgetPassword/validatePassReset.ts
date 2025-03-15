import { UserService } from 'src/services/user.service';
import { DummyResetsService } from 'src/services/dummyResets.service';
import { Response } from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { BadRequestException } from '@nestjs/common';
import * as validator from 'validator';
import { generateOTP } from '../otpGenerator';

dotenv.config();

export const validatePassReset = async (
  email: string,
  res: Response,
  userService: UserService,
  dummyResetsService: DummyResetsService,
) => {
  try {
    const otp: string = generateOTP();

    if (validator.isEmpty(email)) {
      throw new BadRequestException({
        valid: false,
        type: 'email',
        error: 'This field is required',
      });
    }
    if (!validator.isEmail(email)) {
      throw new BadRequestException({
        valid: false,
        type: 'email',
        error: 'Please submit a valid email',
      });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        valid: false,
        type: 'email',
        error: 'This email is not registered',
      });
    }

    const existingDummy = await dummyResetsService.findUserByEmail(email);
    if (existingDummy) {
      throw new BadRequestException({
        valid: false,
        type: email,
        error: 'This email is already under process of reset (Wait 5 minutes)',
      });
    }

    const newDummy = await dummyResetsService.createUser(email, otp);
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    res.cookie('passReset_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    return { valid: true, message: 'Password Reset Process Started' };
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in signup initial validation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
