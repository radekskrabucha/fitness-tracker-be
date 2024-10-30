import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { workouts, workoutExercises } from '~/db/schema/workout.schema'
import type {
  InsertWorkout,
  PatchWorkout,
  SelectWorkoutWithDetailedExercises
} from '~/lib/dbSchema/workout'
import {
  transformWorkout,
  transformWorkoutWithExerciseDetails
} from '~/utils/workout'

export const getWorkouts = async () => {
  const result = await db.query.workouts.findMany({
    with: {
      workoutExercises: {
        with: {
          exercise: true
        }
      }
    }
  })

  return result.map(transformWorkout)
}

export const getWorkout = async (
  workoutId: string
): Promise<SelectWorkoutWithDetailedExercises | undefined> => {
  const result = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
    with: {
      workoutExercises: {
        with: {
          exercise: {
            with: {
              category: true,
              exerciseMuscleGroups: {
                with: {
                  muscleGroup: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!result) {
    return undefined
  }

  return transformWorkoutWithExerciseDetails(result)
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

  await db.insert(workoutExercises).values(exerciseIds).returning()

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
