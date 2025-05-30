import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  jwtSecret: process.env.JWT_SECRET,
}));
