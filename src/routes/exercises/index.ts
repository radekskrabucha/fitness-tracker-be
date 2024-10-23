import { createRouter } from '~/lib/createApp'
import * as handlers from './exercises.handlers'
import * as routes from './exercises.routes'

export const exercisesRouter = createRouter().openapi(
  routes.getExercises,
  handlers.getExercises
)
