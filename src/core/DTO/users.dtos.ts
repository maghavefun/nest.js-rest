import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from 'src/modules/drizzle/schema';

export interface UserCreatingDTO {
  name: string;
  surname?: string;
  email: string;
  pass_hash: string;
  salt: string;
}

export class UserUpdatingDTO implements Partial<User> {
  @Exclude()
  id: number;

  @ApiProperty({
    example: 'Silvio',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'Dante',
    required: false,
  })
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty({
    example: 'silvio@mail.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;
}
