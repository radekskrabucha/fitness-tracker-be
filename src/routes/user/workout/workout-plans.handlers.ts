import type { AppRouteHandlerWithAuth } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetUserTodayWorkoutPlan } from './workout-plans.routes'
import * as userWorkoutPlanService from './workout-plans.services'

export const getUserTodayWorkoutPlan: AppRouteHandlerWithAuth<
  GetUserTodayWorkoutPlan
> = async c => {
  const user = c.get('user')

  const userTodayWorkouts =
    await userWorkoutPlanService.getUserTodayWorkoutPlan(user.id)

  return c.json(userTodayWorkouts, OK)
}