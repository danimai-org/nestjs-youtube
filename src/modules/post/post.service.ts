import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, User } from 'src/entities';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { unlink } from 'fs/promises';

@Injectable()
export class PostService {
  logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  // Read
  async getOne(id: number, user: User) {
    const post = await this.postRepository.findOne({
      //   relations: { user: true },
      where: {
        id,
        user: {
          id: user.id,
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  // Create
  async create(dto: CreatePostDto, image: Express.Multer.File, user: User) {
    return this.postRepository.save({
      ...dto,
      image: image.path,
      user: { id: user.id },
    });
  }

  // Update
  async update(
    id: number,
    dto: UpdatePostDto,
    user: User,
    image?: Express.Multer.File,
  ) {
    const post = await this.getOne(id, user);

    if (image) {
      try {
        await unlink(post.image);
        dto.image = image.path;
      } catch (error) {
        this.logger.error(error);
      }
    }

    await this.postRepository.update(id, dto);
  }

  // Delete
  async deleteOne(id: number, user: User) {
    const post = await this.getOne(id, user);
    await this.postRepository.delete(post.id);
  }
}
