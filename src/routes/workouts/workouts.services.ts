import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises, exerciseCategories } from '~/db/schema/exercise.schema'
import { workouts, workoutExercises } from '~/db/schema/workout.schema'
import type {
  InsertWorkout,
  PatchWorkout,
  SelectWorkoutWithExercises
} from '~/lib/dbSchema/workout'

export const getWorkouts = () => db.query.workouts.findMany()

export const getWorkout = async (
  workoutId: string
): Promise<SelectWorkoutWithExercises | undefined> => {
  const result = await db
    .select({
      workout: workouts,
      workoutExercise: workoutExercises,
      exerciseDetails: exercises,
      exerciseCategory: exerciseCategories
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .leftJoin(exercises, eq(workoutExercises.exerciseId, exercises.id))
    .leftJoin(
      exerciseCategories,
      eq(exercises.categoryId, exerciseCategories.id)
    )
    .where(eq(workouts.id, workoutId))

  const workout = result[0]?.workout

  if (!workout) {
    return undefined
  }

  const exercisesFiltered = result.flatMap(
    ({ workoutExercise, exerciseDetails, exerciseCategory }) => {
      if (!workoutExercise || !exerciseDetails || !exerciseCategory) {
        return []
      }

      return {
        ...workoutExercise,
        details: {
          ...exerciseDetails,
          category: exerciseCategory
        }
      }
    }
  )

  return {
    workout,
    exercises: exercisesFiltered
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

  await db.insert(workoutExercises).values(exerciseIds).returning()

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
