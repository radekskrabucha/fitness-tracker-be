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
export const insertWorkoutAttributeSchema = createInsertSchema(
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

export type InsertWorkoutAttribute = z.infer<
  typeof insertWorkoutAttributeSchema
>

export const patchWorkoutAttributeSchema =
  insertWorkoutAttributeSchema.partial()
export type PatchWorkoutAttribute = z.infer<typeof patchWorkoutAttributeSchema>

export const selectWorkoutAttributeSchemaRaw = createInsertSchema(
  defaultWorkoutAttributes
).omit({
  workoutPlanId: true,
  workoutId: true,
  createdAt: true,
  updatedAt: true
})
export const selectWorkoutAttributeSchema = selectWorkoutAttributeSchemaRaw
  .transform(data => {
    switch (data.name) {
      case 'days_of_week':
        return {
          id: data.id,
          name: data.name,
          value: data.textValue as string
        }
      case 'intensity_level':
        return {
          id: data.id,
          name: data.name,
          value: data.textValue as string
        }
      case 'duration_goal':
        return {
          id: data.id,
          name: data.name,
          value: data.integerValue as number
        }
      case 'rest_period_between_sets':
        return {
          id: data.id,
          name: data.name,
          value: data.integerValue as number
        }
      case 'warmup_required':
        return {
          id: data.id,
          name: data.name,
          value: data.booleanValue as boolean
        }
      case 'cooldown_required':
        return {
          id: data.id,
          name: data.name,
          value: data.booleanValue as boolean
        }
      default:
        throw new Error(`Unexpected attribute name: ${data.name}`)
    }
  })
  .openapi('WorkoutAttribute')

export type SelectWorkoutAttribute = z.infer<
  typeof selectWorkoutAttributeSchema
>
export type SelectWorkoutAttributeRaw = z.infer<
  typeof selectWorkoutAttributeSchemaRaw
>
