import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWithWorkoutsWithExercises
} from '~/lib/dbSchema/workoutPlan'
import type { SelectWorkoutPlanWorkout } from '~/lib/dbSchema/workoutPlanWorkout'
import {
  transformRawUserWorkoutWithExercisesAttributes,
  transformRawWorkoutWithExercisesAttributes,
  type UserWorkoutExerciseWithAttributesRaw,
  type WorkoutExerciseWithAttributesRaw,
  type WorkoutRaw
} from './workout'

export type WorkoutPlanWorkoutRaw<T> = SelectWorkoutPlanWorkout & {
  workout: WorkoutRaw<T>
}

export type WorkoutPlanRaw<T> = SelectWorkoutPlan & {
  workouts: Array<WorkoutPlanWorkoutRaw<T>>
}

export const transformRawWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<WorkoutExerciseWithAttributesRaw>
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
export const transformRawUserWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw<UserWorkoutExerciseWithAttributesRaw>
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
