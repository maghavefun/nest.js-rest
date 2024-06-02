import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './modules/auth/auth.guard';

@Controller()
export class AppController {
  @UseGuards(AuthGuard)
  @Get('hello')
  async hello() {
    return 'hello';
  }
}
