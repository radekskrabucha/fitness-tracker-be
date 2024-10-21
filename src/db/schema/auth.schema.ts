import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  displayName: text('displayName').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
})

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect

export const session = pgTable('session', {
  id: uuid('id').defaultRandom().primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id)
})

export type InsertSession = typeof session.$inferInsert
export type SelectSession = typeof session.$inferSelect

export const account = pgTable('account', {
  id: uuid('id').defaultRandom().primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: uuid('userId')
    .notNull()
    .references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password')
})

export const verification = pgTable('verification', {
  id: uuid('id').defaultRandom().primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull()
})
