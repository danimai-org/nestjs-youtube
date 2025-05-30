import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions(): Promise<MailerOptions> | MailerOptions {
    const host = this.configService.get<string>('mail.host');
    const port = Number(this.configService.get<number>('mail.port'));

    return {
      transport: `smtp://${host}:${port}`,
    };
  }
}
