import type { AppRouteHandler } from '~/types/app'
import { OK, NOT_FOUND } from '~/utils/httpCodes'
import type { GetWorkoutPlans, GetWorkoutPlanById } from './workout-plans.routes'
import * as workoutService from './workout-plans.services'

export const getWorkoutPlans: AppRouteHandler<GetWorkoutPlans> = async c => {
  const workoutPlans = await workoutService.getWorkoutPlans()

  return c.json(workoutPlans, OK)
}

export const getWorkoutPlanById: AppRouteHandler<GetWorkoutPlanById> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlan = await workoutService.getWorkoutPlanById(id)

  if (!workoutPlan) {
    return c.json({ message: 'Workout plan not found' }, NOT_FOUND)
  }

  return c.json(workoutPlan, OK)
}
