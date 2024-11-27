import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutSessions } from '~/db/schema/workout-session.schema'
import { insertWorkoutSessionExerciseWithExtrasSchema } from './workoutSessionExercise'

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
export type SelectUserWorkoutSession = z.infer<
  typeof selectUserWorkoutSessionSchema
>
