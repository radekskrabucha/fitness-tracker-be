import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'

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
  updatedAt: true,
  userId: true
})
export const patchWorkoutPlanSchema = insertWorkoutPlanSchema.partial()
export const selectWorkoutPlanSchema = createSelectSchema(workoutPlans, {
  duration: schema =>
    schema.duration.min(1).openapi({
      description: 'Workout plan duration in days'
    })
}).openapi('WorkoutPlan')

export const insertWorkoutPlanWorkoutSchema = createInsertSchema(
  workoutPlanWorkouts
).omit({
  workoutPlanId: true
})
export const patchWorkoutPlanWorkoutSchema =
  insertWorkoutPlanWorkoutSchema.partial()
export const selectWorkoutPlanWorkoutSchema = createSelectSchema(
  workoutPlanWorkouts
).openapi('WorkoutPlan Excercise')

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