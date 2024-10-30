import { relations, sql } from 'drizzle-orm'
import { pgTable, uuid, varchar, timestamp, integer } from 'drizzle-orm/pg-core'
import { timestampConfig } from './config'
import { exercises } from './exercise.schema'

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id]
    }),
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id]
    })
  })
)

export const workoutRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises)
}))
