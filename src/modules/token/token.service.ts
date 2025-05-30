import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Token, TokenType, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  async create(user: User, type: TokenType) {
    return this.tokenRepository.save({
      token: randomUUID(),
      user: { id: user.id },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      type,
    });
  }

  async getByToken(token: string) {
    return this.tokenRepository.findOne({
      where: { token },
      relations: {
        user: true,
      },
    });
  }

  setIsUsed(token: string) {
    return this.tokenRepository.update(
      {
        token,
      },
      {
        isUsed: true,
      },
    );
  }
}
