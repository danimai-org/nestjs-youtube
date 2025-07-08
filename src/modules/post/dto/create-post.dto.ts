import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Post } from 'src/entities';

export class CreatePostDto
  implements Pick<Post, 'title' | 'content' | 'image'>
{
  @ApiProperty({ example: 'First Post' })
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @ApiProperty({ example: 'Here goes my description' })
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  content: string;

  @ApiProperty({ format: 'binary' })
  image: string;
}
