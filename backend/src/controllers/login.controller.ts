import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { LoginService } from 'src/services/login.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @Post()
  async loginUser(
    @Body('identifier') identifier: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.loginService.loginUser(identifier, password, res);
  }

  @Post('isLogged')
  async isLogged(@Req() req: Request) {
    return await this.loginService.isLogged(req);
  }
}
