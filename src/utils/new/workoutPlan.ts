import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWithWorkoutsWithExercises
} from '~/lib/dbSchemaNew/workout-plan'
import type { SelectWorkoutPlanWorkout } from '~/lib/dbSchemaNew/workoutPlanWorkout'
import {
  transformRawWorkoutWithExercisesAttributes,
  type WorkoutExerciseWithAttributesRaw,
  type WorkoutRaw
} from './workout'

export type WorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: WorkoutRaw<WorkoutExerciseWithAttributesRaw>
}

export type WorkoutPlanRaw = SelectWorkoutPlan & {
  workouts: Array<WorkoutPlanWorkoutRaw>
}

export const transformRawWorkoutPlan = (
  workoutPlan: WorkoutPlanRaw
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
