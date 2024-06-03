import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './modules/drizzle/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import * as schema from './modules/drizzle/schema';
import { AuthService } from './modules/auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CommentsService } from './modules/comments/comments.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NestDrizzleModule.forRootAsync({
      useFactory: () => {
        return {
          driver: 'postgres-js',
          url: process.env.DB_URL,
          options: { schema },
          migrationOptions: { migrationsFolder: './migration' },
        };
      },
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    UsersService,
    JwtService,
    CommentsService,
  ],
})
export class AppModule {}
