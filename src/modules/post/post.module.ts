import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    MulterModule.register({
      storage: diskStorage({
        destination: 'uploads/post',
        filename(req, file, callback) {
          callback(null, `${randomUUID()}-${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
