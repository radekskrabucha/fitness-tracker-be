import { createRouter } from '~/lib/createApp'
import * as handlers from './categories.handlers'
import * as routes from './categories.routes'

export const exerciseCategoriesRouter = createRouter()
  .openapi(routes.getExerciseCategories, handlers.getExerciseCategories)
  .openapi(routes.getExerciseCategory, handlers.getExerciseCategory)
  .openapi(routes.createExerciseCategory, handlers.createExerciseCategory)
  .openapi(routes.updateExerciseCategory, handlers.updateExerciseCategory)
  .openapi(routes.deleteExerciseCategory, handlers.deleteExerciseCategory)
