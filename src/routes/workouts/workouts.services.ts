import { eq } from 'drizzle-orm'
import { db } from '~/db'
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
      exercise: workoutExercises
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workouts.id, workoutExercises.workoutId))
    .where(eq(workouts.id, workoutId))

  const workout = result[0]?.workout

  if (!workout) {
    return undefined
  }

  const exercises = result.flatMap(({ exercise }) => {
    if (!exercise) {
      return []
    }

    return exercise
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

  await db.insert(workoutExercises).values(exerciseIds).returning()

  return workoutInserted
}

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
