import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Card } from 'src/modules/drizzle/schema';

export class CardCreatingDTO implements Card {
  @Exclude()
  id: number;

  @Exclude()
  column_id: number;

  @ApiProperty({
    example: 'Buy groceries',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Go to groceries store: 1. Buy milk. 2.Buy bread',
    required: false,
  })
  @IsString()
  @Length(1, 500)
  description: string;
}

export class CardUpdatingDTO implements Partial<Card> {
  @Exclude()
  id: number;

  @Exclude()
  column_id: number;

  @ApiProperty({
    example: 'Buy groceries',
    required: false,
  })
  @IsString()
  @Length(1, 256)
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Go to groceries store. 1. Buy milk. 2.Buy bread',
    required: false,
  })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  description?: string;
}
