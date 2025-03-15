import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { SignupService } from 'src/services/signup.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}
  @Post()
  async validateUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.signupService.validateUser(
      username,
      email,
      password,
      res,
    );
  }

  @Post('otp')
  async registerUser(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.signupService.registerUser(email, otp, res);
  }

  @Post('authTk')
  async verifyRegisterToken(@Req() req: Request) {
    return await this.signupService.verifyRegisterToken(req);
  }
}
