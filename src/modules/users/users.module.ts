import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ColumnsService } from '../columns/columns.service';
import { CardsService } from '../cards/cards.service';
import { CommentsService } from '../comments/comments.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    JwtService,
    ColumnsService,
    CardsService,
    CommentsService,
  ],
})
export class UsersModule {}
