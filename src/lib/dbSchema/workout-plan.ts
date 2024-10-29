import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import { selectWorkoutSchema } from './workout'

export const insertWorkoutPlanBaseSchema = createInsertSchema(workoutPlans, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutPlanSchema = insertWorkoutPlanBaseSchema.extend({
  workouts: z
    .array(
      z.object({
        id: z.string().uuid(),
        orderIndex: z.number().min(0)
      })
    )
    .min(1)
})
export const patchWorkoutPlanSchema = insertWorkoutPlanBaseSchema.partial()
export const selectWorkoutPlanSchema =
  createSelectSchema(workoutPlans).openapi('WorkoutPlan')

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

export const selectWorkoutPlanWithWorkoutsSchema =
  selectWorkoutPlanSchema.extend({
    workouts: z.array(selectWorkoutSchema)
  })

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
export type SelectWorkoutPlanWithWorkouts = z.infer<
  typeof selectWorkoutPlanWithWorkoutsSchema
>
