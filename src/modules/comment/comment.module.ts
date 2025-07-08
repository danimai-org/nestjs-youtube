import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/entities';
import { PostModule } from '../post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
