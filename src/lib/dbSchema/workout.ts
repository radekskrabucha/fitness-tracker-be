import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { workouts, workoutExercises } from '~/db/schema/workout.schema'
import {
  selectExerciseSchema,
  selectExerciseWithDetailsSchema
} from './exercise'
import { selectUserWorkoutExerciseAttributeSchema } from './user-workout'

const insertWorkoutBaseSchema = createInsertSchema(workouts, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024)
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const insertWorkoutSchema = insertWorkoutBaseSchema.extend({
  exercises: z
    .array(
      z.object({
        id: z.string().uuid()
      })
    )
    .min(1)
})
export const patchWorkoutSchema = insertWorkoutBaseSchema.partial()
export const selectWorkoutSchema =
  createSelectSchema(workouts).openapi('Workout')

export const insertWorkoutExerciseSchema = createInsertSchema(
  workoutExercises,
  {
    orderIndex: schema => schema.orderIndex.min(0)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  workoutId: true
})
export const patchWorkoutExerciseSchema = insertWorkoutExerciseSchema
  .partial()
  .omit({
    exerciseId: true
  })
export const selectWorkoutExerciseSchema =
  createSelectSchema(workoutExercises).openapi('WorkoutExercise')

export const selectWorkoutWithExercisesSchema = selectWorkoutSchema.extend({
  exercises: z.array(
    selectWorkoutExerciseSchema.extend({
      details: selectExerciseSchema
    })
  )
})

export const selectWorkoutWithDetailedExercisesSchema =
  selectWorkoutSchema.extend({
    exercises: z.array(
      selectWorkoutExerciseSchema.extend({
        details: selectExerciseWithDetailsSchema
      })
    )
  })

export const selectWorkoutWithDetailedExercisesWithAttributesSchema =
  selectWorkoutSchema.extend({
    exercises: z.array(
      selectWorkoutExerciseSchema.extend({
        attributes: selectUserWorkoutExerciseAttributeSchema.array(),
        details: selectExerciseWithDetailsSchema
      })
    )
  })

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>
export type PatchWorkout = z.infer<typeof patchWorkoutSchema>
export type SelectWorkout = z.infer<typeof selectWorkoutSchema>

export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>
export type PatchWorkoutExercise = z.infer<typeof patchWorkoutExerciseSchema>
export type SelectWorkoutExercise = z.infer<typeof selectWorkoutExerciseSchema>

export type SelectWorkoutWithDetailedExercises = z.infer<
  typeof selectWorkoutWithDetailedExercisesSchema
>
export type SelectWorkoutWithExercises = z.infer<
  typeof selectWorkoutWithExercisesSchema
>

export type SelectWorkoutWithDetailedExercisesWithAttributes = z.infer<
  typeof selectWorkoutWithDetailedExercisesWithAttributesSchema
>
