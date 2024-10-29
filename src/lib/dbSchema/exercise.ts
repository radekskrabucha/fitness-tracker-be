import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  exercises,
  muscleGroups,
  exerciseMuscleGroups
} from '~/db/schema/exercise.schema'

export const insertExerciseSchema = createInsertSchema(exercises, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true
  })
  .extend({
    muscleGroupIds: z.array(z.string().uuid()).min(1)
  })
export const patchExerciseSchema = insertExerciseSchema.partial()
export const selectExerciseSchema =
  createSelectSchema(exercises).openapi('Exercise')

export const insertMuscleGroupSchema = createInsertSchema(muscleGroups, {
  name: schema => schema.name.min(1).max(256)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchMuscleGroupSchema = insertMuscleGroupSchema.partial()
export const selectMuscleGroupSchema =
  createSelectSchema(muscleGroups).openapi('MuscleGroup')

export const insertExerciseMuscleGroupSchema =
  createInsertSchema(exerciseMuscleGroups)
export const patchExerciseMuscleGroupSchema =
  insertExerciseMuscleGroupSchema.partial()
export const selectExerciseMuscleGroupSchema =
  createSelectSchema(exerciseMuscleGroups)

export const selectExerciseWithMusclesSchema = z.object({
  exercise: selectExerciseSchema,
  muscleGroups: z.array(selectMuscleGroupSchema)
})

export type InsertExercise = z.infer<typeof insertExerciseSchema>
export type PatchExercise = z.infer<typeof patchExerciseSchema>
export type SelectExercise = z.infer<typeof selectExerciseSchema>

export type InsertMuscleGroup = z.infer<typeof insertMuscleGroupSchema>
export type PatchMuscleGroup = z.infer<typeof patchMuscleGroupSchema>
export type SelectMuscleGroup = z.infer<typeof selectMuscleGroupSchema>

export type InsertExerciseMuscleGroup = z.infer<
  typeof insertExerciseMuscleGroupSchema
>
export type PatchExerciseMuscleGroup = z.infer<
  typeof patchExerciseMuscleGroupSchema
>
export type SelectExerciseMuscleGroup = z.infer<
  typeof selectExerciseMuscleGroupSchema
>

export type SelectExerciseWithMuscles = z.infer<
  typeof selectExerciseWithMusclesSchema
>