import type {
  SelectWorkout,
  SelectWorkoutWithExercises
} from '~/lib/dbSchemaNew/workout'
import type { SelectWorkoutExercise } from '~/lib/dbSchemaNew/workoutExercise'
import type { SelectDefaultWorkoutExerciseAttribute } from '~/lib/dbSchemaNew/workoutExerciseAttributes'
import {
  transformRawExerciseWithAttributes,
  type ExerciseRaw
} from './exercise'

export type WorkoutExerciseRaw = SelectWorkoutExercise & {
  exercise: ExerciseRaw
  defaultAttributes: Array<SelectDefaultWorkoutExerciseAttribute>
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
    exercises: sortedExercises.map(({ exercise, defaultAttributes }) =>
      transformRawExerciseWithAttributes(exercise, defaultAttributes)
    )
  }
}
