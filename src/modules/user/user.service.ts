import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(private authService: AuthService) {}

  getUser() {
    const loginDetails = this.authService.login();
    console.log('Login details', loginDetails);
    return 'Deepak';
  }
}

// AppModule --> AuthModule, UserModule

// AuthModule -->
// AuthController
// AuthService

// UserModule--> UserController, UserService
