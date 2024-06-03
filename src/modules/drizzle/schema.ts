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

export const columns = pgTable('columns', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  title: varchar('title', { length: 256 }).notNull(),
});

export const cards = pgTable('cards', {
  id: serial('id').primaryKey(),
  column_id: integer('column_id').references(() => columns.id, {
    onDelete: 'cascade',
  }),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 500 }),
});

export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  card_id: integer('card_id').references(() => cards.id, {
    onDelete: 'cascade',
  }),
  content: varchar('content', { length: 500 }).notNull(),
});

export const userRelations = relations(users, ({ one, many }) => ({
  usersCredentials: one(usersCredentials, {
    fields: [users.id],
    references: [usersCredentials.user_id],
  }),
  columns: many(columns),
}));

export const columnRelations = relations(columns, ({ one, many }) => ({
  users: one(users, {
    fields: [columns.user_id],
    references: [users.id],
  }),
  cards: many(cards),
}));

export const cardRealtions = relations(cards, ({ one, many }) => ({
  columns: one(columns, {
    fields: [cards.column_id],
    references: [columns.id],
  }),
  comments: many(comments),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  cards: one(cards, {
    fields: [comments.card_id],
    references: [cards.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type UserCredentials = InferSelectModel<typeof usersCredentials>;
export type Column = InferSelectModel<typeof columns>;
export type Card = InferSelectModel<typeof cards>;
export type Comment = InferSelectModel<typeof comments>;
export interface UserWithUserCredentials {
  users: User;
  user_credentials: UserCredentials;
}
