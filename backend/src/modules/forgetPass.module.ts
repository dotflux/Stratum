import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { DummyResetsModule } from './dummyResets.module';
import { ForgetPassController } from 'src/controllers/forgetPass.controller';
import { ForgetPassService } from 'src/services/forgetPass.service';

@Module({
  imports: [UserModule, DummyResetsModule],
  providers: [ForgetPassService],
  controllers: [ForgetPassController],
})
export class ForgetPassModule {}
