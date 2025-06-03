import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { TokenType } from 'src/entities';
import { VerifyDto } from './dto/verify.dto';
import { ResendVerifyDto } from './dto/resend-verify.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  id: number;
}

@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private userService: UserService,
    private tokenService: TokenService,
    private jwtService: JwtService,
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

  async sendForgotPasswordEmail(email: string, token: string) {
    return await this.mailerService.sendMail({
      to: email,
      from: this.configService.get<string>('mail.defaultEmail'),
      text: `Here is your Forgot Password token ${token}`,
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    // Check email if exists or not
    const user = await this.userService.getByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        email: 'Email does not exists',
      });
    }

    // create verify token for user
    const token = await this.tokenService.create(
      user,
      TokenType.FORGOT_PASSWORD,
    );
    // send Email to that particular with token
    await this.sendForgotPasswordEmail(forgotPasswordDto.email, token.token);
  }

  async resendVerifyMail(resendVerifyDto: ResendVerifyDto) {
    // Check email if exists or not
    const user = await this.userService.getByEmail(resendVerifyDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        email: 'Email does not exists',
      });
    }

    // create verify token for user
    const token = await this.tokenService.create(user, TokenType.VERIFY_USER);
    // send Email to that particular with token
    await this.sendVerificationEmail(resendVerifyDto.email, token.token);
  }

  async verify(verifyDto: VerifyDto) {
    const token = await this.tokenService.getByToken(
      verifyDto.token,
      TokenType.VERIFY_USER,
    );

    if (!token) {
      throw new UnprocessableEntityException({
        token: 'Token is invalid or expired',
      });
    }
    await this.tokenService.setIsUsed(token.token);
    await this.userService.verifyEmail(token.user.id);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const token = await this.tokenService.getByToken(
      resetPasswordDto.token,
      TokenType.FORGOT_PASSWORD,
    );

    if (!token) {
      throw new UnprocessableEntityException({
        token: 'Token is invalid or expired',
      });
    }
    await this.tokenService.setIsUsed(token.token);
    await this.userService.resetPassword(
      token.user.id,
      resetPasswordDto.password,
    );
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.getByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        email: 'User does not exists',
      });
    }
    const isPasswordValid = await this.userService.comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        password: 'Invalid password given',
      });
    }

    return {
      authToken: this.createAuthToken({ id: user.id }),
    };
  }

  createAuthToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: '90d',
    });
  }
}
