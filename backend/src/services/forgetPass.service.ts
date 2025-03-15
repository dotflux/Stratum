import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { DummyResetsService } from './dummyResets.service';
import { Response } from 'express';
import { Request } from 'express';
import { validatePassReset } from 'src/logic/forgetPassword/validatePassReset';
import { resetPass } from 'src/logic/forgetPassword/resetPass';
import { verifyResetProcess } from 'src/logic/forgetPassword/verifyResetProcess';

@Injectable()
export class ForgetPassService {
  constructor(
    private readonly userService: UserService,
    private readonly dummyResetsService: DummyResetsService,
  ) {}

  async validatePassReset(email: string, res: Response) {
    return await validatePassReset(
      email,
      res,
      this.userService,
      this.dummyResetsService,
    );
  }

  async resetPass(
    email: string,
    otp: string,
    password: string,
    passwordRe: string,
    res: Response,
  ) {
    return await resetPass(
      email,
      otp,
      password,
      passwordRe,
      res,
      this.userService,
      this.dummyResetsService,
    );
  }

  async verifyResetProcess(req: Request) {
    return await verifyResetProcess(req, this.dummyResetsService);
  }
}
