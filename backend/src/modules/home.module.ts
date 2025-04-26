import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { HomeService } from 'src/services/home.service';
import { HomeController } from 'src/controllers/home.controller';
import { WorkspaceModule } from './workspace.module';

@Module({
  imports: [UserModule, WorkspaceModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
