import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { loginUser } from 'src/logic/login/loginUser';
import { isLogged } from 'src/logic/login/isLogged';
import { Response } from 'express';
import { Request } from 'express';

@Injectable()
export class LoginService {
  constructor(private readonly userService: UserService) {}

  async loginUser(identifier: string, password: string, res: Response) {
    return await loginUser(identifier, password, this.userService, res);
  }

  async isLogged(req: Request) {
    return await isLogged(req, this.userService);
  }
}
