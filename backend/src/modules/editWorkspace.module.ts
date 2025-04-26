import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { EditWorkspaceService } from 'src/services/editWorkspace.service';
import { EditWorkspaceController } from 'src/controllers/workspace.controller';
import { WorkspaceModule } from './workspace.module';
import { TaskModule } from './task.module';
import { FileModule } from './file.module';

@Module({
  imports: [UserModule, WorkspaceModule, TaskModule, FileModule],
  providers: [EditWorkspaceService],
  controllers: [EditWorkspaceController],
})
export class EditWorkspaceModule {}
