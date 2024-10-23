import { createRouter } from '~/lib/createApp'
import * as handlers from './exercises.handlers'
import * as routes from './exercises.routes'

export const exercisesRouter = createRouter()
  .openapi(routes.getExercises, handlers.getExercises)
  .openapi(routes.getExerciseById, handlers.getExerciseById)
  .openapi(routes.createExercise, handlers.createExercise)
