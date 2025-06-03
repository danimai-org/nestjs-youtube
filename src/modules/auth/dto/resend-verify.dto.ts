import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerifyDto {
  @ApiProperty({ example: 'deepak@danimai.org' })
  @IsEmail()
  email: string;
}
