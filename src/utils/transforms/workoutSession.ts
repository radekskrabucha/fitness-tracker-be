import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type { SelectWorkoutPlan } from '~/lib/dbSchema/workoutPlan'
import type {
  SelectUserWorkoutSession,
  SelectUserWorkoutSessionWithExtras
} from '~/lib/dbSchema/workoutSession'
import { transformWorkoutSessionExercise } from './workoutSessionExercise'

type TransformSessionExerciseParameters = Parameters<
  typeof transformWorkoutSessionExercise
>

type WorkoutSessionRaw = SelectUserWorkoutSession & {
  exercises: Array<TransformSessionExerciseParameters[0]>
  workout: SelectWorkout
  workoutPlan: SelectWorkoutPlan
}

export const transformRawWorkoutSession = (
  workoutSession: WorkoutSessionRaw
): SelectUserWorkoutSessionWithExtras => {
  const { exercises, ...rest } = workoutSession
  const sortedExercises = exercises.sort((a, b) => a.orderIndex - b.orderIndex)

  return {
    ...rest,
    exercises: sortedExercises.map(transformWorkoutSessionExercise)
  }
}
