import { createRouter } from '~/lib/createApp'
import * as exerciseHandlers from './workout-exercises.handlers'
import * as exerciseRoutes from './workout-exercises.routes'
import * as handlers from './workouts.handlers'
import * as routes from './workouts.routes'

export const workoutsRouter = createRouter()
  .openapi(routes.listWorkouts, handlers.listWorkouts)
  .openapi(routes.getWorkout, handlers.getWorkout)
  .openapi(routes.createWorkout, handlers.createWorkout)
  .openapi(routes.updateWorkout, handlers.updateWorkout)
  .openapi(routes.deleteWorkout, handlers.deleteWorkout)
  .openapi(
    exerciseRoutes.getWorkoutExercises,
    exerciseHandlers.getWorkoutExercises
  )
  .openapi(
    exerciseRoutes.addWorkoutExercise,
    exerciseHandlers.addWorkoutExercise
  )
  .openapi(
    exerciseRoutes.updateWorkoutExercise,
    exerciseHandlers.updateWorkoutExercise
  )
  .openapi(
    exerciseRoutes.removeWorkoutExercise,
    exerciseHandlers.removeWorkoutExercise
  )
