import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { TokenType } from 'src/entities';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingEmail = await this.userService.getByEmail(registerDto.email);

    if (existingEmail) {
      throw new UnprocessableEntityException({
        email: 'Email already exists',
      });
    }

    const user = await this.userService.create(registerDto);
    const token = await this.tokenService.create(user, TokenType.VERIFY_USER);
    await this.sendVerificationEmail(registerDto.email, token.token);
  }

  async sendVerificationEmail(email: string, token: string) {
    return await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('mail.defaultEmail'),
      text: `Here is your verification token ${token}`,
    });
  }

  async verify(verifyDto: VerifyDto) {
    const token = await this.tokenService.getByToken(verifyDto.token);

    if (!token) {
      throw new UnprocessableEntityException({
        token: 'Token is invalid or expired',
      });
    }
    await this.tokenService.setIsUsed(token.token);
    await this.userService.verifyEmail(token.user.id);
  }
}
