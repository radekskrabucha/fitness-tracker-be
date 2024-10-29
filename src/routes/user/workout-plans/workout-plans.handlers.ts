import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type {
  CreateUserWorkoutPlan,
  GetUserWorkoutPlans
} from './workout-plans.routes'
import * as userWorkoutPlanService from './workout-plans.services'

export const getUserWorkoutPlans: AppRouteHandler<
  GetUserWorkoutPlans
> = async c => {
  const user = c.get('user')
  const userWorkoutPlans = await userWorkoutPlanService.getUserWorkoutPlans(
    user.id
  )

  return c.json(userWorkoutPlans, OK)
}

export const createUserWorkoutPlan: AppRouteHandler<
  CreateUserWorkoutPlan
> = async c => {
  const user = c.get('user')
  const workoutPlanData = c.req.valid('json')

  const workoutPlan = await userWorkoutPlanService.createUserWorkoutPlan(
    user.id,
    workoutPlanData
  )

  return c.json(workoutPlan, OK)
}
