import { createInsertSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { userWorkoutSessionExerciseAttributes } from '~/db/schema/workout-session.schema'

export const insertUserWorkoutSessionExerciseAttributeSchema =
  createInsertSchema(userWorkoutSessionExerciseAttributes, {
    value: schema => schema.min(1)
  }).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
    sessionExerciseId: true
  })
export type InsertUserWorkoutSessionExerciseAttribute = z.infer<
  typeof insertUserWorkoutSessionExerciseAttributeSchema
>

export const patchUserWorkoutSessionExerciseAttributeSchema =
  insertUserWorkoutSessionExerciseAttributeSchema.partial()
export type PatchUserWorkoutSessionExerciseAttribute = z.infer<
  typeof patchUserWorkoutSessionExerciseAttributeSchema
>

export const selectUserWorkoutSessionExerciseAttributeSchema =
  createInsertSchema(userWorkoutSessionExerciseAttributes).omit({
    createdAt: true,
    updatedAt: true,
    userId: true,
    sessionExerciseId: true
  })
export type SelectUserWorkoutSessionExerciseAttribute = z.infer<
  typeof selectUserWorkoutSessionExerciseAttributeSchema
>
