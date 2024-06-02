import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDTO, UserRegistrationDTO } from 'src/core/DTO/auth.dtos';
import { UsersService } from '../users/users.service';
import { UserCreatingDTO } from 'src/core/DTO/users.dtos';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDTO } from 'src/core/DTO/tokens.dtos';
import { UserWithUserCredentials } from '../drizzle/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(userRegistratingDTO: UserRegistrationDTO): Promise<TokenDTO> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        userRegistratingDTO.password,
        salt,
      );

      const userDTO: UserCreatingDTO = {
        name: userRegistratingDTO.name,
        surname: userRegistratingDTO.surname,
        email: userRegistratingDTO.email,
        pass_hash: hashedPassword,
        salt,
      };

      const createdUser = await this.usersService.createOne(userDTO);

      const jwtPayload = {
        user_id: createdUser.id,
      };

      return {
        access_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        }),
        refresh_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async login(jwtPayload: any): Promise<TokenDTO> {
    try {
      return {
        access_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        }),
        refresh_token: this.jwtService.sign(jwtPayload, {
          secret: this.configService.get('JWT_SECRET_KEY'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
        }),
      };
    } catch (err) {
      throw err;
    }
  }

  async validateUser(
    userLoginDTO: UserLoginDTO,
  ): Promise<UserWithUserCredentials> {
    try {
      const arrayWithUser = await this.usersService.findOneByEmail(
        userLoginDTO.email,
      );

      if (arrayWithUser.length === 0) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const user = arrayWithUser[0];

      const isPasswordMatched = await bcrypt.compare(
        userLoginDTO.password,
        user.user_credentials.pass_hash,
      );

      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  validateToken(token: string, tokenType: 'refresh' | 'access') {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      });
    } catch {
      throw new UnauthorizedException(`Invalid ${tokenType} token`);
    }
  }
}
