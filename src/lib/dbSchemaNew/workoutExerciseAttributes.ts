import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutExerciseAttributes } from '~/db/schema/user-workout.schema'
import { defaultWorkoutExerciseAttributes } from '~/db/schema/workout.schema'

export const insertUserWorkoutExerciseAttributeSchemaRaw = createInsertSchema(
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
export const insertUserWorkoutExerciseAttributeSchema =
  insertUserWorkoutExerciseAttributeSchemaRaw.omit({
    workoutExerciseId: true
  })
export type InsertUserWorkoutExerciseAttributeRaw = z.infer<
  typeof insertUserWorkoutExerciseAttributeSchemaRaw
>
export type InsertUserWorkoutExerciseAttribute = z.infer<
  typeof insertUserWorkoutExerciseAttributeSchema
>
export const patchUserWorkoutExerciseAttributeSchemaRaw =
  insertUserWorkoutExerciseAttributeSchemaRaw.partial()
export type PatchUserWorkoutExerciseAttributeRaw = z.infer<
  typeof patchUserWorkoutExerciseAttributeSchemaRaw
>

export const selectUserWorkoutExerciseAttributeSchema = createSelectSchema(
  userWorkoutExerciseAttributes
).openapi('UserWorkoutExerciseAttribute')
export type SelectUserWorkoutExerciseAttribute = z.infer<
  typeof selectUserWorkoutExerciseAttributeSchema
>

export const insertDefaultWorkoutExerciseAttributeSchema = createInsertSchema(
  defaultWorkoutExerciseAttributes,
  {
    value: schema => schema.value.min(1)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type InsertDefaultWorkoutExerciseAttribute = z.infer<
  typeof insertDefaultWorkoutExerciseAttributeSchema
>
export const patchDefaultWorkoutExerciseAttributeSchema =
  insertDefaultWorkoutExerciseAttributeSchema.partial()
export type PatchDefaultWorkoutExerciseAttribute = z.infer<
  typeof patchDefaultWorkoutExerciseAttributeSchema
>

export const selectDefaultWorkoutExerciseAttributeSchema = createSelectSchema(
  defaultWorkoutExerciseAttributes
).openapi('DefaultWorkoutExerciseAttribute')
export type SelectDefaultWorkoutExerciseAttribute = z.infer<
  typeof selectDefaultWorkoutExerciseAttributeSchema
>
