import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  DRIZZLE_ORM,
  POSTGRES_ERROR_CODES,
} from 'src/core/constants/db.constants';
import * as schema from '../drizzle/schema';
import { UserCreatingDTO, UserUpdatingDTO } from 'src/core/DTO/users.dtos';
import {
  User,
  UserWithUserCredentials,
  users,
  usersCredentials,
} from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE_ORM) private readonly db: PostgresJsDatabase<typeof schema>,
  ) {}

  async createOne(userDTO: UserCreatingDTO) {
    try {
      return await this.db.transaction(async (tx) => {
        const arrayWithCreatedUser = await tx
          .insert(users)
          .values({
            name: userDTO.name,
            surname: userDTO.surname,
            email: userDTO.email,
          })
          .returning();

        await tx.insert(schema.usersCredentials).values({
          pass_hash: userDTO.pass_hash,
          salt: userDTO.salt,
          user_id: arrayWithCreatedUser[0].id,
        });
        return arrayWithCreatedUser[0];
      });
    } catch (err) {
      if (
        err?.code &&
        err.code === POSTGRES_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION
      ) {
        throw new InternalServerErrorException(
          `User with email: ${userDTO.email} already exists`,
        );
      }
      throw err;
    }
  }

  async findOneByEmail(email: string): Promise<UserWithUserCredentials[]> {
    try {
      const arrayWithUser = await this.db
        .select()
        .from(users)
        .innerJoin(usersCredentials, eq(users.id, usersCredentials.user_id))
        .where(eq(users.email, email));

      return arrayWithUser;
    } catch (err) {
      throw err;
    }
  }

  async findOneById(userId: number): Promise<User> {
    try {
      const arrayWithUser = await this.db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (arrayWithUser.length === 0) {
        throw new NotFoundException(`User with id: ${userId} not found`);
      }
      return arrayWithUser[0];
    } catch (err) {
      throw err;
    }
  }

  async updateOneById(userId: number, userDTO: UserUpdatingDTO): Promise<User> {
    try {
      const arrayWithUpdatedUser = await this.db
        .update(users)
        .set(userDTO)
        .where(eq(users.id, userId))
        .returning();

      if (arrayWithUpdatedUser.length === 0) {
        throw new NotFoundException(`User with id: ${userId} not found`);
      }
      return arrayWithUpdatedUser[0];
    } catch (error) {
      throw error;
    }
  }
}
