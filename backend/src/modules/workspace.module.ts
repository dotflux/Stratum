import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from 'src/models/workspace.schema';
import { WorkspaceService } from 'src/services/workspace.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
    ]),
  ],
  exports: [WorkspaceService],
  providers: [WorkspaceService],
})
export class WorkspaceModule {}
