import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import * as schema from '../drizzle/schema';
import { Comment, cards, comments } from '../drizzle/schema';
import {
  CommentCreatingDTO,
  CommentUpdatingDTO,
} from 'src/core/DTO/comments.dtos';
import { and, asc, desc, eq } from 'drizzle-orm';
import { PageDTO, PageMetaDTO, PageOptionsDTO } from 'src/core/DTO/page.dtos';
import { Order } from 'src/core/constants/common';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOne(
    cardId: number,
    commentDTO: CommentCreatingDTO,
  ): Promise<Comment> {
    try {
      const arrayWithCreatedComment = await this.db.transaction(async (tx) => {
        const arrayWithRelatedCardForComment = await tx
          .select()
          .from(cards)
          .where(eq(cards.id, cardId));

        if (arrayWithRelatedCardForComment.length === 0) {
          throw new NotFoundException(
            `Cannot create comment. Card with id:${cardId} not found`,
          );
        }
        const comment = await tx
          .insert(comments)
          .values({
            card_id: cardId,
            content: commentDTO.content,
          })
          .returning();
        return comment;
      });
      return arrayWithCreatedComment[0];
    } catch (err) {
      throw err;
    }
  }

  async findMany(
    cardId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Comment>> {
    try {
      const arrayWithFoundComments = await this.db.query.comments.findMany({
        offset: pageOptionsDTO.offset,
        limit: pageOptionsDTO.limit,
        orderBy:
          pageOptionsDTO.order === Order.ASC
            ? [asc(comments.id)]
            : [desc(comments.id)],
        where: eq(comments.card_id, cardId),
      });

      const itemCount = arrayWithFoundComments.length;
      const pageMetaDTO = new PageMetaDTO({ itemCount, pageOptionsDTO });

      return new PageDTO(arrayWithFoundComments, pageMetaDTO);
    } catch (err) {
      throw err;
    }
  }

  async findOneById(cardId: number, commentId: number): Promise<Comment> {
    try {
      const arrayWithFoundComment = await this.db
        .select()
        .from(comments)
        .where(and(eq(comments.id, commentId), eq(comments.card_id, cardId)));

      if (arrayWithFoundComment.length === 0) {
        throw new NotFoundException(`Comment with id: ${commentId} not found`);
      }
      return arrayWithFoundComment[0];
    } catch (err) {
      throw err;
    }
  }

  async updateOneById(
    cardId: number,
    commentId: number,
    commentDTO: CommentUpdatingDTO,
  ): Promise<Comment> {
    try {
      const arrayWithUpdatedComment = await this.db
        .update(comments)
        .set(commentDTO)
        .where(and(eq(comments.id, commentId), eq(comments.card_id, cardId)))
        .returning();
      if (arrayWithUpdatedComment.length === 0) {
        throw new NotFoundException(`Comment with id: ${commentId} not found`);
      }
      return arrayWithUpdatedComment[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteById(cardId: number, commentId: number): Promise<void> {
    try {
      const arrayWithDeletedComment = await this.db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.card_id, cardId)))
        .returning();
      if (arrayWithDeletedComment.length === 0) {
        throw new NotFoundException(`Comment with id: ${commentId} not found`);
      }
    } catch (err) {
      throw err;
    }
  }
}
