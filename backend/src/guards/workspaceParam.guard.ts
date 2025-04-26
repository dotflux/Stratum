import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { WorkspaceService } from 'src/services/workspace.service';
import { Types } from 'mongoose';

@Injectable()
export class IdGuard implements CanActivate {
  constructor(private readonly workspaceService: WorkspaceService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Workspace ID is required');
    }
    const workspace = this.workspaceService.findById(id);
    if (!workspace) {
      throw new BadRequestException('Invalid workspace id');
    }

    return true; // Allow request to proceed if id exists
  }
}
