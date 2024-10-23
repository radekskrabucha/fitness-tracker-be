import { sql } from 'drizzle-orm'
import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { workouts } from './workout.schema'

export const workoutPlans = pgTable('workout_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  difficultyLevel: text('difficulty_level').notNull(),
  duration: integer('duration'), // in seconds
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

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchWorkoutPlanSchema = insertWorkoutPlanSchema.partial()
export const selectWorkoutPlanSchema = createSelectSchema(workoutPlans)

export const insertWorkoutPlanWorkoutSchema =
  createInsertSchema(workoutPlanWorkouts)
export const patchWorkoutPlanWorkoutSchema =
  insertWorkoutPlanWorkoutSchema.partial()
export const selectWorkoutPlanWorkoutSchema =
  createSelectSchema(workoutPlanWorkouts)

export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>
export type SelectWorkoutPlan = z.infer<typeof selectWorkoutPlanSchema>
export type InsertWorkoutPlanWorkout = z.infer<
  typeof insertWorkoutPlanWorkoutSchema
>
export type SelectWorkoutPlanWorkout = z.infer<
  typeof selectWorkoutPlanWorkoutSchema
>
