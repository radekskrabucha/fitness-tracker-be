import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWorkout
} from '~/lib/dbSchema/workout-plan'

type WorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: SelectWorkout
}

type WorkoutPlanWithPlanWorkoutsRaw = SelectWorkoutPlan & {
  workouts: Array<WorkoutPlanWorkoutRaw>
}

export const transformWorkoutPlanWithPlanWorkouts = (
  workoutPlan: WorkoutPlanWithPlanWorkoutsRaw
) => {
  const { workouts, ...rest } = workoutPlan

  return {
    ...rest,
    workouts: workouts.map(({ orderIndex, workout }) => ({
      ...workout,
      orderIndex
    }))
  }
}
