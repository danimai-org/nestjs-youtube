import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum TokenType {
  VERIFY_USER = 'VERIFY_USER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

@Entity({ name: 'tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column()
  isUsed: boolean;

  @Column({ enum: TokenType })
  type: TokenType;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn()
  user: User;
}
