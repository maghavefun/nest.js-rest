import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Comment } from 'src/modules/drizzle/schema';

export class CommentCreatingDTO implements Comment {
  @Exclude()
  id: number;

  @Exclude()
  card_id: number;

  @ApiProperty({
    example: 'Done with it already. Can move to Done',
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  content: string;
}

export class CommentUpdatingDTO implements Partial<Comment> {
  @Exclude()
  id: number;

  @Exclude()
  card_id: number;

  @ApiProperty({
    example: 'Still not done, need more time.',
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  content: string;
}
