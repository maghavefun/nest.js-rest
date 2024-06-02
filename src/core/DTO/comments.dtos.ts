import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { Comment } from 'src/modules/drizzle/schema';

export class CommentCreatingDTO implements Omit<Comment, 'id' | 'card_id'> {
  @ApiProperty({
    example: 'Done with it already. Can move to Done',
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @IsNotEmpty()
  content: string;
}

export class CommentUpdatingDTO
  implements Partial<Omit<Comment, 'id' | 'card_id'>>
{
  @ApiProperty({
    example: 'Still not done, need more time.',
    required: true,
  })
  @IsString()
  @Length(1, 500)
  @IsOptional()
  content: string;
}
