import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutPlans } from '~/db/schema/user-workout.schema'
import {
  insertWorkoutPlanExtraAttributesSchema,
  type InsertWorkoutPlanExtras
} from './workoutPlan'

export const insertUserWorkoutPlanSchema = createInsertSchema(
  userWorkoutPlans
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const insertUserWorkoutPlanWithExtrasSchema =
  insertUserWorkoutPlanSchema.extend(
    insertWorkoutPlanExtraAttributesSchema.shape
  )
// @ts-expect-error - we use empty object to make it work
export type InsertUserWorkoutPlan<T extends InsertWorkoutPlanExtras = {}> =
  z.infer<typeof insertUserWorkoutPlanSchema> & T
export type InsertUserWorkoutPlanWithExtras =
  InsertUserWorkoutPlan<InsertWorkoutPlanExtras>

export const selectUserWorkoutPlanSchema = createInsertSchema(userWorkoutPlans)
  .omit({
    createdAt: true,
    updatedAt: true,
    userId: true
  })
  .openapi('UserWorkoutPlan')

export type SelectUserWorkoutPlan = z.infer<typeof selectUserWorkoutPlanSchema>
