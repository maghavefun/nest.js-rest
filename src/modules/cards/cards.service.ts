import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import * as schema from '../drizzle/schema';
import { Card, cards, columns } from '../drizzle/schema';
import { CardCreatingDTO, CardUpdatingDTO } from 'src/core/DTO/cards.dtos';
import { and, asc, desc, eq } from 'drizzle-orm';
import { PageDTO, PageMetaDTO, PageOptionsDTO } from 'src/core/DTO/page.dtos';
import { Order } from 'src/core/constants/common';

@Injectable()
export class CardsService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOne(columnId: number, cardDTO: CardCreatingDTO): Promise<Card> {
    try {
      const arrayWithCreatedCard = await this.db.transaction(async (tx) => {
        const arrayWithRelatedColumnForCard = await tx
          .select()
          .from(columns)
          .where(eq(columns.id, columnId));

        if (arrayWithRelatedColumnForCard.length === 0) {
          throw new NotFoundException(
            `Cannot create card. Column with id:${columnId} not found`,
          );
        }

        const card = await tx
          .insert(cards)
          .values({
            column_id: columnId,
            title: cardDTO.title,
            description: cardDTO.description,
          })
          .returning();
        return card;
      });
      return arrayWithCreatedCard[0];
    } catch (err) {
      throw err;
    }
  }

  async findMany(
    columnId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Card>> {
    try {
      const arrayWithFoundCards = await this.db.query.cards.findMany({
        offset: pageOptionsDTO.offset,
        limit: pageOptionsDTO.limit,
        orderBy:
          pageOptionsDTO.order === Order.ASC
            ? [asc(cards.id)]
            : [desc(cards.id)],
        where: eq(cards.column_id, columnId),
      });

      const itemCount = arrayWithFoundCards.length;
      const pageMetaDTO = new PageMetaDTO({ itemCount, pageOptionsDTO });

      return new PageDTO(arrayWithFoundCards, pageMetaDTO);
    } catch (err) {
      throw err;
    }
  }

  async findOneById(columnId: number, cardId: number): Promise<Card> {
    try {
      const arrayWithFoundCard = await this.db
        .select()
        .from(cards)
        .where(and(eq(cards.id, cardId), eq(cards.column_id, columnId)));

      if (arrayWithFoundCard.length === 0) {
        throw new NotFoundException(`Card with id: ${cardId} not found`);
      }
      return arrayWithFoundCard[0];
    } catch (err) {
      throw err;
    }
  }

  async updateOneById(
    columnId: number,
    cardId: number,
    cardDTO: CardUpdatingDTO,
  ): Promise<Card> {
    try {
      const arrayWithUpdatedCard = await this.db
        .update(cards)
        .set(cardDTO)
        .where(and(eq(cards.id, cardId), eq(cards.column_id, columnId)))
        .returning();
      if ((arrayWithUpdatedCard.length = 0)) {
        throw new NotFoundException(`Card with id:${cardId} not found`);
      }
      return arrayWithUpdatedCard[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteById(columnId: number, cardId: number): Promise<void> {
    try {
      const arrayWithDeletedCard = await this.db
        .delete(cards)
        .where(and(eq(cards.id, cardId), eq(cards.column_id, columnId)))
        .returning();

      if (arrayWithDeletedCard.length === 0) {
        throw new NotFoundException(`Card with id: ${cardId} not found`);
      }
    } catch (err) {
      throw err;
    }
  }
}
