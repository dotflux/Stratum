import { UserService } from 'src/services/user.service';
import { DummyResetsService } from 'src/services/dummyResets.service';
import { Response } from 'express';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

export const resetPass = async (
  email: string,
  otp: string,
  password: string,
  passwordRe: string,
  res: Response,
  userService: UserService,
  dummyResetsService: DummyResetsService,
) => {
  try {
    if (!email) {
      throw new BadRequestException({
        valid: false,
        error:
          'Something Went Wrong (Refresh Page or go back to /forgetpassword)',
        type: 'passwordRe',
      });
    }
    if (validator.isEmpty(otp)) {
      throw new BadRequestException({
        valid: false,
        type: 'otp',
        error: 'This field is required',
      });
    }
    if (validator.isEmpty(password)) {
      throw new BadRequestException({
        valid: false,
        type: 'password',
        error: 'This field is required',
      });
    }
    if (validator.isEmpty(passwordRe)) {
      throw new BadRequestException({
        valid: false,
        type: 'passwordRe',
        error: 'This field is required',
      });
    }

    if (passwordRe !== password) {
      throw new BadRequestException({
        valid: false,
        type: 'passwordRe',
        error: "The passwords don't match",
      });
    }

    const dummyUser = await dummyResetsService.findUserByEmail(email);
    if (!dummyUser) {
      throw new BadRequestException({
        valid: false,
        type: 'passwordRe',
        error: 'Invalid email provided (refresh page)',
      });
    }

    if (otp !== dummyUser.otp) {
      throw new BadRequestException({
        valid: false,
        type: 'otp',
        error: 'Incorrect OTP',
      });
    }

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException({
        valid: false,
        type: 'passwordRe',
        error:
          'Something went wrong (Refresh Page or go back to /forgetpassword))',
      });
    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (samePassword) {
      throw new BadRequestException({
        valid: false,
        type: 'passwordRe',
        error: 'New password cannot be the same as old password',
      });
    }

    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    await user.updateOne({ password: hashedPassword });
    await dummyResetsService.deleteByEmail(email);
    res.clearCookie('passReset_token');

    return { valid: true, message: 'Password Changed Successfully' };
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
