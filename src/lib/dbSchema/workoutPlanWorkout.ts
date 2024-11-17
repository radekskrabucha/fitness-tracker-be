import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { workoutPlanWorkouts } from '~/db/schema/workout-plan.schema'

export const insertWorkoutPlanWorkoutSchema = createInsertSchema(
  workoutPlanWorkouts
).omit({
  workoutPlanId: true
})
export type InsertWorkoutPlanWorkout = z.infer<
  typeof insertWorkoutPlanWorkoutSchema
>

export const patchWorkoutPlanWorkoutSchema =
  insertWorkoutPlanWorkoutSchema.partial()
export type PatchWorkoutPlanWorkout = z.infer<
  typeof patchWorkoutPlanWorkoutSchema
>

export const selectWorkoutPlanWorkoutSchema = createSelectSchema(
  workoutPlanWorkouts
)
  .omit({
    workoutId: true,
    workoutPlanId: true
  })
  .openapi('WorkoutPlan Workout')
export type SelectWorkoutPlanWorkout = z.infer<
  typeof selectWorkoutPlanWorkoutSchema
>
