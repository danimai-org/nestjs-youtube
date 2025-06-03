import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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
    await this.userRepository.update(
      {
        id,
      },
      {
        password: await this.generateHashedPassword(password),
      },
    );
  }
}
