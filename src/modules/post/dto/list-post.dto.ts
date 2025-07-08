import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Post } from 'src/entities';

export class ListPostDto {
  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number;

  @ApiProperty({ required: false, example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;

  @ApiProperty({ required: false, example: '' })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({
    required: false,
    example: 'title',
    enum: ['content', 'title'],
  })
  @IsOptional()
  @IsEnum(['content', 'title'] as (keyof Pick<Post, 'content' | 'title'>)[])
  searchField: keyof Pick<Post, 'content' | 'title'>;
}
