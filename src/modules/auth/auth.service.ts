import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'Logged in...';
  }
}
// Pool --> AuthService, UserService, AppService
