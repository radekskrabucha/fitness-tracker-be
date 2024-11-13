import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { exerciseCategories } from '~/db/schema/exercise.schema'

export const insertExerciseCategorySchema = createInsertSchema(
  exerciseCategories,
  {
    name: schema => schema.name.min(1).max(50),
    description: schema => schema.description.max(256)
  }
).omit({
  id: true
})
export type InsertExerciseCategory = z.infer<
  typeof insertExerciseCategorySchema
>

export const patchExerciseCategorySchema =
  insertExerciseCategorySchema.partial()
export type PatchExerciseCategory = z.infer<typeof patchExerciseCategorySchema>

export const selectExerciseCategorySchema =
  createSelectSchema(exerciseCategories).openapi('ExerciseCategory')
export type SelectExerciseCategory = z.infer<
  typeof selectExerciseCategorySchema
>
