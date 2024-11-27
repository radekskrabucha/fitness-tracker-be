import type { AppRouteHandlerWithAuth } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  PostUserWorkoutSession,
  GetUserWorkoutSessions,
  GetUserWorkoutSessionById
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

export const getUserWorkoutSessionById: AppRouteHandlerWithAuth<
  GetUserWorkoutSessionById
> = async c => {
  const user = c.get('user')
  const params = c.req.valid('param')

  const userWorkoutSession =
    await userWorkoutSessionsService.getUserWorkoutSessionById(
      user.id,
      params.id
    )

  if (!userWorkoutSession) {
    return c.json({ message: 'Not found' }, NOT_FOUND)
  }

  return c.json(userWorkoutSession, OK)
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
