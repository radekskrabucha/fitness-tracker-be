import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { workouts } from '~/db/schema/workout.schema'
import type { SelectExercise, SelectExerciseExtras } from './exercise'
import { insertUserWorkoutExerciseAttributeSchema } from './workoutExerciseAttributes'

const insertWorkoutSchema = createInsertSchema(workouts, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
const insertWorkoutWithExercisesSchema = z.object({
  exercises: z.object({
    id: z.string().uuid().array().min(1),
    attributes: insertUserWorkoutExerciseAttributeSchema.array()
  })
})
export const insertWorkoutWithExtrasSchema = insertWorkoutSchema.extend(
  insertWorkoutWithExercisesSchema.shape
)
// @ts-expect-error - we use empty object to make it work
export type InsertWorkout<T extends InsertWorkoutExtras = {}> = z.infer<
  typeof insertWorkoutSchema
> &
  T
export type InsertWorkoutWithExercises = z.infer<
  typeof insertWorkoutWithExercisesSchema
>
export type InsertWorkoutExtras = InsertWorkoutWithExercises

export const patchExerciseSchema = insertWorkoutSchema.partial()
export const patchWorkoutWithExtrasSchema =
  insertWorkoutWithExtrasSchema.partial()
export type PatchExercise = z.infer<typeof patchExerciseSchema>
export type PatchWorkoutWithExtras = z.infer<
  typeof patchWorkoutWithExtrasSchema
>

export const selectWorkoutSchema =
  createInsertSchema(workouts).openapi('Workout')
// @ts-expect-error - we use empty object to make it work
export type SelectWorkout<T extends SelectWorkoutExtras = {}> = z.infer<
  typeof selectWorkoutSchema
> &
  T
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutWithExercises<E extends SelectExerciseExtras = {}> = {
  exercises: Array<SelectExercise<E>>
}

// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutExtras<E extends SelectExerciseExtras = {}> =
  SelectWorkoutWithExercises<E>
