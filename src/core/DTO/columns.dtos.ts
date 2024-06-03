import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Column } from 'src/modules/drizzle/schema';

export class ColumnCreatingDTO implements Column {
  @Exclude()
  id: number;

  @Exclude()
  user_id: number;

  @ApiProperty({
    example: 'To Do',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title: string;
}

export class ColumnUpdatingDTO implements Partial<Column> {
  @Exclude()
  id: number;

  @Exclude()
  user_id: number;

  @ApiProperty({
    example: 'Done',
    required: true,
  })
  @IsString()
  @Length(1, 256)
  @IsNotEmpty()
  title?: string;
}
