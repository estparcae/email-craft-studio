import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const brandManuals = pgTable('brand_manuals', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
