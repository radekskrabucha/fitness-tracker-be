import type {
  SelectWorkout,
  SelectWorkoutWithExercises,
  SelectWorkoutWithAttributesAndExercises
} from '~/lib/dbSchema/workout'
import {
  selectWorkoutAttributeSchema,
  type SelectWorkoutAttributesRaw
} from '~/lib/dbSchema/workoutAttributes'
import type { SelectWorkoutExercise } from '~/lib/dbSchema/workoutExercise'
import {
  transformRawExercise,
  transformRawExerciseWithAttributes
} from './exercise'

type TransformExerciseParameters = Parameters<
  typeof transformRawExerciseWithAttributes
>

export type WorkoutExerciseRaw = SelectWorkoutExercise & {
  exercise: TransformExerciseParameters[0]
}

export type WorkoutRaw = SelectWorkout & {
  exercises: Array<WorkoutExerciseRaw>
}

export const transformRawWorkout = (
  workout: WorkoutRaw
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
  defaultAttributes: TransformExerciseParameters[1]
}

export type WorkoutRawWithAttributes = SelectWorkout & {
  exercises: Array<WorkoutExerciseWithAttributesRaw>
  defaultAttributes: Array<SelectWorkoutAttributesRaw>
}

export const transformRawWorkoutWithExercisesAttributes = (
  workout: WorkoutRawWithAttributes
): SelectWorkoutWithAttributesAndExercises => {
  const { exercises, defaultAttributes, ...rest } = workout
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(({ exercise, defaultAttributes }) =>
      transformRawExerciseWithAttributes(exercise, defaultAttributes)
    ),
    attributes: selectWorkoutAttributeSchema.array().parse(defaultAttributes)
  }
}

export type UserWorkoutExerciseWithAttributesRaw = WorkoutExerciseRaw & {
  attributes: TransformExerciseParameters[1]
}

export type WorkoutRawWithUserAttributes = SelectWorkout & {
  exercises: Array<UserWorkoutExerciseWithAttributesRaw>
  attributes: Array<SelectWorkoutAttributesRaw>
}

export const transformRawUserWorkoutWithExercisesAttributes = (
  workout: WorkoutRawWithUserAttributes
): SelectWorkoutWithAttributesAndExercises => {
  const { exercises, attributes, ...rest } = workout
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(({ exercise, attributes }) =>
      transformRawExerciseWithAttributes(exercise, attributes)
    ),
    attributes: selectWorkoutAttributeSchema.array().parse(attributes)
  }
}
