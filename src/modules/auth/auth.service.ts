import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private mailerService: MailerService) {}
  async login() {
    await this.mailerService.sendMail({
      to: 'danimai@example.com',
      from: 'deepak@danimai.org',
      text: 'Hello sample mail',
    });

    return 'Logged in...';
  }
}
// Pool --> AuthService, UserService, AppService
