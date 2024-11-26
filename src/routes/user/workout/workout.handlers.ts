import type { AppRouteHandlerWithAuth } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetUserTodayWorkoutPlan } from './workout.routes'
import * as userWorkoutService from './workout.services'

export const getUserTodayWorkoutPlan: AppRouteHandlerWithAuth<
  GetUserTodayWorkoutPlan
> = async c => {
  const user = c.get('user')

  const userTodayWorkouts = await userWorkoutService.getUserTodayWorkoutPlan(
    user.id
  )

  return c.json(userTodayWorkouts, OK)
}
