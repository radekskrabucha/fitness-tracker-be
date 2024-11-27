import { createRouter } from '~/lib/createApp'
import * as handlers from './workout-sessions.handlers'
import * as routes from './workout-sessions.routes'

export const userWorkoutSessionsRouter = createRouter()
  .openapi(routes.getUserWorkoutSessions, handlers.getUserWorkoutSessions)
  .openapi(routes.getUserWorkoutSessionById, handlers.getUserWorkoutSessionById)
  .openapi(routes.postUserWorkoutSession, handlers.postUserWorkoutSession)
