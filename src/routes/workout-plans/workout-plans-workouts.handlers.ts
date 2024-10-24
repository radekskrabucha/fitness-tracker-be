import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type {
  GetWorkoutPlanWorkouts,
  PostWorkoutPlanWorkout
} from './workout-plans-workouts.routes'
import * as workoutService from './workout-plans-workouts.services'

export const getWorkoutPlanWorkouts: AppRouteHandler<
  GetWorkoutPlanWorkouts
> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlanWorkouts = await workoutService.getWorkoutPlanWorkouts(id)

  return c.json(workoutPlanWorkouts, OK)
}

export const postWorkoutPlanWorkout: AppRouteHandler<
  PostWorkoutPlanWorkout
> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlanWorkoutData = c.req.valid('json')

  const [workout] = await workoutService.createWorkoutPlanWorkout(
    id,
    workoutPlanWorkoutData
  )

  return c.json(workout, OK)
}
