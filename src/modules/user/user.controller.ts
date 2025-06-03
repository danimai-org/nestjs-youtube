import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/auth.service';
import { UserParam } from 'src/decorators/user-param.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/me')
  getMe(@UserParam() user: JwtPayload) {
    return this.userService.getByID(user.id);
  }

  @Patch('/me')
  updateMe(
    @UserParam() user: JwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto);
  }
}
