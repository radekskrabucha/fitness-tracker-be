import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { defaultWorkoutExerciseAttributes } from '~/db/schema/workout.schema'

export const insertWorkoutExerciseAttributeSchemaRaw = createInsertSchema(
  defaultWorkoutExerciseAttributes,
  {
    value: schema => schema.value.min(1)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutExerciseAttributeSchema =
  insertWorkoutExerciseAttributeSchemaRaw.omit({
    workoutExerciseId: true,
    workoutPlanId: true
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

export const selectWorkoutExerciseAttributeSchema = createSelectSchema(
  defaultWorkoutExerciseAttributes
)
  .omit({
    workoutPlanId: true,
    workoutExerciseId: true,
    createdAt: true,
    updatedAt: true
  })
  .openapi('DefaultWorkoutExerciseAttribute')
export type SelectWorkoutExerciseAttribute = z.infer<
  typeof selectWorkoutExerciseAttributeSchema
>
