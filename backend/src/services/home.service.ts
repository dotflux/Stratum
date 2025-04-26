import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkspaceService } from './workspace.service';
import { Response } from 'express';
import { Request } from 'express';
import { authHome } from 'src/logic/home/authHome';
import { createWorkspace } from 'src/logic/home/createWorkspace';
import { listWorkspaces } from 'src/logic/home/listWorkspaces';

@Injectable()
export class HomeService {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async authHome(req: Request) {
    return await authHome(req, this.userService);
  }

  async createWorkspace(req: Request) {
    return await createWorkspace(req, this.userService, this.workspaceService);
  }

  async listWorkspaces(req: Request) {
    return await listWorkspaces(req, this.userService, this.workspaceService);
  }
}
