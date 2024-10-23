import { sql } from 'drizzle-orm'
import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { exercises } from './exercise.schema'

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  date: timestamp('date', timestampConfig).notNull(),
  duration: integer('duration'), // in seconds
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

export const workoutExerciseDetails = pgTable('workout_exercise_details', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutExerciseId: uuid('workout_exercise_id')
    .notNull()
    .references(() => workoutExercises.id, { onDelete: 'cascade' }),
  sets: integer('sets'),
  reps: integer('reps'),
  weight: integer('weight'), // in grams
  duration: integer('duration'), // in seconds
  distance: integer('distance') // in meters
})

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchWorkoutSchema = insertWorkoutSchema.partial()
export const selectWorkoutSchema = createSelectSchema(workouts)

export const insertWorkoutExerciseSchema = createInsertSchema(
  workoutExercises
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchWorkoutExerciseSchema = insertWorkoutExerciseSchema.partial()
export const selectWorkoutExerciseSchema = createSelectSchema(workoutExercises)

export const insertWorkoutExerciseDetailSchema = createInsertSchema(
  workoutExerciseDetails
)
export const selectWorkoutExerciseDetailSchema = createSelectSchema(
  workoutExerciseDetails
)

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>
export type SelectWorkout = z.infer<typeof selectWorkoutSchema>
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>
export type SelectWorkoutExercise = z.infer<typeof selectWorkoutExerciseSchema>
export type InsertWorkoutExerciseDetail = z.infer<
  typeof insertWorkoutExerciseDetailSchema
>
export type SelectWorkoutExerciseDetail = z.infer<
  typeof selectWorkoutExerciseDetailSchema
>
