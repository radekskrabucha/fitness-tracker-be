import type { SelectWorkout } from '~/lib/dbSchema/workout'
import type {
  SelectWorkoutPlan,
  SelectWorkoutPlanWorkout
} from '~/lib/dbSchema/workout-plan'
import {
  transformWorkoutWithExerciseDetails,
  transformWorkoutWithExerciseDetailsAndAttributes,
  type WorkoutWithExerciseDetailsAndAttributesRaw,
  type WorkoutWithExerciseDetailsRaw
} from './workout'

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

type WorkoutPlanDetailedWorkoutRaw = SelectWorkoutPlanWorkout & {
  workout: WorkoutWithExerciseDetailsAndAttributesRaw
}

type WorkoutPlanWithDetailedPlanWorkoutsRaw = SelectWorkoutPlan & {
  workouts: Array<WorkoutPlanDetailedWorkoutRaw>
}

export const transformWorkoutPlanWithDetailedPlanWorkouts = (
  workoutPlan: WorkoutPlanWithDetailedPlanWorkoutsRaw
) => {
  const { workouts, ...rest } = workoutPlan

  return {
    ...rest,
    workouts: workouts.map(({ orderIndex, workout }) => ({
      ...transformWorkoutWithExerciseDetailsAndAttributes(workout),
      orderIndex
    }))
  }
}

type WorkoutPlanWorkoutWithDetailsRaw = SelectWorkoutPlanWorkout & {
  workout: WorkoutWithExerciseDetailsRaw
}

type WorkoutPlanWithPlanWorkoutsWithDetailsRaw = SelectWorkoutPlan & {
  workouts: Array<WorkoutPlanWorkoutWithDetailsRaw>
}

export const transformWorkoutPlanWithPlanWorkoutsWithDetails = (
  workoutPlan: WorkoutPlanWithPlanWorkoutsWithDetailsRaw
) => {
  const { workouts, ...rest } = workoutPlan

  return {
    ...rest,
    workouts: workouts.map(({ orderIndex, workout }) => ({
      ...transformWorkoutWithExerciseDetails(workout),
      orderIndex
    }))
  }
}
