import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutPlans } from '~/db/schema/user-workout.schema'
import { insertWorkoutWithExercisesSchema } from './workout'
import { insertWorkoutPlanWorkout } from './workout-plan'

export const insertUserWorkoutPlanSchema = createInsertSchema(
  userWorkoutPlans
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const insertUserWorkoutPlanWithAttributesSchema = z.object({
  workouts: insertWorkoutPlanWorkout
    .extend(insertWorkoutWithExercisesSchema.shape)
    .array()
})
// @ts-expect-error - we use empty object to make it work
export type InsertUserWorkoutPlan<T extends InsertUserWorkoutPlanExtras = {}> =
  z.infer<typeof insertUserWorkoutPlanSchema> & T
export type InsertUserWorkoutPlanWithAttributes = z.infer<
  typeof insertUserWorkoutPlanWithAttributesSchema
>
export type InsertUserWorkoutPlanExtras = InsertUserWorkoutPlanWithAttributes
