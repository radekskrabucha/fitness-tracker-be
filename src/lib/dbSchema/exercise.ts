import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { exercises } from '~/db/schema/exercise.schema'
import { selectExerciseCategorySchema } from './exerciseCategory'
import { selectMuscleGroupSchema } from './muscleGroups'
import { selectDefaultWorkoutExerciseAttributeSchema } from './workoutExerciseAttributes'

export const insertExerciseSchema = createInsertSchema(exercises, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertExerciseExtraCategoryIdSchema = z.object({
  categoryId: z.string()
})
export const insertExerciseExtraMuscleGroupIdsSchema = z.object({
  muscleGroupIds: z.array(z.string().uuid()).min(1)
})
export const insertExerciseWithExtrasSchema = insertExerciseSchema
  .extend(insertExerciseExtraCategoryIdSchema.shape)
  .extend(insertExerciseExtraMuscleGroupIdsSchema.shape)
// @ts-expect-error - we use empty object to make it work
export type InsertExercise<T extends InsertExerciseExtras = {}> = z.infer<
  typeof insertExerciseSchema
> &
  T
export type InsertExerciseWithDetails =
  InsertExercise<InsertExerciseExtraDetails>

export type InsertExerciseExtraCategoryId = z.infer<
  typeof insertExerciseExtraCategoryIdSchema
>
export type InsertExerciseExtraMuscleGroup = z.infer<
  typeof insertExerciseExtraMuscleGroupIdsSchema
>
export type InsertExerciseExtraDetails = InsertExerciseExtraCategoryId &
  InsertExerciseExtraMuscleGroup
export type InsertExerciseExtras = InsertExerciseExtraDetails

export const patchExerciseSchema = insertExerciseSchema.partial()
export const patchExerciseWithExtrasSchema =
  insertExerciseWithExtrasSchema.partial()

export type PatchExercise = z.infer<typeof patchExerciseSchema>
export type PatchExerciseWithExtras = z.infer<
  typeof patchExerciseWithExtrasSchema
>

export const selectExerciseSchema =
  createSelectSchema(exercises).openapi('Exercise')
export const selectExerciseExtraCategorySchema = z.object({
  category: selectExerciseCategorySchema
})
export const selectExerciseExtraMuscleGroupsSchema = z.object({
  muscleGroups: z.array(selectMuscleGroupSchema)
})
export const selectExerciseExtraAttributesSchema = z.object({
  attributes: z.array(selectDefaultWorkoutExerciseAttributeSchema)
})
export const selectExerciseWithDetailsSchema = selectExerciseSchema
  .extend(selectExerciseExtraCategorySchema.shape)
  .extend(selectExerciseExtraMuscleGroupsSchema.shape)
export const selectExerciseWithDetailsAndAttributesSchema =
  selectExerciseWithDetailsSchema.extend(
    selectExerciseExtraAttributesSchema.shape
  )
// @ts-expect-error - we use empty object to make it work
export type SelectExercise<T extends SelectExerciseExtras = {}> = z.infer<
  typeof selectExerciseSchema
> &
  T
export type SelectExerciseWithDetails =
  SelectExercise<SelectExerciseExtraDetails>
export type SelectExerciseWithDetailsAndAttributes = SelectExercise<
  SelectExerciseExtraDetails & SelectExerciseExtraAttributes
>

export type SelectExerciseExtraCategory = z.infer<
  typeof selectExerciseExtraCategorySchema
>
export type SelectExerciseExtraMuscleGroups = z.infer<
  typeof selectExerciseExtraMuscleGroupsSchema
>
export type SelectExerciseExtraDetails = SelectExerciseExtraCategory &
  SelectExerciseExtraMuscleGroups
export type SelectExerciseExtraAttributes = z.infer<
  typeof selectExerciseExtraAttributesSchema
>
export type SelectExerciseExtras =
  | SelectExerciseExtraDetails
  | (SelectExerciseExtraDetails & SelectExerciseExtraAttributes)
