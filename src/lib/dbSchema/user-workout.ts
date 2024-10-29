import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutExerciseAttributes } from '~/db/schema/user-workout.schema'

export const insertUserWorkoutExerciseAttributeSchema = createInsertSchema(
  userWorkoutExerciseAttributes,
  {
    value: schema => schema.value.min(1)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const patchUserWorkoutExerciseAttributeSchema =
  insertUserWorkoutExerciseAttributeSchema.partial()
export const selectUserWorkoutExerciseAttributeSchema = createSelectSchema(
  userWorkoutExerciseAttributes
).openapi('UserWorkoutExerciseAttribute')

export type InsertUserWorkoutExerciseAttribute = z.infer<
  typeof insertUserWorkoutExerciseAttributeSchema
>
export type PatchUserWorkoutExerciseAttribute = z.infer<
  typeof patchUserWorkoutExerciseAttributeSchema
>
export type SelectUserWorkoutExerciseAttribute = z.infer<
  typeof selectUserWorkoutExerciseAttributeSchema
>
