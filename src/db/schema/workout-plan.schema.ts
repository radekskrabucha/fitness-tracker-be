import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { workouts } from './workout.schema'

// Define the difficulty level enum
export const difficultyLevelEnum = pgEnum('difficulty_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert'
])

export const workoutPlans = pgTable('workout_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull(),
  duration: integer('duration'), // in days
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const workoutPlanWorkouts = pgTable(
  'workout_plan_workouts',
  {
    workoutPlanId: uuid('workout_plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'cascade' }),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull()
  },
  t => ({
    pk: { columns: [t.workoutPlanId, t.workoutId] }
  })
)

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024),
  duration: schema =>
    schema.duration.min(1).openapi({
      description: 'Workout plan duration in days'
    })
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchWorkoutPlanSchema = insertWorkoutPlanSchema.partial()
export const selectWorkoutPlanSchema = createSelectSchema(workoutPlans, {
  duration: schema =>
    schema.duration.min(1).openapi({
      description: 'Workout plan duration in days'
    })
})

export const insertWorkoutPlanWorkoutSchema =
  createInsertSchema(workoutPlanWorkouts)
export const patchWorkoutPlanWorkoutSchema =
  insertWorkoutPlanWorkoutSchema.partial()
export const selectWorkoutPlanWorkoutSchema =
  createSelectSchema(workoutPlanWorkouts)

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>
export type PatchWorkoutPlan = z.infer<typeof patchWorkoutPlanSchema>
export type SelectWorkoutPlan = z.infer<typeof selectWorkoutPlanSchema>
export type InsertWorkoutPlanWorkout = z.infer<
  typeof insertWorkoutPlanWorkoutSchema
>
export type PatchWorkoutPlanWorkout = z.infer<
  typeof patchWorkoutPlanWorkoutSchema
>
export type SelectWorkoutPlanWorkout = z.infer<
  typeof selectWorkoutPlanWorkoutSchema
>
