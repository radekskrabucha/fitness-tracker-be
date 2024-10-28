import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workouts,
  workoutExercises,
  workoutExerciseDetails
} from '~/db/schema/workout.schema'
import type { InsertWorkout, PatchWorkout } from '~/lib/dbSchema/workout'

export const getWorkouts = () => db.query.workouts.findMany()

export const getWorkout = (workoutId: string) =>
  db.query.workouts.findFirst({
    where: ({ id }) => eq(id, workoutId)
  })

export const createWorkout = async ({
  exercises,
  ...workout
}: InsertWorkout) => {
  const [workoutInserted] = await db
    .insert(workouts)
    .values(workout)
    .returning()

  if (!workoutInserted) {
    throw new Error('Workout not found')
  }

  const exerciseIds = exercises.map(({ id }, index) => ({
    exerciseId: id,
    orderIndex: index,
    workoutId: workoutInserted.id
  }))

  const insertedWorkoutExercises = await db
    .insert(workoutExercises)
    .values(exerciseIds)
    .returning()

  const arr = insertedWorkoutExercises.flatMap(({ exerciseId, id }) => {
    const exerciseWithDetails = exercises.find(
      exercise => exercise.id === exerciseId
    )

    if (!exerciseWithDetails) {
      return []
    }

    return {
      workoutExerciseId: id,
      ...exerciseWithDetails.details
    }
  })

  await db.insert(workoutExerciseDetails).values(arr)

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
