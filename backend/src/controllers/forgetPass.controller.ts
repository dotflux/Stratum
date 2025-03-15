import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ForgetPassService } from 'src/services/forgetPass.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('forgetpassword')
export class ForgetPassController {
  constructor(private readonly forgetPassService: ForgetPassService) {}
  @Post()
  async validatePassReset(
    @Body('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.forgetPassService.validatePassReset(email, res);
  }

  @Post('otp')
  async resetPass(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('password') password: string,
    @Body('passwordRe') passwordRe: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.forgetPassService.resetPass(
      email,
      otp,
      password,
      passwordRe,
      res,
    );
  }

  @Post('authTk')
  async verifyInProcess(@Req() req: Request) {
    return await this.forgetPassService.verifyResetProcess(req);
  }
}
