import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { workouts, workoutExercises } from '~/db/schema/workout.schema'
import type {
  InsertWorkoutWithExercises,
  PatchWorkout
} from '~/lib/dbSchema/workout'
import { transformRawWorkout } from '~/utils/transforms/workout'

export const getWorkouts = async () => {
  const workout = await db.query.workouts.findMany({
    with: {
      exercises: {
        with: {
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

  const exercisesToInsert = exercises.map((id, index) => ({
    exerciseId: id,
    orderIndex: index,
    workoutId: workoutInserted.id
  }))
  await db.insert(workoutExercises).values(exercisesToInsert)

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
