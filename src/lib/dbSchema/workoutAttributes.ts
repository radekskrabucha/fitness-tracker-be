import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { defaultWorkoutAttributes } from '~/db/schema/workout.schema'

export const workoutValueSchema = z.object({
  value: z.union([z.number(), z.string(), z.boolean()])
})
export const daysOfWeekSchema = z.enum([
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
])
export const intensityLevelSchema = z.enum(['easy', 'medium', 'high'])
export const insertWorkoutAttributeSchemaRaw = createInsertSchema(
  defaultWorkoutAttributes
)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    workoutId: true,
    workoutPlanId: true,
    booleanValue: true,
    integerValue: true,
    textValue: true
  })
  .extend(workoutValueSchema.shape)

const refineInsertWorkout = (data: Partial<InsertWorkoutAttribute>) => {
  switch (data.attributeName) {
    case 'days_of_week':
      return (
        typeof data.value === 'string' &&
        daysOfWeekSchema.safeParse(data.value).success
      )
    case 'intensity_level':
      return (
        typeof data.value === 'string' &&
        intensityLevelSchema.safeParse(data.value).success
      )
    case 'duration_goal':
      return typeof data.value === 'number' && data.value >= 0
    case 'warmup_required':
      return typeof data.value === 'boolean'
    case 'cooldown_required':
      return typeof data.value === 'boolean'
    case 'rest_period_between_sets':
      return typeof data.value === 'number' && data.value >= 0
    default:
      return false
  }
}

export const insertWorkoutAttributeSchema =
  insertWorkoutAttributeSchemaRaw.refine(refineInsertWorkout)
export type InsertWorkoutAttribute = z.infer<
  typeof insertWorkoutAttributeSchemaRaw
>

export const patchWorkoutAttributeSchema = insertWorkoutAttributeSchemaRaw
  .partial()
  .refine(refineInsertWorkout)
export type PatchWorkoutAttribute = z.infer<typeof patchWorkoutAttributeSchema>

export const selectWorkoutAttributeValuesRawSchema = createInsertSchema(
  defaultWorkoutAttributes
)
  .openapi('WorkoutAttribute')
  .omit({
    workoutPlanId: true,
    workoutId: true
  })
  .extend(workoutValueSchema.shape)
export const selectWorkoutAttributeValuesTransformedSchema =
  selectWorkoutAttributeValuesRawSchema.omit({
    booleanValue: true,
    integerValue: true,
    textValue: true
  })
export const selectWorkoutAttributeSchema =
  selectWorkoutAttributeValuesRawSchema.refine(refineInsertWorkout)
export type SelectWorkoutAttribute = Omit<
  z.infer<typeof selectWorkoutAttributeSchema>,
  'integerValue' | 'textValue' | 'booleanValue'
>

export const selectWorkoutAttributesRaw = createInsertSchema(
  defaultWorkoutAttributes
).openapi('WorkoutAttributesRaw')
export type SelectWorkoutAttributesRaw = z.infer<
  typeof selectWorkoutAttributesRaw
>
