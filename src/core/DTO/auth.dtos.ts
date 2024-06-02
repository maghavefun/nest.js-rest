import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UserRegistrationDTO {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsString()
  @Length(2, 50)
  @IsOptional()
  surname?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
