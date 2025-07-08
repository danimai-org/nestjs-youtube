import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, User } from 'src/entities';
import { Like, Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentDto } from './dto/list-comment.dto';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postService: PostService,
  ) {}

  // Pagination
  async list(dto: ListCommentDto, user: User) {
    const [result, total] = await this.commentRepository.findAndCount({
      where: {
        user: { id: user.id },
        ...(dto.search && dto.searchField
          ? { [dto.searchField]: Like(`%${dto.search}%`) }
          : dto.search
            ? { comment: Like(`%${dto.search}%`) }
            : {}),
      },
      skip: (dto.page - 1) * dto.limit,
      take: dto.limit,
      relations: { user: true },
      order: {
        createdAt: -1,
      },
    });

    return {
      ...dto,
      total,
      totalPages: Math.ceil(total / Number(dto.limit)),
      data: result,
    };
  }

  // Read
  async getOne(id: number, user?: User) {
    const comment = await this.commentRepository.findOne({
      relations: { user: true },
      where: {
        id,
        ...(user ? { user: { id: user.id } } : {}),
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  // Create
  async create(dto: CreateCommentDto, user: User) {
    const post = await this.postService.getByID(dto.post);

    if (!post) {
      throw new UnprocessableEntityException({
        post: 'Post not found',
      });
    }

    return this.commentRepository.save({
      ...dto,
      post: { id: dto.post },
      user: { id: user.id },
    });
  }

  // Update
  async update(id: number, dto: UpdateCommentDto, user: User) {
    const comment = await this.getOne(id, user);
    await this.commentRepository.update(comment.id, dto);
  }

  // Delete
  async deleteOne(id: number, user: User) {
    const comment = await this.getOne(id, user);
    await this.commentRepository.delete(comment.id);
  }
}
