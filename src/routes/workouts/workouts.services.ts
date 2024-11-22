import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { workouts, workoutExercises } from '~/db/schema/workout.schema'
import type {
  InsertWorkoutWithExercises,
  PatchWorkout
} from '~/lib/dbSchema/workout'
import { transformRawWorkoutWithExercises } from '~/utils/transforms/workout'

export const getWorkouts = async () => {
  const workout = await db.query.workouts.findMany({
    columns: {
      createdAt: false,
      updatedAt: false
    },
    with: {
      exercises: {
        columns: {
          id: true,
          orderIndex: true
        },
        with: {
          exercise: {
            columns: {
              createdAt: false,
              updatedAt: false,
              categoryId: false
            },
            with: {
              category: true,
              muscleGroups: {
                columns: {},
                with: {
                  muscleGroup: {
                    columns: {
                      createdAt: false,
                      updatedAt: false
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  return workout.map(transformRawWorkoutWithExercises)
}

export const getWorkout = async (workoutId: string) => {
  const retrievedWorkouts = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
    columns: {
      createdAt: false,
      updatedAt: false
    },
    with: {
      exercises: {
        columns: {
          id: true,
          orderIndex: true
        },
        with: {
          exercise: {
            columns: {
              createdAt: false,
              updatedAt: false,
              categoryId: false
            },
            with: {
              category: true,
              muscleGroups: {
                columns: {},
                with: {
                  muscleGroup: {
                    columns: {
                      createdAt: false,
                      updatedAt: false
                    }
                  }
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

  return transformRawWorkoutWithExercises(retrievedWorkouts)
}

export const createWorkout = async ({
  exercises,
  ...workout
}: InsertWorkoutWithExercises) => {
  const [workoutInserted] = await db
    .insert(workouts)
    .values(workout)
    .returning({
      id: workouts.id,
      name: workouts.name,
      description: workouts.description
    })

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
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning({
    id: workouts.id,
    name: workouts.name,
    description: workouts.description
  })

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning({
    id: workouts.id,
    name: workouts.name,
    description: workouts.description
  })
