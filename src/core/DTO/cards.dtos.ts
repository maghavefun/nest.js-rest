import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Card } from 'src/modules/drizzle/schema';

export class CardCreatingDTO implements Omit<Card, 'id' | 'column_id'> {
  @ApiProperty({
    example: 'Buy groceries',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Go to groceries store\n1. Buy milk. \n 2.Buy bread',
    required: false,
  })
  @IsString()
  @Length(1, 500)
  description: string;
}

export class CardUpdatingDTO
  implements Partial<Omit<Card, 'id' | 'column_id'>>
{
  @ApiProperty({
    example: 'Buy groceries',
    required: false,
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Go to groceries store\n1. Buy milk. \n 2.Buy bread',
    required: false,
  })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  description?: string;
}
