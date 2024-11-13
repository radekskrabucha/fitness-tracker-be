import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { workouts } from '~/db/schema/workout.schema'
import {
  selectExerciseWithDetailsAndAttributesSchema,
  selectExerciseWithDetailsSchema,
  type SelectExercise,
  type SelectExerciseExtras,
  type SelectExerciseWithDetails,
  type SelectExerciseWithDetailsAndAttributes
} from './exercise'

const insertWorkoutSchema = createInsertSchema(workouts, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutExtraExercisesSchema = z.object({
  exercises: z.string().array()
})
export const insertWorkoutWithExtrasSchema = insertWorkoutSchema.extend(
  insertWorkoutExtraExercisesSchema.shape
)
// @ts-expect-error - we use empty object to make it work
export type InsertWorkout<T extends InsertWorkoutExtras = {}> = z.infer<
  typeof insertWorkoutSchema
> &
  T
export type InsertWorkoutWithExercises =
  InsertWorkout<InsertWorkoutExtraExercises>

export type InsertWorkoutExtraExercises = z.infer<
  typeof insertWorkoutExtraExercisesSchema
>
export type InsertWorkoutExtras = InsertWorkoutExtraExercises

export const patchWorkoutSchema = insertWorkoutSchema.partial()
export const patchWorkoutWithExtrasSchema =
  insertWorkoutWithExtrasSchema.partial()
export type PatchWorkout = z.infer<typeof patchWorkoutSchema>
export type PatchWorkoutWithExtras = z.infer<
  typeof patchWorkoutWithExtrasSchema
>

export const selectWorkoutSchema =
  createInsertSchema(workouts).openapi('Workout')
export const selectWorkoutExtraExercisesSchema = z.object({
  exercises: selectExerciseWithDetailsSchema.array()
})
export const selectWorkoutExtraExercisesWithAttributesSchema = z.object({
  exercises: selectExerciseWithDetailsAndAttributesSchema.array()
})
export const selectWorkoutWithExercisesSchema = selectWorkoutSchema.extend(
  selectWorkoutExtraExercisesSchema.shape
)
export const selectWorkoutWithExercisesWithAttributesSchema =
  selectWorkoutSchema.extend(
    selectWorkoutExtraExercisesWithAttributesSchema.shape
  )

// @ts-expect-error - we use empty object to make it work
export type SelectWorkout<T extends SelectWorkoutExtras = {}> = z.infer<
  typeof selectWorkoutSchema
> &
  T
export type SelectWorkoutWithExercises = SelectWorkout<
  SelectWorkoutExtraExercises<SelectExerciseWithDetails>
>
export type SelectWorkoutWithExercisesWithAttributes = SelectWorkout<
  SelectWorkoutExtraExercises<SelectExerciseWithDetailsAndAttributes>
>
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutExtraExercises<E extends SelectExerciseExtras = {}> = {
  exercises: Array<SelectExercise<E>>
}

// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutExtras<E extends SelectExerciseExtras = {}> =
  SelectWorkoutExtraExercises<E>
