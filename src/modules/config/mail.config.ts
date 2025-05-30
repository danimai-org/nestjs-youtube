import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  ignoreTls: process.env.MAIL_IGNORE_TLS === 'true',
  secure: process.env.MAIL_SECURE === 'true',
  requireTls: process.env.MAIL_REQUIRE_TLS === 'true',
  defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
  defaultName: process.env.MAIL_DEFAULT_NAME,
}));
