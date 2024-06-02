import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserLoginDTO, UserRegistrationDTO } from 'src/core/DTO/auth.dtos';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { SEVEN_DAYS } from 'src/core/constants/common';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() userRegistrationDTO: UserRegistrationDTO,
    @Res() res: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.register(userRegistrationDTO);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      access_token,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() userLoginDTO: UserLoginDTO, @Res() res: Response) {
    const user = await this.authService.validateUser(userLoginDTO);
    const jwtPayload = {
      user_id: user.users.id,
    };
    const { access_token, refresh_token } =
      await this.authService.login(jwtPayload);

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      access_token,
    });
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies['refresh_token'];
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token in not provided');
    }

    const decoded = this.authService.validateToken(refresh_token, 'refresh');

    const payload = {
      user_id: decoded?.user_id,
    };

    const newTokens = await this.authService.login(payload);

    res.cookie('refresh_token', newTokens.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: SEVEN_DAYS,
    });

    return res.send({
      acces_token: newTokens.access_token,
    });
  }
}
