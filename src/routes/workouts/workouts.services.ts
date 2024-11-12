import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workouts,
  workoutExercises,
  defaultWorkoutExerciseAttributes
} from '~/db/schema/workout.schema'
import type {
  InsertWorkoutWithExercises,
  PatchWorkout
} from '~/lib/dbSchemaNew/workout'
import { transformRawWorkout } from '~/utils/new/workout'

export const getWorkouts = async () => {
  const workout = await db.query.workouts.findMany({
    with: {
      exercises: {
        with: {
          defaultAttributes: true,
          exercise: {
            with: {
              category: true,
              muscleGroups: {
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

  return workout.map(transformRawWorkout)
}

export const getWorkout = async (workoutId: string) => {
  const retrievedWorkouts = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
    with: {
      exercises: {
        with: {
          defaultAttributes: true,
          exercise: {
            with: {
              category: true,
              muscleGroups: {
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

  if (!retrievedWorkouts) {
    return undefined
  }

  return transformRawWorkout(retrievedWorkouts)
}

export const createWorkout = async ({
  exercises,
  ...workout
}: InsertWorkoutWithExercises) => {
  const [workoutInserted] = await db
    .insert(workouts)
    .values(workout)
    .returning()

  if (!workoutInserted) {
    throw new Error('Workout not found')
  }

  const exercisesToInsert = exercises.map(({ id }, index) => ({
    exerciseId: id,
    orderIndex: index,
    workoutId: workoutInserted.id
  }))
  const insertedExercises = await db
    .insert(workoutExercises)
    .values(exercisesToInsert)
    .returning()

  const attributesToInsert = exercises.flatMap(({ attributes, id }) => {
    const workoutExercise = insertedExercises.find(
      exercise => exercise.exerciseId === id
    )

    if (!workoutExercise) {
      return []
    }

    return attributes.map(({ attributeName, value }) => ({
      attributeName,
      value,
      workoutExerciseId: workoutExercise.id
    }))
  })

  await db.insert(defaultWorkoutExerciseAttributes).values(attributesToInsert)

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
