import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userWorkoutSessionExercises } from '~/db/schema/workout-session.schema'
import {
  selectExerciseWithDetailsSchema,
  type SelectExerciseWithDetails
} from './exercise'
import {
  insertUserWorkoutSessionExerciseAttributeSchema,
  selectUserWorkoutSessionExerciseAttributeSchema,
  type SelectUserWorkoutSessionExerciseAttribute
} from './workoutSessionAttributes'

export const insertWorkoutSessionExerciseSchema = createInsertSchema(
  userWorkoutSessionExercises,
  {
    orderIndex: schema => schema.min(0)
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

export const selectWorkoutSessionExerciseRawSchema = createInsertSchema(
  userWorkoutSessionExercises
).omit({
  createdAt: true,
  updatedAt: true,
  userId: true,
  sessionId: true,
  exerciseId: true
})
export const selectWorkoutSessionExerciseSchema =
  selectWorkoutSessionExerciseRawSchema.omit({ orderIndex: true })

export const selectWorkoutSessionExerciseSchemaExtraAttributesSchema = z.object(
  {
    attributes: selectUserWorkoutSessionExerciseAttributeSchema.array()
  }
)
export const selectWorkoutSessionExerciseSchemaExtraExerciseDetailsSchema =
  z.object({
    exercise: selectExerciseWithDetailsSchema
  })

export const selectWorkoutSessionExerciseSchemaWithExtras =
  selectWorkoutSessionExerciseSchema
    .extend(selectWorkoutSessionExerciseSchemaExtraAttributesSchema.shape)
    .extend(selectWorkoutSessionExerciseSchemaExtraExerciseDetailsSchema.shape)

export type SelectWorkoutSessionExerciseRaw = z.infer<
  typeof selectWorkoutSessionExerciseRawSchema
>
export type SelectWorkoutSessionExercise<
  // @ts-expect-error - we use empty object to make it work
  T extends SelectWorkoutSessionExerciseExtras = {}
> = z.infer<typeof selectWorkoutSessionExerciseSchema> & T

export type SelectWorkoutSessionExerciseWithExtras =
  SelectWorkoutSessionExercise<SelectWorkoutSessionExerciseExtras>

export type SelectWorkoutSessionExerciseExtraAttributes = {
  attributes: Array<SelectUserWorkoutSessionExerciseAttribute>
}
export type SelectWorkoutSessionExerciseExtraExerciseDetails = {
  exercise: SelectExerciseWithDetails
}

export type SelectWorkoutSessionExerciseExtras =
  SelectWorkoutSessionExerciseExtraAttributes &
    SelectWorkoutSessionExerciseExtraExerciseDetails
