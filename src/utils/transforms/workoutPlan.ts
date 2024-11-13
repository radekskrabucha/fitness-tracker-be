import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWithWorkoutsWithExercises
} from '~/lib/dbSchema/workoutPlan'
import type { SelectWorkoutPlanWorkout } from '~/lib/dbSchema/workoutPlanWorkout'
import {
  transformRawUserWorkoutWithExercisesAttributes,
  transformRawWorkoutWithExercisesAttributes
} from './workout'

type TransformRawWorkoutParameters = Parameters<
  typeof transformRawWorkoutWithExercisesAttributes
>

export type WorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: TransformRawWorkoutParameters[0]
}
export type WorkoutPlanRaw<T> = SelectWorkoutPlan & {
  workouts: Array<T>
}

export const transformRawWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<WorkoutPlanWorkoutRaw>
): SelectWorkoutPlanWithWorkoutsWithExercises => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) =>
      transformRawWorkoutWithExercisesAttributes(workout)
    )
  }
}

type TransformRawUserWorkoutParameters = Parameters<
  typeof transformRawUserWorkoutWithExercisesAttributes
>
export type UserWorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: TransformRawUserWorkoutParameters[0]
}
export const transformRawUserWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<UserWorkoutPlanWorkoutRaw>
): SelectWorkoutPlanWithWorkoutsWithExercises => {
  const { workouts, ...rest } = workoutPlan
  const sortedWorkouts = workouts.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    workouts: sortedWorkouts.map(({ workout }) =>
      transformRawUserWorkoutWithExercisesAttributes(workout)
    )
  }
}
