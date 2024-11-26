import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutSessionExercises } from '~/db/schema/workout-session'
import { insertUserWorkoutSessionExerciseAttributeSchema } from './workoutSessionAttributes'

export const insertWorkoutSessionExerciseSchema = createInsertSchema(
  userWorkoutSessionExercises,
  {
    orderIndex: schema => schema.orderIndex.min(0)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  sessionId: true,
  orderIndex: true
})
export const insertWorkoutSessionExerciseExtraAttributesSchema = z.object({
  attributes: z.array(insertUserWorkoutSessionExerciseAttributeSchema)
})
export const insertWorkoutSessionExerciseWithExtrasSchema =
  insertWorkoutSessionExerciseSchema.extend(
    insertWorkoutSessionExerciseExtraAttributesSchema.shape
  )
export type InsertWorkoutSessionExercise<
  // @ts-expect-error - we use empty object to make it work
  T extends InsertWorkoutSessionExerciseExtras = {}
> = z.infer<typeof insertWorkoutSessionExerciseSchema> & T
export type InsertWorkoutSessionExerciseWithExtras =
  InsertWorkoutSessionExercise<InsertWorkoutSessionExerciseExtras>
export type InsertWorkoutSessionExerciseExtraAttributes = z.infer<
  typeof insertWorkoutSessionExerciseExtraAttributesSchema
>
export type InsertWorkoutSessionExerciseExtras =
  InsertWorkoutSessionExerciseExtraAttributes

export const patchWorkoutSessionExerciseSchema =
  insertWorkoutSessionExerciseSchema
    .omit({
      exerciseId: true
    })
    .partial()
export type PatchWorkoutSessionExercise = z.infer<
  typeof patchWorkoutSessionExerciseSchema
>

export const selectWorkoutSessionExerciseSchema = createInsertSchema(
  userWorkoutSessionExercises
).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
  sessionId: true,
  orderIndex: true,
  exerciseId: true
})
export type SelectWorkoutSessionExercise = z.infer<
  typeof selectWorkoutSessionExerciseSchema
>
