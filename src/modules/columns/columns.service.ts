import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DRIZZLE_ORM } from 'src/core/constants/db.constants';
import * as schema from '../drizzle/schema';
import { ColumnCreatingDTO } from 'src/core/DTO/columns.dtos';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ColumnsService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOne(
    columnDTO: ColumnCreatingDTO,
    userId: number,
  ): Promise<schema.Column> {
    try {
      const createdColumn = await this.db.transaction(async (tx) => {
        const user = await tx.select().from(users).where(eq(users.id, userId));
        if (user.length === 0) {
          await tx.rollback();
          throw new NotFoundException(
            `Cannot create column. User with id:${userId} not found`,
          );
        }
        const column = await tx
          .insert(schema.columns)
          .values({ title: columnDTO.title, user_id: userId })
          .returning();
        return column;
      });
      return createdColumn[0];
    } catch (err) {
      throw err;
    }
  }
}
