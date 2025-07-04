import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Deepak', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Mandal', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Password@123', required: false })
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar?: string;
}
