import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/services/user.service';
import { DummyUserService } from 'src/services/dummyUser.service';
import { generateOTP } from '../otpGenerator';
import * as validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import sendEmail from '../mailer';

dotenv.config();

export const validateSignupData = async (
  username: string,
  email: string,
  password: string,
  userService: UserService,
  dummyUserService: DummyUserService,
  res: Response,
) => {
  try {
    if (!username || !email || !password) {
      throw new BadRequestException({
        valid: false,
        error: 'Invalid or missing parameters',
      });
    }
    const otp: string = generateOTP();
    const errors: { type: string; error: string }[] = [];
    const existingEmail = await userService.findUserByEmail(email);

    if (existingEmail) {
      errors.push({ type: 'email', error: 'This email is already in use' });
    }
    const existingUsername = await userService.findUsername(username);
    if (existingUsername) {
      errors.push({ type: 'username', error: 'This username is in use' });
    }

    const existingDummy = await dummyUserService.findUserByEmail(email);

    if (existingDummy) {
      errors.push({
        type: 'email',
        error:
          'Email is already under authentication (Please wait 5 minutes to try again.',
      });
    }

    const existingDummyUsername = await dummyUserService.findUsername(username);

    if (existingDummyUsername) {
      errors.push({
        type: 'username',
        error:
          'Username is already in registration (wait 5 minutes or pick another)',
      });
    }

    const saltRounds: number = 10;
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    const fields = [
      { field: 'username', value: username, minLength: 5, maxLength: 10 },
      { field: 'password', value: password, minLength: 8, maxLength: 12 },
      { field: 'email', value: email },
    ];

    fields.forEach(({ field, value, maxLength, minLength }) => {
      if (validator.isEmpty(value)) {
        errors.push({ type: field, error: 'This field is required' });
      } else if (
        minLength &&
        maxLength &&
        !validator.isLength(value, { min: minLength, max: maxLength })
      ) {
        errors.push({
          error: `${field} must be between ${minLength} and ${maxLength} characters`,
          type: field,
        });
      }
    });

    if (!validator.isEmail(email)) {
      errors.push({ type: 'email', error: 'This is not a valid email format' });
    }

    if (!validator.isAlphanumeric(username)) {
      errors.push({ type: 'username', error: 'Username must be alphanumeric' });
    }

    if (errors.length > 0) {
      throw new BadRequestException({ valid: false, errors });
    }

    const dummyUser = await dummyUserService.createUser(
      username,
      email,
      hashedPassword,
      otp,
    );

    const token = jwt.sign({ dummyMail: email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Secure in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 5 * 60 * 1000, // 5 minutes
    });

    await sendEmail(
      email,
      'One Time Password for Stratum',
      `Your One Time Password (OTP) for signup procedure in our app Stratum is ${otp}`,
    );

    return { valid: true, message: 'User registered successfully' };
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
