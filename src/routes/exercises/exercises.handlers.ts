import type { AppRouteHandlerWithAuth } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetExercises,
  GetExerciseById,
  CreateExercise,
  UpdateExercise,
  DeleteExercise
} from './exercises.routes'
import * as exerciseService from './exercises.services'

export const getExercises: AppRouteHandlerWithAuth<GetExercises> = async c => {
  const exercises = await exerciseService.getExercises()
  return c.json(exercises, OK)
}

export const getExerciseById: AppRouteHandlerWithAuth<
  GetExerciseById
> = async c => {
  const { id } = c.req.valid('param')
  const result = await exerciseService.getExerciseById(id)

  if (!result) {
    return c.json({ message: 'Exercise not found' }, NOT_FOUND)
  }

  return c.json(result, OK)
}

export const createExercise: AppRouteHandlerWithAuth<
  CreateExercise
> = async c => {
  const exerciseData = c.req.valid('json')
  const createdExercise = await exerciseService.createExercise(exerciseData)

  return c.json(createdExercise, OK)
}

export const updateExercise: AppRouteHandlerWithAuth<
  UpdateExercise
> = async c => {
  const { id } = c.req.valid('param')
  const exerciseData = c.req.valid('json')

  const updatedExercise = await exerciseService.updateExercise(id, exerciseData)

  if (!updatedExercise) {
    return c.json({ message: 'Exercise not found' }, NOT_FOUND)
  }

  return c.json(updatedExercise, OK)
}

export const deleteExercise: AppRouteHandlerWithAuth<
  DeleteExercise
> = async c => {
  const { id } = c.req.valid('param')
  const [deletedExercise] = await exerciseService.deleteExercise(id)

  return c.json(deletedExercise, OK)
}
