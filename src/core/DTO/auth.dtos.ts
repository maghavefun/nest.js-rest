import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class RegistrationDTO {
  @ApiProperty({
    example: 'Antony',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({
    example: 'Soprano',
    required: false,
  })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  surname?: string;

  @ApiProperty({
    example: 'test@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'fj32ufsj',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDTO {
  @ApiProperty({
    example: 'test@mail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'fj32ufsj',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
