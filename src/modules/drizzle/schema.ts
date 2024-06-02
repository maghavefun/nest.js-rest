import { InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  surname: varchar('surname', { length: 50 }),
  email: varchar('email', { length: 256 }).notNull().unique(),
});

export const usersCredentials = pgTable('user_credentials', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  pass_hash: varchar('pass_hash').notNull(),
  salt: varchar('salt').notNull(),
});

export const userRelations = relations(users, ({ one }) => ({
  usersCredentials: one(usersCredentials),
}));

export type User = InferSelectModel<typeof users>;
export type UserCredentials = InferSelectModel<typeof usersCredentials>;
export interface UserWithUserCredentials {
  users: User;
  user_credentials: UserCredentials;
}
