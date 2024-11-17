import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { workoutPlans } from '~/db/schema/workout-plan.schema'
import {
  selectWorkoutWithAttributesAndExercisesSchema,
  type SelectWorkout,
  type SelectWorkoutExtras,
  type SelectWorkoutWithAttributesAndExercises
} from './workout'
import { insertWorkoutAttributeSchema } from './workoutAttributes'
import { insertWorkoutExerciseAttributeSchema } from './workoutExerciseAttributes'

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutExercise = z.object({
  id: z.string().uuid(),
  attributes: insertWorkoutExerciseAttributeSchema.array()
})
export const insertWorkoutPlanWorkout = z.object({
  id: z.string().uuid(),
  attributes: insertWorkoutAttributeSchema.array(),
  exercises: insertWorkoutExercise.array()
})
export const insertWorkoutPlanExtraAttributesSchema = z.object({
  workouts: insertWorkoutPlanWorkout.array()
})
export const insertWorkoutPlanWithExtrasSchema = insertWorkoutPlanSchema.extend(
  insertWorkoutPlanExtraAttributesSchema.shape
)
// @ts-expect-error - we use empty object to make it work
export type InsertWorkoutPlan<T extends InsertWorkoutPlanExtras = {}> = z.infer<
  typeof insertWorkoutPlanSchema
> &
  T
export type InsertWorkoutPlanWithExtras =
  InsertWorkoutPlan<InsertWorkoutPlanExtraWorkouts>
export type InsertWorkoutPlanExtraWorkouts = z.infer<
  typeof insertWorkoutPlanExtraAttributesSchema
>
export type InsertWorkoutPlanExtras = InsertWorkoutPlanExtraWorkouts

export const patchWorkoutPlanSchema = insertWorkoutPlanSchema.partial()
export const patchWorkoutPlanWithExtrasSchema =
  insertWorkoutPlanWithExtrasSchema.partial()
export type PatchWorkoutPlan = z.infer<typeof patchWorkoutPlanSchema>
export type PatchWorkoutPlanWithExtras = z.infer<
  typeof patchWorkoutPlanWithExtrasSchema
>

export const selectWorkoutPlanSchema = createSelectSchema(workoutPlans)
  .omit({
    createdAt: true,
    updatedAt: true
  })
  .openapi('WorkoutPlan')
export const selectWorkoutPlanExtraWorkoutsSchema = z.object({
  workouts: selectWorkoutWithAttributesAndExercisesSchema.array()
})
export const selectWorkoutPlanWithWorkoutsSchema =
  selectWorkoutPlanSchema.extend(selectWorkoutPlanExtraWorkoutsSchema.shape)
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlan<T extends SelectWorkoutPlanExtras = {}> = z.infer<
  typeof selectWorkoutPlanSchema
> &
  T
export type SelectWorkoutPlanWithWorkoutsWithExercises = SelectWorkoutPlan<
  SelectWorkoutPlanExtraWorkouts<SelectWorkoutWithAttributesAndExercises>
>
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlanExtraWorkouts<W extends SelectWorkoutExtras = {}> =
  {
    workouts: Array<SelectWorkout<W>>
  }

// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlanExtras<T extends SelectWorkoutExtras = {}> =
  SelectWorkoutPlanExtraWorkouts<T>
