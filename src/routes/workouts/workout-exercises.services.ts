import { eq, and } from 'drizzle-orm'
import { db } from '~/db'
import { workoutExercises } from '~/db/schema/workout.schema'
import type {
  InsertWorkoutExercise,
  PatchWorkoutExercise
} from '~/lib/dbSchema/workout'

export const getWorkoutExercises = (workoutId: string) =>
  db.query.workoutExercises.findMany({
    where: ({ workoutId: id }) => eq(id, workoutId)
  })

export const addWorkoutExercise = (
  workoutId: string,
  exercise: InsertWorkoutExercise
) =>
  db
    .insert(workoutExercises)
    .values({ ...exercise, workoutId })
    .returning()

export const updateWorkoutExercise = (
  workoutId: string,
  exerciseId: string,
  exercise: PatchWorkoutExercise
) =>
  db
    .update(workoutExercises)
    .set(exercise)
    .where(
      and(
        eq(workoutExercises.workoutId, workoutId),
        eq(workoutExercises.id, exerciseId)
      )
    )
    .returning()

export const removeWorkoutExercise = (workoutId: string, exerciseId: string) =>
  db
    .delete(workoutExercises)
    .where(
      and(
        eq(workoutExercises.workoutId, workoutId),
        eq(workoutExercises.id, exerciseId)
      )
    )
    .returning()
