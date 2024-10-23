import { createRouter } from '~/lib/createApp'
import * as handlers from './workouts.handlers'
import * as routes from './workouts.routes'

export const workoutsRouter = createRouter()
  .openapi(routes.listWorkouts, handlers.listWorkouts)
  .openapi(routes.getWorkout, handlers.getWorkout)
  .openapi(routes.createWorkout, handlers.createWorkout)
  .openapi(routes.updateWorkout, handlers.updateWorkout)
