import { UserService } from 'src/services/user.service';
import { UserDocument } from 'src/models/user.schema';
import { BadRequestException } from '@nestjs/common';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();

export const loginUser = async (
  identifier: string,
  password: string,
  userService: UserService,
  res: Response,
) => {
  try {
    const errors: { type: string; error: string }[] = [];
    let email: string | undefined;
    let username: string | undefined;

    if (validator.isEmpty(identifier)) {
      throw new BadRequestException({
        valid: false,
        type: 'identifier',
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

    if (validator.isEmail(identifier)) {
      email = identifier;
    } else if (
      !validator.isEmail(identifier) &&
      validator.isLength(identifier, { min: 5, max: 10 }) &&
      validator.isAlphanumeric(identifier)
    ) {
      username = identifier;
    } else {
      throw new BadRequestException({
        valid: false,
        type: 'identifier',
        error: 'Please enter a valid email or username',
      });
    }

    let user: UserDocument | null | undefined;

    if (email) {
      user = await userService.findUserByEmail(email);
    }
    if (username) {
      user = await userService.findUsername(username);
    }

    if (!user) {
      throw new BadRequestException({
        valid: false,
        type: 'identifier',
        error: 'Provided data is not valid',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException({
        valid: false,
        type: 'password',
        error: 'Incorrect Details Or Password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.cookie('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return { valid: true, message: 'Login Successful' };
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
