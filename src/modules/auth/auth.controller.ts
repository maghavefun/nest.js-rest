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
import { LoginDTO, RegistrationDTO } from 'src/core/DTO/auth.dtos';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { SEVEN_DAYS } from 'src/core/constants/common';
import { AuthGuard } from './auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOkResponse({
    description: 'User succesfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Provided data is invalid',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @ApiBody({
    type: RegistrationDTO,
    description: 'JSON structure with user data for registration',
  })
  async register(
    @Body() userRegistrationDTO: RegistrationDTO,
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
  @ApiOkResponse({
    description: 'User successfully loged in',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Something went wrong',
  })
  @ApiBody({
    type: LoginDTO,
    description: 'JSON structure with user credentials for login',
  })
  async login(@Body() userLoginDTO: LoginDTO, @Res() res: Response) {
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
  @ApiBearerAuth('jwt')
  @ApiOkResponse({
    description: 'Token succesfully refreshed',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized user',
  })
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
