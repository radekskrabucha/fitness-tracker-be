import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  workouts,
  workoutExercises,
  workoutExerciseDetails
} from '~/db/schema/workout.schema'

export const insertWorkoutSchema = createInsertSchema(workouts, {
  name: schema => schema.name.min(1).max(256),
  description: schema => schema.description.max(1024),
  duration: schema =>
    schema.duration.min(1).openapi({
      description: 'Workout duration in minutes'
    }),
  date: z.coerce.date()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const patchWorkoutSchema = insertWorkoutSchema.partial()
export const selectWorkoutSchema = createSelectSchema(workouts, {
  date: z.coerce.date(),
  duration: schema =>
    schema.duration.min(1).openapi({
      description: 'Workout duration in minutes'
    })
}).openapi('Workout')

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

export const insertWorkoutExerciseDetailSchema = createInsertSchema(
  workoutExerciseDetails,
  {
    sets: schema => schema.sets.min(0),
    reps: schema => schema.reps.min(0),
    weight: schema => schema.weight.min(0),
    duration: schema =>
      schema.duration.min(0).openapi({
        description: 'Exercise duration in seconds'
      }),
    distance: schema => schema.distance.min(0)
  }
).omit({
  id: true
})
export const patchWorkoutExerciseDetailSchema =
  insertWorkoutExerciseDetailSchema.partial()
export const selectWorkoutExerciseDetailSchema = createSelectSchema(
  workoutExerciseDetails,
  {
    duration: schema =>
      schema.duration.min(0).openapi({
        description: 'Exercise duration in seconds'
      })
  }
)

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>
export type PatchWorkout = z.infer<typeof patchWorkoutSchema>
export type SelectWorkout = z.infer<typeof selectWorkoutSchema>
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>
export type PatchWorkoutExercise = z.infer<typeof patchWorkoutExerciseSchema>
export type SelectWorkoutExercise = z.infer<typeof selectWorkoutExerciseSchema>
export type InsertWorkoutExerciseDetail = z.infer<
  typeof insertWorkoutExerciseDetailSchema
>
export type PatchWorkoutExerciseDetail = z.infer<
  typeof patchWorkoutExerciseDetailSchema
>
export type SelectWorkoutExerciseDetail = z.infer<
  typeof selectWorkoutExerciseDetailSchema
>
