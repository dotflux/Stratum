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
}
