import { createRouter } from '~/lib/createApp'
import * as handlers from './workout-plans.handlers'
import * as routes from './workout-plans.routes'

export const userWorkoutPlansRouter = createRouter()
  .openapi(routes.getUserWorkoutPlans, handlers.getUserWorkoutPlans)
  .openapi(routes.getUserWorkoutPlanById, handlers.getUserWorkoutPlanById)
  .openapi(routes.createUserWorkoutPlan, handlers.createUserWorkoutPlan)
  .openapi(routes.deleteUserWorkoutPlan, handlers.deleteUserWorkoutPlan)
