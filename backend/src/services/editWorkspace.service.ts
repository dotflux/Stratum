import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { WorkspaceService } from './workspace.service';
import { TaskService } from './task.service';
import { FileService } from './file.service';
import { Response } from 'express';
import { Request } from 'express';
import { authWorkspace } from 'src/logic/editWorkspace/authWorkspace';
import { createTask } from 'src/logic/editWorkspace/createTask';
import { listTasks } from 'src/logic/editWorkspace/listTasks';
import { updateSteps } from 'src/logic/editWorkspace/updateSteps';
import { markDone } from 'src/logic/editWorkspace/markDone';
import { fetchLogs } from 'src/logic/editWorkspace/fetchLogs';
import { uploadFile } from 'src/logic/editWorkspace/uploadFile';
import { listFiles } from 'src/logic/editWorkspace/listFiles';
import { downloadFile } from 'src/logic/editWorkspace/downloadFile';
import { deleteFile } from 'src/logic/editWorkspace/deleteFile';
import { listMembers } from 'src/logic/editWorkspace/listMembers';
import { addMembers } from 'src/logic/editWorkspace/addMembers';
import { removeMember } from 'src/logic/editWorkspace/removeMember';
import { changeRole } from 'src/logic/editWorkspace/changeRole';
import { changeName } from 'src/logic/editWorkspace/changeName';
import { changeDescription } from 'src/logic/editWorkspace/changeDescription';
import { changeDefaultRole } from 'src/logic/editWorkspace/changeDefaultRole';
import { changeOwner } from 'src/logic/editWorkspace/changeOwner';
import { deleteWorkspace } from 'src/logic/editWorkspace/deleteWorkspace';
import { leaveWorkspace } from 'src/logic/editWorkspace/leaveWorkspace';

@Injectable()
export class EditWorkspaceService {
  constructor(
    private readonly userService: UserService,
    private readonly workspaceService: WorkspaceService,
    private readonly taskService: TaskService,
    private readonly fileService: FileService,
  ) {}

  async authWorkspace(req: Request, id: string) {
    return await authWorkspace(
      req,
      this.userService,
      this.workspaceService,
      id,
    );
  }

  async createTask(
    req: Request,
    name: string,
    description: string,
    assignedTo: string,
    steps: string[],
    deadline: { days: number; hours: number; minutes: number },
    id: string,
  ) {
    return await createTask(
      req,
      name,
      description,
      assignedTo,
      steps,
      deadline,
      id,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async listTasks(req: Request, id: string) {
    return await listTasks(
      req,
      id,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async updateSteps(
    req: Request,
    id: string,
    taskId: string,
    steps: { task: string; done: boolean }[],
  ) {
    return await updateSteps(
      req,
      id,
      taskId,
      steps,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async markDone(req: Request, id: string, taskId: string, isExpired: boolean) {
    return await markDone(
      req,
      id,
      taskId,
      isExpired,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async fetchLogs(req: Request, id: string) {
    return await fetchLogs(req, id, this.userService, this.workspaceService);
  }

  async uploadFile(req: Request, id: string, file: Express.Multer.File) {
    return await uploadFile(
      req,
      id,
      file,
      this.userService,
      this.workspaceService,
      this.fileService,
    );
  }

  async listFiles(req: Request, id: string) {
    return await listFiles(
      req,
      id,
      this.userService,
      this.workspaceService,
      this.fileService,
    );
  }

  async downloadFile(id: string, res: Response) {
    return await downloadFile(id, res, this.fileService);
  }

  async deleteFile(req: Request, id: string, fileId: string) {
    return await deleteFile(
      req,
      id,
      fileId,
      this.userService,
      this.workspaceService,
      this.fileService,
    );
  }

  async listMembers(req: Request, id: string) {
    return await listMembers(
      req,
      id,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async addMembers(req: Request, id: string, usernames: string[]) {
    return await addMembers(
      req,
      id,
      usernames,
      this.userService,
      this.workspaceService,
    );
  }

  async removeMember(req: Request, id: string, username: string) {
    return await removeMember(
      req,
      id,
      username,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }

  async changeRole(
    req: Request,
    id: string,
    memberUser: string,
    newRole: string,
  ) {
    return await changeRole(
      req,
      id,
      memberUser,
      newRole,
      this.userService,
      this.workspaceService,
    );
  }

  async changeName(req: Request, id: string, name: string) {
    return await changeName(
      req,
      id,
      name,
      this.userService,
      this.workspaceService,
    );
  }

  async changeDescription(req: Request, id: string, description: string) {
    return await changeDescription(
      req,
      id,
      description,
      this.userService,
      this.workspaceService,
    );
  }

  async changeDefaultRole(req: Request, id: string, role: string) {
    return await changeDefaultRole(
      req,
      id,
      role,
      this.userService,
      this.workspaceService,
    );
  }

  async changeOwner(req: Request, id: string, ownerUsername: string) {
    return await changeOwner(
      req,
      id,
      ownerUsername,
      this.userService,
      this.workspaceService,
    );
  }

  async deleteWorkspace(req: Request, id: string, workspaceName: string) {
    return await deleteWorkspace(
      req,
      id,
      workspaceName,
      this.userService,
      this.workspaceService,
      this.taskService,
      this.fileService,
    );
  }

  async leaveWorkspace(req: Request, id: string) {
    return await leaveWorkspace(
      req,
      id,
      this.userService,
      this.workspaceService,
      this.taskService,
    );
  }
}
