import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { workoutPlans } from '~/db/schema/workout-plan.schema'
import type { SelectWorkout, SelectWorkoutExtras } from './workout'

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutPlanWorkout = z.object({
  // TODO add workout attributes
  id: z.string().uuid()
})
export const insertWorkoutPlanWithAttributesSchema = z.object({
  workouts: insertWorkoutPlanWorkout.array()
})
export const insertWorkoutPlanWithExtrasSchema = insertWorkoutPlanSchema.extend(
  insertWorkoutPlanWithAttributesSchema.shape
)
// @ts-expect-error - we use empty object to make it work
export type InsertWorkoutPlan<T extends InsertWorkoutPlanExtras = {}> = z.infer<
  typeof insertWorkoutPlanSchema
> &
  T
export type InsertWorkoutPlanWithWorkouts = z.infer<
  typeof insertWorkoutPlanWithAttributesSchema
>
export type InsertWorkoutPlanExtras = InsertWorkoutPlanWithWorkouts

export const patchWorkoutPlanSchema = insertWorkoutPlanSchema.partial()
export const patchWorkoutPlanWithExtrasSchema =
  insertWorkoutPlanWithExtrasSchema.partial()
export type PatchWorkoutPlan = z.infer<typeof patchWorkoutPlanSchema>
export type PatchWorkoutPlanWithExtras = z.infer<
  typeof patchWorkoutPlanWithExtrasSchema
>

export const selectWorkoutPlanSchema =
  createSelectSchema(workoutPlans).openapi('WorkoutPlan')
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlan<T extends SelectWorkoutPlanExtras = {}> = z.infer<
  typeof selectWorkoutPlanSchema
> &
  T
// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlanWithWorkouts<W extends SelectWorkoutExtras = {}> =
  {
    workouts: Array<SelectWorkout<W>>
  }

// @ts-expect-error - we use empty object to make it work
export type SelectWorkoutPlanExtras<T extends SelectWorkoutExtras = {}> =
  SelectWorkoutPlanWithWorkouts<T>
