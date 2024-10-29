import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetUserWorkoutPlans } from './workout-plans.routes'
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
