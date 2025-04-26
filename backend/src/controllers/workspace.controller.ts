import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { EditWorkspaceService } from 'src/services/editWorkspace.service';
import { Response } from 'express';
import { Request } from 'express';
import { IdGuard } from 'src/guards/workspaceParam.guard';
import { FileUploadInterceptor } from 'interceptors/file.interceptor';

@UseGuards(IdGuard)
@Controller('workspace/:id')
export class EditWorkspaceController {
  constructor(private readonly editWorkspaceService: EditWorkspaceService) {}
  @Post('auth')
  async authHome(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.authWorkspace(req, id);
  }
  @Post('task/create')
  async createTask(
    @Req() req: Request,
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('assignedToUsername') assignedTo: string,
    @Body('steps') steps: string[],
    @Body('deadline')
    deadline: { days: number; hours: number; minutes: number },
    @Param('id') id: string,
  ) {
    return await this.editWorkspaceService.createTask(
      req,
      name,
      description,
      assignedTo,
      steps,
      deadline,
      id,
    );
  }

  @Post('task/list')
  async listTask(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.listTasks(req, id);
  }

  @Post('task/updateSteps')
  async updateSteps(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('taskId') taskId: string,
    @Body('steps') steps: { task: string; done: boolean }[],
  ) {
    return await this.editWorkspaceService.updateSteps(req, id, taskId, steps);
  }

  @Post('task/markDone')
  async markDone(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('taskId') taskId: string,
    @Body('isExpired') isExpired: boolean,
  ) {
    return await this.editWorkspaceService.markDone(req, id, taskId, isExpired);
  }

  @Post('log')
  async fetchLogs(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.fetchLogs(req, id);
  }

  @Post('upload')
  @UseInterceptors(FileUploadInterceptor.create())
  async uploadFile(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.editWorkspaceService.uploadFile(req, id, file);
  }

  @Post('listFiles')
  async listFiles(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.listFiles(req, id);
  }

  @Get('/uploads/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    return await this.editWorkspaceService.downloadFile(id, res);
  }

  @Post('deleteFile')
  async deleteFile(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('fileId') fileId: string,
  ) {
    return await this.editWorkspaceService.deleteFile(req, id, fileId);
  }

  @Post('members/list')
  async listMembers(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.listMembers(req, id);
  }

  @Post('members/add')
  async addMembers(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('usernames') usernames: string[],
  ) {
    return await this.editWorkspaceService.addMembers(req, id, usernames);
  }

  @Post('members/remove')
  async removeMember(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('username') username: string,
  ) {
    return await this.editWorkspaceService.removeMember(req, id, username);
  }

  @Post('members/changeRole')
  async changeRole(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('memberUser') memberUser: string,
    @Body('newRole') newRole: string,
  ) {
    return await this.editWorkspaceService.changeRole(
      req,
      id,
      memberUser,
      newRole,
    );
  }

  @Post('settings/name')
  async changeName(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return await this.editWorkspaceService.changeName(req, id, name);
  }

  @Post('settings/description')
  async changeDescription(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('description') description: string,
  ) {
    return await this.editWorkspaceService.changeDescription(
      req,
      id,
      description,
    );
  }

  @Post('settings/role')
  async changeDefaultRole(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('role') role: string,
  ) {
    return await this.editWorkspaceService.changeDefaultRole(req, id, role);
  }

  @Post('settings/owner')
  async changeOwner(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('ownerUsername') ownerUsername: string,
  ) {
    return await this.editWorkspaceService.changeOwner(req, id, ownerUsername);
  }

  @Post('settings/delete')
  async deleteWorkspace(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('input') workspaceName: string,
  ) {
    return await this.editWorkspaceService.deleteWorkspace(
      req,
      id,
      workspaceName,
    );
  }

  @Post('leave')
  async leaveWorkspace(@Req() req: Request, @Param('id') id: string) {
    return await this.editWorkspaceService.leaveWorkspace(req, id);
  }
}
