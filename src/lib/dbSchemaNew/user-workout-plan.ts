import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutPlans } from '~/db/schema/user-workout.schema'
import { insertWorkoutExtraExercisesSchema } from './workout'
import { insertWorkoutPlanWorkout } from './workout-plan'

export const insertUserWorkoutPlanSchema = createInsertSchema(
  userWorkoutPlans
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const insertUserWorkoutPlanExtraAttributesSchema = z.object({
  workouts: insertWorkoutPlanWorkout
    .extend(insertWorkoutExtraExercisesSchema.shape)
    .array()
})
// @ts-expect-error - we use empty object to make it work
export type InsertUserWorkoutPlan<T extends InsertUserWorkoutPlanExtras = {}> =
  z.infer<typeof insertUserWorkoutPlanSchema> & T
export type InsertUserWorkoutPlanExtraAttributes = z.infer<
  typeof insertUserWorkoutPlanExtraAttributesSchema
>
export type InsertUserWorkoutPlanExtras = InsertUserWorkoutPlanExtraAttributes
