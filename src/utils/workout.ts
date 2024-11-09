import type { SelectExercise } from '~/lib/dbSchema/exercise'
import type { SelectUserWorkoutExerciseAttribute } from '~/lib/dbSchema/user-workout'
import type {
  SelectWorkoutExercise,
  SelectWorkout
} from '~/lib/dbSchema/workout'
import {
  transformExerciseWithDetails,
  type ExerciseWithDetailsRaw
} from './exercise'

type WorkoutExerciseRaw = SelectWorkoutExercise & {
  exercise: SelectExercise
}
type WorkoutWithDetailsRaw = SelectWorkout & {
  exercises: Array<WorkoutExerciseRaw>
}
export const transformWorkout = (workout: WorkoutWithDetailsRaw) => {
  const { exercises, ...rest } = workout

  return {
    ...rest,
    exercises: exercises.map(({ exercise, ...rest }) => ({
      ...rest,
      details: exercise
    }))
  }
}

type WorkoutExerciseWithDetailsRaw = SelectWorkoutExercise & {
  exercise: ExerciseWithDetailsRaw
}
type WorkoutWithExerciseDetailsRaw = SelectWorkout & {
  exercises: Array<WorkoutExerciseWithDetailsRaw>
}
export const transformWorkoutWithExerciseDetails = (
  workout: WorkoutWithExerciseDetailsRaw
) => {
  const { exercises, ...rest } = workout

  return {
    ...rest,
    exercises: exercises.map(({ exercise, ...rest }) => ({
      ...rest,
      details: transformExerciseWithDetails(exercise)
    }))
  }
}

export type WorkoutExerciseWithDetailsAndAttributesRaw =
  WorkoutExerciseWithDetailsRaw & {
    attributes: Array<SelectUserWorkoutExerciseAttribute>
  }
export type WorkoutWithExerciseDetailsAndAttributesRaw = SelectWorkout & {
  exercises: Array<WorkoutExerciseWithDetailsAndAttributesRaw>
}
export const transformWorkoutWithExerciseDetailsAndAttributes = (
  workout: WorkoutWithExerciseDetailsAndAttributesRaw
) => {
  const { exercises, ...rest } = workout

  return {
    ...rest,
    exercises: exercises.map(({ exercise, ...rest }) => ({
      ...rest,
      details: transformExerciseWithDetails(exercise)
    }))
  }
}
