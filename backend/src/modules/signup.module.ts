import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DummyUserModule } from './dummyUser.module';
import { SignupService } from 'src/services/signup.service';
import { SignupController } from 'src/controllers/signup.controller';

@Module({
  imports: [UserModule, DummyUserModule],
  providers: [SignupService],
  controllers: [SignupController],
})
export class SignupModule {}
