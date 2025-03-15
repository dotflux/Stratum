import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UserModule } from './modules/user.module';
import { DummyUserModule } from './modules/dummyUser.module';
import { DummyResetsModule } from './modules/dummyResets.module';
import { SignupModule } from './modules/signup.module';
import { LoginModule } from './modules/login.module';
import { ForgetPassModule } from './modules/forgetPass.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
