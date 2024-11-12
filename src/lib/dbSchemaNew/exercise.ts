import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { exercises } from '~/db/schema/exercise.schema'
import { selectExerciseCategorySchema } from './exerciseCategory'
import { selectMuscleGroupSchema } from './muscleGroups'
import {
  selectDefaultWorkoutExerciseAttributeSchema,
  selectUserWorkoutExerciseAttributeSchema
} from './workoutExerciseAttributes'

export const insertExerciseSchema = createInsertSchema(exercises, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const insertExerciseWithCategoryIdSchema = z.object({
  categoryId: z.string()
})
export const insertExerciseWithMuscleGroupIdsSchema = z.object({
  muscleGroupIds: z.array(z.string().uuid()).min(1)
})
export const insertExerciseWithExtrasSchema = insertExerciseSchema
  .extend(insertExerciseWithCategoryIdSchema.shape)
  .extend(insertExerciseWithMuscleGroupIdsSchema.shape)
// @ts-expect-error - we use empty object to make it work
export type InsertExercise<T extends InsertExerciseExtras = {}> = z.infer<
  typeof insertExerciseSchema
> &
  T
export type InsertExerciseWithCategoryId = z.infer<
  typeof insertExerciseWithCategoryIdSchema
>
export type InsertExerciseWithMuscleGroupIds = z.infer<
  typeof insertExerciseWithMuscleGroupIdsSchema
>
export type InsertExerciseWithDetails = InsertExerciseWithCategoryId &
  InsertExerciseWithMuscleGroupIds
export type InsertExerciseExtras = InsertExerciseWithDetails

export const patchExerciseSchema = insertExerciseSchema.partial()
export const patchExerciseWithExtrasSchema =
  insertExerciseWithExtrasSchema.partial()

export type PatchExercise = z.infer<typeof patchExerciseSchema>
export type PatchExerciseWithExtras = z.infer<
  typeof patchExerciseWithExtrasSchema
>

export const selectExerciseSchema =
  createSelectSchema(exercises).openapi('Exercise')
export const selectExerciseWithCategorySchema = z.object({
  category: selectExerciseCategorySchema
})
export const selectExerciseWithMuscleGroupsSchema = z.object({
  muscleGroups: z.array(selectMuscleGroupSchema)
})
export const selectExerciseWithAttributesSchema = z.object({
  attributes: z.array(selectUserWorkoutExerciseAttributeSchema)
})
export const selectExerciseWithDefaultAttributesSchema = z.object({
  defaultAttributes: z.array(selectDefaultWorkoutExerciseAttributeSchema)
})
export const selectExerciseWithDetailsSchema = selectExerciseSchema
  .extend(selectExerciseWithCategorySchema.shape)
  .extend(selectExerciseWithMuscleGroupsSchema.shape)
export const selectExerciseWithDetailsAndAttributesSchema =
  selectExerciseWithDetailsSchema.extend(
    selectExerciseWithAttributesSchema.shape
  )
export const selectExerciseWithDetailsAndDefaultAttributesSchema =
  selectExerciseWithDetailsSchema.extend(
    selectExerciseWithDefaultAttributesSchema.shape
  )
// @ts-expect-error - we use empty object to make it work
export type SelectExercise<T extends SelectExerciseExtras = {}> = z.infer<
  typeof selectExerciseSchema
> &
  T
export type SelectExerciseWithCategory = z.infer<
  typeof selectExerciseWithCategorySchema
>
export type SelectExerciseWithMuscleGroups = z.infer<
  typeof selectExerciseWithMuscleGroupsSchema
>
export type SelectExerciseWithDetails = SelectExerciseWithCategory &
  SelectExerciseWithMuscleGroups
export type SelectExerciseWithAttributes = z.infer<
  typeof selectExerciseWithAttributesSchema
>
export type SelectExerciseWithDefaultAttributes = z.infer<
  typeof selectExerciseWithDefaultAttributesSchema
>
export type SelectExerciseExtras =
  | SelectExerciseWithDetails
  | (SelectExerciseWithDetails & SelectExerciseWithAttributes)
  | (SelectExerciseWithDetails & SelectExerciseWithDefaultAttributes)
