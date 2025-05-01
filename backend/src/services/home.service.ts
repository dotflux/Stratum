import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkspaceService } from './workspace.service';
import { Response } from 'express';
import { Request } from 'express';
import { authHome } from 'src/logic/home/authHome';
import { createWorkspace } from 'src/logic/home/createWorkspace';
import { listWorkspaces } from 'src/logic/home/listWorkspaces';
import { getDashboard } from 'src/logic/home/getDashboard';
import { TaskService } from './task.service';
import { DummyEmailChangeService } from './dummyEmailChange.service';
import { checkState } from 'src/logic/home/checkState';
import { changeEmail } from 'src/logic/home/changeEmail';
import { changeEmailOtp } from 'src/logic/home/changeEmailOtp';
import { changeUsername } from 'src/logic/home/changeUsername';
import { changePassword } from 'src/logic/home/changePassword';
import { billing } from 'src/logic/home/billing';
import { logout } from 'src/logic/home/logout';

@Injectable()
export class HomeService {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
    private readonly taskService: TaskService,
    private readonly dummyEmailService: DummyEmailChangeService,
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

  async getDashboard(req: Request) {
    return await getDashboard(
      req,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async checkState(req: Request) {
    return await checkState(req, this.userService, this.dummyEmailService);
  }

  async changeEmail(
    req: Request,
    email: string,
    password: string,
    res: Response,
  ) {
    return await changeEmail(
      req,
      this.userService,
      this.dummyEmailService,
      email,
      password,
      res,
    );
  }

  async changeEmailOtp(req: Request, otp: string, res: Response) {
    return await changeEmailOtp(
      req,
      this.userService,
      this.dummyEmailService,
      otp,
      res,
    );
  }

  async changeName(req: Request, name: string) {
    return await changeUsername(req, name, this.userService);
  }

  async changePassword(
    req: Request,
    newPassword: string,
    currentPassword: string,
  ) {
    return await changePassword(
      req,
      newPassword,
      currentPassword,
      this.userService,
    );
  }

  async billing(req: Request, tierKey: string) {
    return await billing(req, tierKey, this.userService);
  }

  async logout(req: Request, res: Response) {
    return await logout(req, this.userService, res);
  }
}
