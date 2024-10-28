import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workouts,
  workoutExercises,
  workoutExerciseDetails
} from '~/db/schema/workout.schema'
import type {
  InsertWorkout,
  PatchWorkout,
  SelectWorkoutWithExercisesDetails
} from '~/lib/dbSchema/workout'

export const getWorkouts = () => db.query.workouts.findMany()

export const getWorkout = async (
  workoutId: string
): Promise<SelectWorkoutWithExercisesDetails | undefined> => {
  const result = await db
    .select({
      workout: workouts,
      exercise: workoutExercises,
      details: workoutExerciseDetails
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(
      workoutExerciseDetails,
      eq(workoutExercises.id, workoutExerciseDetails.workoutExerciseId)
    )
    .where(eq(workouts.id, workoutId))

  const workout = result[0]?.workout

  if (!workout) {
    return undefined
  }

  const exercises = result.flatMap(({ exercise, details }) => {
    if (!exercise || !details) {
      return []
    }

    return {
      ...exercise,
      details
    }
  })

  return {
    workout,
    exercises
  }
}

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
