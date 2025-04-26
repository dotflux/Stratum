import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UserModule } from './modules/user.module';
import { WorkspaceModule } from './modules/workspace.module';
import { DummyUserModule } from './modules/dummyUser.module';
import { DummyResetsModule } from './modules/dummyResets.module';
import { SignupModule } from './modules/signup.module';
import { LoginModule } from './modules/login.module';
import { ForgetPassModule } from './modules/forgetPass.module';
import { HomeModule } from './modules/home.module';
import { EditWorkspaceModule } from './modules/editWorkspace.module';
import { TaskModule } from './modules/task.module';
import { FileModule } from './modules/file.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env.CONNECTION_STRING}`),
    UserModule,
    DummyUserModule,
    DummyResetsModule,
    SignupModule,
    LoginModule,
    ForgetPassModule,
    HomeModule,
    WorkspaceModule,
    TaskModule,
    EditWorkspaceModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
