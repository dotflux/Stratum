import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { HomeService } from 'src/services/home.service';
import { Response } from 'express';
import { Request } from 'express';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}
  @Post('auth')
  async authHome(@Req() req: Request) {
    return await this.homeService.authHome(req);
  }

  @Post('workspace/create')
  async createWorkspace(@Req() req: Request) {
    return await this.homeService.createWorkspace(req);
  }

  @Post('workspace/list')
  async listWorkspaces(@Req() req: Request) {
    return await this.homeService.listWorkspaces(req);
  }

  @Post('dashboard')
  async getDashboard(@Req() req: Request) {
    return await this.homeService.getDashboard(req);
  }

  @Post('account/email/state')
  async checkState(@Req() req: Request) {
    return await this.homeService.checkState(req);
  }

  @Post('account/email')
  async changeEmail(
    @Req() req: Request,
    @Body('newEmail') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.homeService.changeEmail(req, email, password, res);
  }

  @Post('account/email/otp')
  async changeEmailOtp(
    @Req() req: Request,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.homeService.changeEmailOtp(req, otp, res);
  }

  @Post('account/username')
  async changeName(@Req() req: Request, @Body('name') name: string) {
    return await this.homeService.changeName(req, name);
  }

  @Post('account/password')
  async changePassword(
    @Req() req: Request,
    @Body('newPassword') newPassword: string,
    @Body('currentPassword') currentPassword: string,
  ) {
    return await this.homeService.changePassword(
      req,
      newPassword,
      currentPassword,
    );
  }

  @Post('billing')
  async billing(@Req() req: Request, @Body('tier') tierKey: string) {
    return await this.homeService.billing(req, tierKey);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.homeService.logout(req, res);
  }
}
