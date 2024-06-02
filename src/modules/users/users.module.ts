import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ColumnsService } from '../columns/columns.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, ColumnsService],
})
export class UsersModule {}
