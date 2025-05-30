import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class VerifyDto {
  @ApiProperty()
  @IsUUID('4')
  token: string;
}
