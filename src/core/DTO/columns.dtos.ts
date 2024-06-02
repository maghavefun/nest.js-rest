import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column } from 'src/modules/drizzle/schema';

export class ColumnCreatingDTO implements Omit<Column, 'id' | 'user_id'> {
  @ApiProperty({
    example: 'To Do',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title: string;
}

export class ColumnUpdatingDTO
  implements Partial<Omit<Column, 'id' | 'user_id'>>
{
  @ApiProperty({
    example: 'Done',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title?: string;
}
