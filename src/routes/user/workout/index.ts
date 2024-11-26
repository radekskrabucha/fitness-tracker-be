import { createRouter } from '~/lib/createApp'
import * as handlers from './workout.handlers'
import * as routes from './workout.routes'

export const userWorkoutsRouter = createRouter().openapi(
  routes.getUserTodayWorkoutPlan,
  handlers.getUserTodayWorkoutPlan
)
