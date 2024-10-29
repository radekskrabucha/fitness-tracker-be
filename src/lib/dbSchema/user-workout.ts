import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  userWorkoutExerciseAttributes,
  userWorkoutPlans
} from '~/db/schema/user-workout.schema'

export const insertUserWorkoutExerciseAttributeSchema = createInsertSchema(
  userWorkoutExerciseAttributes,
  {
    value: schema => schema.value.min(1)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchUserWorkoutExerciseAttributeSchema =
  insertUserWorkoutExerciseAttributeSchema.partial()
export const selectUserWorkoutExerciseAttributeSchema = createSelectSchema(
  userWorkoutExerciseAttributes
).openapi('UserWorkoutExerciseAttribute')

export const insertUserWorkoutPlanSchema = createInsertSchema(
  userWorkoutPlans
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchUserWorkoutPlanSchema = insertUserWorkoutPlanSchema.partial()
export const selectUserWorkoutPlanSchema =
  createSelectSchema(userWorkoutPlans).openapi('UserWorkoutPlan')

export type InsertUserWorkoutExerciseAttribute = z.infer<
  typeof insertUserWorkoutExerciseAttributeSchema
>
export type PatchUserWorkoutExerciseAttribute = z.infer<
  typeof patchUserWorkoutExerciseAttributeSchema
>
export type SelectUserWorkoutExerciseAttribute = z.infer<
  typeof selectUserWorkoutExerciseAttributeSchema
>

export type InsertUserWorkoutPlan = z.infer<typeof insertUserWorkoutPlanSchema>
export type PatchUserWorkoutPlan = z.infer<typeof patchUserWorkoutPlanSchema>
export type SelectUserWorkoutPlan = z.infer<typeof selectUserWorkoutPlanSchema>
