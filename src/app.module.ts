import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NestDrizzleModule } from './modules/drizzle/drizzle.module';
import * as schema from './modules/drizzle/schema';

@Module({
  imports: [
    ConfigModule.forRoot({}),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
