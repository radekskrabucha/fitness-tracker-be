import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { ListWorkouts } from './workouts.routes'
import * as workoutService from './workouts.services'

export const listWorkouts: AppRouteHandler<ListWorkouts> = async c => {
  const { id } = c.get('user')

  const userWorkouts = await workoutService.getUserWorkouts(id)

  return c.json(userWorkouts, OK)
}
