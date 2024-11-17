import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { muscleGroups } from '~/db/schema/exercise.schema'

export const insertMuscleGroupSchema = createInsertSchema(muscleGroups, {
  name: schema => schema.name.min(1).max(256)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export type InsertMuscleGroup = z.infer<typeof insertMuscleGroupSchema>

export const patchMuscleGroupSchema = insertMuscleGroupSchema.partial()
export type PatchMuscleGroup = z.infer<typeof patchMuscleGroupSchema>

export const selectMuscleGroupSchema = createSelectSchema(muscleGroups)
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .openapi('MuscleGroup')
export type SelectMuscleGroup = z.infer<typeof selectMuscleGroupSchema>
