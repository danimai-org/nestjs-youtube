import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { UserParam } from 'src/decorators/user-param.decorator';
import { User } from 'src/entities';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ListCommentDto } from './dto/list-comment.dto';

@Controller('comment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private service: CommentService) {}

  @Get()
  list(@Query() dto: ListCommentDto, @UserParam() user: User) {
    return this.service.list(dto, user);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @UserParam() user: User) {
    return this.service.getOne(id, user);
  }

  @Post()
  create(@Body() dto: CreateCommentDto, @UserParam() user: User) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommentDto,
    @UserParam() user: User,
  ) {
    return this.service.update(id, dto, user);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number, @UserParam() user: User) {
    return this.service.deleteOne(id, user);
  }
}
