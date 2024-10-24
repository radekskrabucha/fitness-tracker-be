import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetWorkoutPlanWorkouts } from './workout-plans-workouts.routes'
import * as workoutService from './workout-plans-workouts.services'

export const getWorkoutPlanWorkouts: AppRouteHandler<
  GetWorkoutPlanWorkouts
> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlanWorkouts = await workoutService.getWorkoutPlanWorkouts(id)

  return c.json(workoutPlanWorkouts, OK)
}
