import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import type { z } from 'zod'
import { workoutExercises } from '~/db/schema/workout.schema'

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
export type InsertWorkoutExercise = z.infer<typeof insertWorkoutExerciseSchema>

export const patchWorkoutExerciseSchema = insertWorkoutExerciseSchema
  .partial()
  .omit({
    exerciseId: true
  })
export type PatchWorkoutExercise = z.infer<typeof patchWorkoutExerciseSchema>

export const selectWorkoutExerciseSchema = createSelectSchema(workoutExercises)
  .omit({
    createdAt: true,
    updatedAt: true,
    workoutId: true,
    exerciseId: true
  })
  .openapi('WorkoutExercise')
export type SelectWorkoutExercise = z.infer<typeof selectWorkoutExerciseSchema>
