import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetWorkoutPlans } from './workout-plans.routes'
import * as workoutService from './workout-plans.services'

export const getWorkoutPlans: AppRouteHandler<GetWorkoutPlans> = async c => {
  const workoutPlans = await workoutService.getWorkoutPlans()

  return c.json(workoutPlans, OK)
}
