import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingEmail = await this.userService.getByEmail(registerDto.email);

    if (existingEmail) {
      throw new UnprocessableEntityException({
        email: 'Email already exists',
      });
    }

    await this.userService.create(registerDto);
    await this.sendVerificationEmail(registerDto.email, 'token');
  }

  async sendVerificationEmail(email: string, token: string) {
    return await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('mail.defaultEmail'),
      text: `Here is your verification token ${token}`,
    });
  }
}
