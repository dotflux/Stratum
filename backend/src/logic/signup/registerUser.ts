import { BadRequestException } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { DummyUserService } from 'src/services/dummyUser.service';
import * as validator from 'validator';
import { Response } from 'express';

export const registerUser = async (
  email: string,
  otp: string,
  userService: UserService,
  dummyUserService: DummyUserService,
  res: Response,
) => {
  try {
    if (!email || !otp) {
      throw new BadRequestException({
        valid: false,
        error: 'Invalid or missing parameters',
      });
    }

    if (!validator.isEmail(email)) {
      throw new BadRequestException({
        valid: false,
        error: 'Something went wrong,refresh the page',
      });
    }

    if (validator.isEmpty(otp)) {
      throw new BadRequestException({
        valid: false,
        error: 'This field is required',
      });
    }

    const dummyUser = await dummyUserService.findUserByEmail(email);
    if (!dummyUser) {
      throw new BadRequestException({
        valid: false,
        error: 'This email is not under authentication',
      });
    }

    if (otp != dummyUser.otp) {
      throw new BadRequestException({ valid: false, error: 'Incorrect otp' });
    }

    if (otp == dummyUser.otp) {
      await userService.createUser(
        dummyUser.username,
        dummyUser.email,
        dummyUser.password,
      );

      await dummyUserService.deleteByEmail(email);
      res.clearCookie('auth_token');
      return { valid: true, message: 'Registration Successfull' };
    }
  } catch (error) {
    if (error instanceof BadRequestException) {
      throw error; // Re-throw validation errors, so they are handled properly
    }
    console.log('Error in signup registration validation: ', error);
    throw new BadRequestException({
      valid: false,
      error: 'Internal Server Error',
    });
  }
};
