import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    return this.userRepository.findOneBy({
      email,
    });
  }

  async comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  async generateHashedPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(registerDto: RegisterDto) {
    registerDto.password = await this.generateHashedPassword(
      registerDto.password,
    );
    return this.userRepository.save(registerDto);
  }

  async verifyEmail(id: number) {
    await this.userRepository.update(
      {
        id,
      },
      {
        isActive: true,
        emailVerifiedAt: new Date(),
      },
    );
  }

  async resetPassword(id: number, password: string) {
    const hash = await this.generateHashedPassword(password);

    await this.userRepository.update(
      {
        id,
      },
      {
        password: hash,
      },
    );
  }

  async getByID(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.generateHashedPassword(
        updateUserDto.password,
      );
    }

    await this.userRepository.update(id, updateUserDto);
  }
}
