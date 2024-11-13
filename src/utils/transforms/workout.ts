import type {
  SelectWorkout,
  SelectWorkoutWithExercises,
  SelectWorkoutWithExercisesWithAttributes
} from '~/lib/dbSchema/workout'
import type { SelectWorkoutExercise } from '~/lib/dbSchema/workoutExercise'
import type { SelectDefaultWorkoutExerciseAttribute } from '~/lib/dbSchema/workoutExerciseAttributes'
import {
  transformRawExercise,
  transformRawExerciseWithAttributes,
  type ExerciseRaw
} from './exercise'

export type WorkoutExerciseRaw = SelectWorkoutExercise & {
  exercise: ExerciseRaw
}

export type WorkoutRaw<T> = SelectWorkout & {
  exercises: Array<T>
}

export const transformRawWorkout = (
  workout: WorkoutRaw<WorkoutExerciseRaw>
): SelectWorkoutWithExercises => {
  const { exercises, ...rest } = workout
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(({ exercise }) =>
      transformRawExercise(exercise)
    )
  }
}

export type WorkoutExerciseWithAttributesRaw = WorkoutExerciseRaw & {
  defaultAttributes: Array<SelectDefaultWorkoutExerciseAttribute>
}

export const transformRawWorkoutWithExercisesAttributes = (
  workout: WorkoutRaw<WorkoutExerciseWithAttributesRaw>
): SelectWorkoutWithExercisesWithAttributes => {
  const { exercises, ...rest } = workout
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(({ exercise, defaultAttributes }) =>
      transformRawExerciseWithAttributes(exercise, defaultAttributes)
    )
  }
}

export type UserWorkoutExerciseWithAttributesRaw = WorkoutExerciseRaw & {
  attributes: Array<SelectDefaultWorkoutExerciseAttribute>
}

export const transformRawUserWorkoutWithExercisesAttributes = (
  workout: WorkoutRaw<UserWorkoutExerciseWithAttributesRaw>
): SelectWorkoutWithExercisesWithAttributes => {
  const { exercises, ...rest } = workout
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(({ exercise, attributes }) =>
      transformRawExerciseWithAttributes(exercise, attributes)
    )
  }
}
