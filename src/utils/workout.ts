import type { SelectExercise } from '~/lib/dbSchema/exercise'
import type {
  SelectWorkoutExercise,
  SelectWorkout
} from '~/lib/dbSchema/workout'
import {
  transformExerciseWithDetails,
  type ExerciseWithDetailsRaw
} from './exercise'

type WorkoutExerciseWithDetailsRaw = SelectWorkoutExercise & {
  exercise: ExerciseWithDetailsRaw
}
type WorkoutWithExerciseDetailsRaw = SelectWorkout & {
  workoutExercises: Array<WorkoutExerciseWithDetailsRaw>
}
export const transformWorkoutWithExerciseDetails = (
  workout: WorkoutWithExerciseDetailsRaw
) => {
  const { workoutExercises, ...rest } = workout

  return {
    ...rest,
    exercises: workoutExercises.map(({ exercise, ...rest }) => ({
      ...rest,
      details: transformExerciseWithDetails(exercise)
    }))
  }
}

type WorkoutExerciseRaw = SelectWorkoutExercise & {
  exercise: SelectExercise
}
type WorkoutWithDetailsRaw = SelectWorkout & {
  workoutExercises: Array<WorkoutExerciseRaw>
}
export const transformWorkout = (workout: WorkoutWithDetailsRaw) => {
  const { workoutExercises, ...rest } = workout

  return {
    ...rest,
    exercises: workoutExercises.map(({ exercise, ...rest }) => ({
      ...rest,
      details: exercise
    }))
  }
}
