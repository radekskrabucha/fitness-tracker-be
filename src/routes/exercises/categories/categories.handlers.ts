import type { AppRouteHandlerWithAuth } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetExerciseCategories,
  GetExerciseCategory,
  CreateExerciseCategory,
  UpdateExerciseCategory,
  DeleteExerciseCategory
} from './categories.routes'
import * as exerciseCategoryService from './categories.services'

export const getExerciseCategories: AppRouteHandlerWithAuth<
  GetExerciseCategories
> = async c => {
  const exerciseCategories =
    await exerciseCategoryService.getExerciseCategories()

  return c.json(exerciseCategories, OK)
}

export const getExerciseCategory: AppRouteHandlerWithAuth<
  GetExerciseCategory
> = async c => {
  const { id } = c.req.valid('param')
  const exerciseCategory =
    await exerciseCategoryService.getExerciseCategoryById(id)

  if (!exerciseCategory) {
    return c.json({ message: 'Exercise category not found' }, NOT_FOUND)
  }

  return c.json(exerciseCategory, OK)
}

export const createExerciseCategory: AppRouteHandlerWithAuth<
  CreateExerciseCategory
> = async c => {
  const exerciseCategoryData = c.req.valid('json')
  const createdExerciseCategory =
    await exerciseCategoryService.createExerciseCategory(exerciseCategoryData)

  return c.json(createdExerciseCategory, OK)
}

export const updateExerciseCategory: AppRouteHandlerWithAuth<
  UpdateExerciseCategory
> = async c => {
  const { id } = c.req.valid('param')
  const exerciseCategoryData = c.req.valid('json')

  const [updatedExerciseCategory] =
    await exerciseCategoryService.updateExerciseCategory(
      id,
      exerciseCategoryData
    )

  if (!updatedExerciseCategory) {
    return c.json({ message: 'Exercise category not found' }, NOT_FOUND)
  }

  return c.json(updatedExerciseCategory, OK)
}

export const deleteExerciseCategory: AppRouteHandlerWithAuth<
  DeleteExerciseCategory
> = async c => {
  const { id } = c.req.valid('param')

  const [deletedExerciseCategory] =
    await exerciseCategoryService.deleteExerciseCategory(id)

  if (!deletedExerciseCategory) {
    return c.json({ message: 'Exercise category not found' }, NOT_FOUND)
  }

  return c.json(deletedExerciseCategory, OK)
}
