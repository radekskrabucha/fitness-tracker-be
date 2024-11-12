import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutExerciseAttributes } from '~/db/schema/user-workout.schema'
import { defaultWorkoutExerciseAttributes } from '~/db/schema/workout.schema'

export const insertWorkoutExerciseAttributeSchemaRaw = createInsertSchema(
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
export const insertWorkoutExerciseAttributeSchema =
  insertWorkoutExerciseAttributeSchemaRaw.omit({
    workoutExerciseId: true
  })
export type InsertWorkoutExerciseAttributeRaw = z.infer<
  typeof insertWorkoutExerciseAttributeSchemaRaw
>
export type InsertWorkoutExerciseAttribute = z.infer<
  typeof insertWorkoutExerciseAttributeSchema
>
export const patchWorkoutExerciseAttributeSchemaRaw =
  insertWorkoutExerciseAttributeSchemaRaw.partial()
export type PatchWorkoutExerciseAttributeRaw = z.infer<
  typeof patchWorkoutExerciseAttributeSchemaRaw
>

export const selectUserWorkoutExerciseAttributeSchema = createSelectSchema(
  userWorkoutExerciseAttributes
).openapi('UserWorkoutExerciseAttribute')
export type SelectUserWorkoutExerciseAttribute = z.infer<
  typeof selectUserWorkoutExerciseAttributeSchema
>
export const selectDefaultWorkoutExerciseAttributeSchema = createSelectSchema(
  defaultWorkoutExerciseAttributes
).openapi('DefaultWorkoutExerciseAttribute')
export type SelectDefaultWorkoutExerciseAttribute = z.infer<
  typeof selectDefaultWorkoutExerciseAttributeSchema
>
