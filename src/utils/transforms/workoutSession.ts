import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type { SelectWorkoutPlan } from '~/lib/dbSchema/workoutPlan'
import type {
  SelectUserWorkoutSession,
  SelectUserWorkoutSessionWithDetails
} from '~/lib/dbSchema/workoutSession'
import { transformWorkoutSessionExercise } from './workoutSessionExercise'

type TransformSessionExerciseParameters = Parameters<
  typeof transformWorkoutSessionExercise
>

type WorkoutSessionRaw = SelectUserWorkoutSession & {
  workout: SelectWorkout
  workoutPlan: SelectWorkoutPlan
}

type WorkoutSessionRawWithExercises = WorkoutSessionRaw & {
  exercises: Array<TransformSessionExerciseParameters[0]>
}

export const transformWorkoutSessionWithExercises = (
  workoutSession: WorkoutSessionRawWithExercises
): SelectUserWorkoutSessionWithDetails => {
  const { exercises, ...rest } = workoutSession
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(transformWorkoutSessionExercise)
  }
}
