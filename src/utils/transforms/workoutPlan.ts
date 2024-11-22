import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWithWorkouts,
  SelectWorkoutPlanWithWorkoutsWithDetails
} from '~/lib/dbSchema/workoutPlan'
import type { SelectWorkoutPlanWorkout } from '~/lib/dbSchema/workoutPlanWorkout'
import {
  transformRawUserWorkoutWithExercisesAndAttributes,
  transformRawWorkoutWithExercisesAndAttributes
} from './workout'

type TransformRawWorkoutParameters = Parameters<
  typeof transformRawWorkoutWithExercisesAndAttributes
>
export type WorkoutPlanRaw<T> = SelectWorkoutPlan & {
  workouts: Array<T>
}

export type WorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: SelectWorkout
}

export const transformRawWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<WorkoutPlanWorkoutRaw>
): SelectWorkoutPlanWithWorkouts => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) => workout)
  }
}

export type WorkoutPlanWorkoutRawWithDetails = SelectWorkoutPlanWorkout & {
  workout: TransformRawWorkoutParameters[0]
}

export const transformRawWorkoutPlanWithDetails = (
  workoutPlan: WorkoutPlanRaw<WorkoutPlanWorkoutRawWithDetails>
): SelectWorkoutPlanWithWorkoutsWithDetails => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) =>
      transformRawWorkoutWithExercisesAndAttributes(workout)
    )
  }
}

type TransformRawUserWorkoutParameters = Parameters<
  typeof transformRawUserWorkoutWithExercisesAndAttributes
>
export type UserWorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: SelectWorkout
}
export const transformRawUserWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<UserWorkoutPlanWorkoutRaw>
): SelectWorkoutPlanWithWorkouts => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) => workout)
  }
}

export type UserWorkoutPlanWorkoutRawWithDetails = SelectWorkoutPlanWorkout & {
  workout: TransformRawUserWorkoutParameters[0]
}
export const transformRawUserWorkoutPlanWithDetails = (
  workoutPlan: WorkoutPlanRaw<UserWorkoutPlanWorkoutRawWithDetails>
): SelectWorkoutPlanWithWorkoutsWithDetails => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) =>
      transformRawUserWorkoutWithExercisesAndAttributes(workout)
    )
  }
}
