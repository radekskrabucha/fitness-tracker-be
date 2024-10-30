import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWorkout
} from '~/lib/dbSchema/workout-plan'

type WorkoutPlanWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: SelectWorkout
}

type WorkoutPlanWithPlanWorkoutsRaw = SelectWorkoutPlan & {
  workoutPlanWorkouts: Array<WorkoutPlanWorkoutRaw>
}

export const transformWorkoutPlanWithPlanWorkouts = (
  workoutPlan: WorkoutPlanWithPlanWorkoutsRaw
) => {
  const { workoutPlanWorkouts, ...rest } = workoutPlan

  return {
    ...rest,
    workouts: workoutPlanWorkouts.map(({ orderIndex, workout }) => ({
      ...workout,
      orderIndex
    }))
  }
}
