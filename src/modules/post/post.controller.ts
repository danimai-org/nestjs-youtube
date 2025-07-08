import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PostService } from './post.service';
import { UserParam } from 'src/decorators/user-param.decorator';
import { User } from 'src/entities';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdatePostDto } from './dto/update-post.dto';
import { ListPostDto } from './dto/list-post.dto';

@Controller('post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private service: PostService) {}

  @Get()
  list(@Query() dto: ListPostDto, @UserParam() user: User) {
    return this.service.list(dto, user);
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number, @UserParam() user: User) {
    return this.service.getOne(id, user);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() dto: CreatePostDto,
    @UserParam() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.service.create(dto, image, user);
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @UserParam() user: User,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.service.update(id, dto, user, image);
  }

  deleteOne(@Param('id', ParseIntPipe) id: number, @UserParam() user: User) {
    return this.service.deleteOne(id, user);
  }
}
