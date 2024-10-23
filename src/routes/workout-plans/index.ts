import { createRouter } from '~/lib/createApp'
import * as handlers from './workout-plans.handlers'
import * as routes from './workout-plans.routes'

export const workoutPlansRouter = createRouter()
  .openapi(routes.getWorkoutPlans, handlers.getWorkoutPlans)
  .openapi(routes.getWorkoutPlanById, handlers.getWorkoutPlanById)
  .openapi(routes.postWorkoutPlan, handlers.postWorkoutPlan)
