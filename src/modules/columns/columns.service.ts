import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import * as schema from '../drizzle/schema';
import { Column, columns, users } from '../drizzle/schema';
import {
  ColumnCreatingDTO,
  ColumnUpdatingDTO,
} from 'src/core/DTO/columns.dtos';
import { asc, desc, eq } from 'drizzle-orm';
import { PageDTO, PageMetaDTO, PageOptionsDTO } from 'src/core/DTO/page.dtos';
import { Order } from 'src/core/constants/common';

@Injectable()
export class ColumnsService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOne(
    userId: number,
    columnDTO: ColumnCreatingDTO,
  ): Promise<schema.Column> {
    try {
      const arrayWithCreatedColumn = await this.db.transaction(async (tx) => {
        const user = await tx.select().from(users).where(eq(users.id, userId));
        if (user.length === 0) {
          throw new NotFoundException(
            `Cannot create column. User with id:${userId} not found`,
          );
        }
        const column = await tx
          .insert(columns)
          .values({ title: columnDTO.title, user_id: userId })
          .returning();
        return column;
      });
      return arrayWithCreatedColumn[0];
    } catch (err) {
      throw err;
    }
  }

  async findMany(
    userId: number,
    pageOptionsDTO: PageOptionsDTO,
  ): Promise<PageDTO<Column>> {
    try {
      const arrayWithFoundColumns = await this.db.query.columns.findMany({
        offset: pageOptionsDTO.offset,
        limit: pageOptionsDTO.limit,
        orderBy:
          pageOptionsDTO.order === Order.ASC
            ? [asc(columns.id)]
            : [desc(columns.id)],
        where: eq(columns.user_id, userId),
      });

      const itemCount = arrayWithFoundColumns.length;
      const pageMetaDTO = new PageMetaDTO({ itemCount, pageOptionsDTO });

      return new PageDTO(arrayWithFoundColumns, pageMetaDTO);
    } catch (err) {
      throw err;
    }
  }

  async findOneById(columnId: number): Promise<Column> {
    try {
      const arrayWithFoundColumn = await this.db
        .select()
        .from(columns)
        .where(eq(columns.id, columnId));

      if (arrayWithFoundColumn.length === 0) {
        throw new NotFoundException(`Column with id: ${columnId} not found`);
      }
      return arrayWithFoundColumn[0];
    } catch (err) {
      throw err;
    }
  }

  async updateOneById(
    columnId: number,
    columnDTO: ColumnUpdatingDTO,
  ): Promise<Column> {
    try {
      const arrayWithUpdatedColumn = await this.db
        .update(columns)
        .set(columnDTO)
        .where(eq(columns.id, columnId))
        .returning();

      if (arrayWithUpdatedColumn.length === 0) {
        throw new NotFoundException(`Column with id:${columnId} not found`);
      }
      return arrayWithUpdatedColumn[0];
    } catch (err) {
      throw err;
    }
  }

  async deleteById(columnId: number): Promise<void> {
    try {
      const arrayWithDeletedColumn = await this.db
        .delete(columns)
        .where(eq(columns.id, columnId))
        .returning();

      if (arrayWithDeletedColumn.length === 0) {
        throw new NotFoundException(`Column with id:${columnId} not found`);
      }
    } catch (err) {
      throw err;
    }
  }
}
