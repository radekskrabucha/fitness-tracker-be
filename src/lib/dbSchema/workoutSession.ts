import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutSessions } from '~/db/schema/workout-session.schema'
import { selectWorkoutSchema, type SelectWorkout } from './workout'
import { selectWorkoutPlanSchema, type SelectWorkoutPlan } from './workoutPlan'
import {
  insertWorkoutSessionExerciseWithExtrasSchema,
  selectWorkoutSessionExerciseSchemaWithExtras,
  type SelectWorkoutSessionExerciseWithExtras
} from './workoutSessionExercise'

export const insertUserWorkoutSessionSchema = createInsertSchema(
  userWorkoutSessions
).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
})
export const insertUserWorkoutSessionExtraExercisesSchema = z.object({
  exercises: z.array(insertWorkoutSessionExerciseWithExtrasSchema)
})
export const insertUserWorkoutSessionWithExtrasSchema =
  insertUserWorkoutSessionSchema.extend(
    insertUserWorkoutSessionExtraExercisesSchema.shape
  )
export type InsertUserWorkoutSession<
  // @ts-expect-error - we use empty object to make it work
  T extends InsertUserWorkoutSessionExerciseExtras = {}
> = z.infer<typeof insertUserWorkoutSessionSchema> & T
export type InsertUserWorkoutSessionWithExtras =
  InsertUserWorkoutSession<InsertUserWorkoutSessionExtras>
export type InsertUserWorkoutSessionExtraExercises = z.infer<
  typeof insertUserWorkoutSessionExtraExercisesSchema
>
export type InsertUserWorkoutSessionExtras =
  InsertUserWorkoutSessionExtraExercises

export const patchUserWorkoutSessionSchema =
  insertUserWorkoutSessionSchema.partial()
export type PatchUserWorkoutSession = z.infer<
  typeof patchUserWorkoutSessionSchema
>

export const selectUserWorkoutSessionSchema = createInsertSchema(
  userWorkoutSessions
).omit({
  userId: true,
  workoutPlanId: true,
  workoutId: true,
  createdAt: true,
  updatedAt: true
})

export const selectUserWorkoutSessionSchemaExtraExercisesSchema = z.object({
  exercises: selectWorkoutSessionExerciseSchemaWithExtras.array()
})
export const selectUserWorkoutSessionSchemaExtraWorkoutSchema = z.object({
  workout: selectWorkoutSchema
})
export const selectUserWorkoutSessionSchemaExtraWorkoutPlanSchema = z.object({
  workoutPlan: selectWorkoutPlanSchema
})

export const selectUserWorkoutSessionSchemaWithDetails =
  selectUserWorkoutSessionSchema
    .extend(selectUserWorkoutSessionSchemaExtraExercisesSchema.shape)
    .extend(selectUserWorkoutSessionSchemaExtraWorkoutSchema.shape)
    .extend(selectUserWorkoutSessionSchemaExtraWorkoutPlanSchema.shape)

export const selectUserWorkoutSessionSchemaWithOverview =
  selectUserWorkoutSessionSchema
    .extend(selectUserWorkoutSessionSchemaExtraWorkoutSchema.shape)
    .extend(selectUserWorkoutSessionSchemaExtraWorkoutPlanSchema.shape)

export type SelectUserWorkoutSession<
  // @ts-expect-error - we use empty object to make it work
  T extends SelectUserWorkoutSessionExtras = {}
> = z.infer<typeof selectUserWorkoutSessionSchema> & T

export type SelectUserWorkoutSessionWithDetails =
  SelectUserWorkoutSession<SelectUserWorkoutSessionExtraDetails>
export type SelectUserWorkoutSessionWithOverview =
  SelectUserWorkoutSession<SelectUserWorkoutSessionExtraOverview>

export type SelectUserWorkoutSessionExtraExercises = {
  exercises: Array<SelectWorkoutSessionExerciseWithExtras>
}
export type SelectUserWorkoutSessionExtraWorkout = {
  workout: SelectWorkout
}
export type SelectUserWorkoutSessionExtraWorkoutPlan = {
  workoutPlan: SelectWorkoutPlan
}

export type SelectUserWorkoutSessionExtraOverview =
  SelectUserWorkoutSessionExtraWorkout &
    SelectUserWorkoutSessionExtraWorkoutPlan

export type SelectUserWorkoutSessionExtraDetails =
  SelectUserWorkoutSessionExtraOverview & SelectUserWorkoutSessionExtraExercises

export type SelectUserWorkoutSessionExtras =
  | SelectUserWorkoutSessionExtraDetails
  | SelectUserWorkoutSessionExtraOverview
