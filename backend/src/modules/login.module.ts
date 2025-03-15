import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { LoginService } from 'src/services/login.service';
import { LoginController } from 'src/controllers/login.controller';

@Module({
  imports: [UserModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
