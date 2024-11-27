import type { AppRouteHandlerWithAuth } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type {
  PostUserWorkoutSession,
  GetUserWorkoutSessions
} from './workout-sessions.routes'
import * as userWorkoutSessionsService from './workout-sessions.services'

export const getUserWorkoutSessions: AppRouteHandlerWithAuth<
  GetUserWorkoutSessions
> = async c => {
  const user = c.get('user')

  const userWorkoutSessions =
    await userWorkoutSessionsService.getUserWorkoutSessions(user.id)

  return c.json(userWorkoutSessions, OK)
}

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
