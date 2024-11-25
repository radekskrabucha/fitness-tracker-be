import { createRouter } from '~/lib/createApp'
import * as handlers from './workout-plans.handlers'
import * as routes from './workout-plans.routes'

export const userWorkoutsRouter = createRouter().openapi(
  routes.getUserTodayWorkoutPlan,
  handlers.getUserTodayWorkoutPlan
)
