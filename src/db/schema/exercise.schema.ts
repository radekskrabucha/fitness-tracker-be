import { sql } from 'drizzle-orm'
import { pgTable, varchar, uuid, timestamp } from 'drizzle-orm/pg-core'
import { timestampConfig } from './config'

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  description: varchar('description', { length: 1024 }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => exerciseCategories.id),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const exerciseCategories = pgTable('exercise_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: varchar('description', { length: 256 })
})

export const muscleGroups = pgTable('muscle_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull().unique(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const exerciseMuscleGroups = pgTable(
  'exercise_muscle_groups',
  {
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    muscleGroupId: uuid('muscle_group_id')
      .notNull()
      .references(() => muscleGroups.id, { onDelete: 'cascade' })
  },
  t => ({
    pk: { columns: [t.exerciseId, t.muscleGroupId] }
  })
)
