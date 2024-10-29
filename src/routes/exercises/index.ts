import { createRouter } from '~/lib/createApp'
import * as exerciseCategoryHandlers from './exercises-categories.handlers'
import * as exerciseCategoryRoutes from './exercises-categories.routes'
import * as handlers from './exercises.handlers'
import * as routes from './exercises.routes'

export const exercisesRouter = createRouter()
  .openapi(routes.getExercises, handlers.getExercises)
  .openapi(routes.getExerciseById, handlers.getExerciseById)
  .openapi(routes.createExercise, handlers.createExercise)
  .openapi(routes.updateExercise, handlers.updateExercise)
  .openapi(routes.deleteExercise, handlers.deleteExercise)
  .openapi(
    exerciseCategoryRoutes.getExerciseCategories,
    exerciseCategoryHandlers.getExerciseCategories
  )
  .openapi(
    exerciseCategoryRoutes.getExerciseCategory,
    exerciseCategoryHandlers.getExerciseCategory
  )
  .openapi(
    exerciseCategoryRoutes.createExerciseCategory,
    exerciseCategoryHandlers.createExerciseCategory
  )
  .openapi(
    exerciseCategoryRoutes.updateExerciseCategory,
    exerciseCategoryHandlers.updateExerciseCategory
  )
  .openapi(
    exerciseCategoryRoutes.deleteExerciseCategory,
    exerciseCategoryHandlers.deleteExerciseCategory
  )
