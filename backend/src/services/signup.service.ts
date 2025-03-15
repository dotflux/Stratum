import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { DummyUserService } from './dummyUser.service';
import { validateSignupData } from 'src/logic/signup/validateSignupData';
import { registerUser } from 'src/logic/signup/registerUser';
import { verifyRegisterToken } from 'src/logic/signup/verifyRegisterToken';
import { Response } from 'express';
import { Request } from 'express';

@Injectable()
export class SignupService {
  constructor(
    private readonly userService: UserService,
    private readonly dummyUserService: DummyUserService,
  ) {}

  async validateUser(
    username: string,
    email: string,
    password: string,
    res: Response,
  ) {
    return await validateSignupData(
      username,
      email,
      password,
      this.userService,
      this.dummyUserService,
      res,
    );
  }

  async registerUser(email: string, otp: string, res: Response) {
    return await registerUser(
      email,
      otp,
      this.userService,
      this.dummyUserService,
      res,
    );
  }

  async verifyRegisterToken(req: Request) {
    return await verifyRegisterToken(req, this.dummyUserService);
  }
}
