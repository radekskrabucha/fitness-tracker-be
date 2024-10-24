import { createRouter } from '~/lib/createApp'
import * as workoutsHandlers from './workout-plans-workouts.handlers'
import * as workoutsRoutes from './workout-plans-workouts.routes'
import * as handlers from './workout-plans.handlers'
import * as routes from './workout-plans.routes'

export const workoutPlansRouter = createRouter()
  .openapi(routes.getWorkoutPlans, handlers.getWorkoutPlans)
  .openapi(routes.getWorkoutPlanById, handlers.getWorkoutPlanById)
  .openapi(routes.postWorkoutPlan, handlers.postWorkoutPlan)
  .openapi(routes.putWorkoutPlan, handlers.putWorkoutPlan)
  .openapi(routes.deleteWorkoutPlan, handlers.deleteWorkoutPlan)
  .openapi(
    workoutsRoutes.getWorkoutPlanWorkouts,
    workoutsHandlers.getWorkoutPlanWorkouts
  )
  .openapi(
    workoutsRoutes.postWorkoutPlanWorkout,
    workoutsHandlers.postWorkoutPlanWorkout
  )
  .openapi(
    workoutsRoutes.putWorkoutPlanWorkout,
    workoutsHandlers.putWorkoutPlanWorkout
  )
  .openapi(
    workoutsRoutes.deleteWorkoutPlanWorkout,
    workoutsHandlers.deleteWorkoutPlanWorkout
  )
