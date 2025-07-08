import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';
import { Comment } from 'src/entities';

export class CreateCommentDto implements Pick<Comment, 'comment'> {
  @ApiProperty({ example: 'First Comment' })
  @IsNotEmpty()
  @MinLength(1)
  @IsString()
  comment: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  post: number;
}
