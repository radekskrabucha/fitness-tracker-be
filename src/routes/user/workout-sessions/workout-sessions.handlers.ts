import type { AppRouteHandlerWithAuth } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { PostUserWorkoutSession } from './workout-sessions.routes'
import * as userWorkoutSessionsService from './workout-sessions.services'

export const postUserWorkoutSession: AppRouteHandlerWithAuth<
  PostUserWorkoutSession
> = async c => {
  const user = c.get('user')
  const workoutSessionData = c.req.valid('json')

  const userWorkoutSession =
    await userWorkoutSessionsService.postUserWorkoutSession(
      user.id,
      workoutSessionData
    )

  return c.json(userWorkoutSession, OK)
}
