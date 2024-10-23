import type { AppRouteHandler } from '~/types/app'
import { CREATED, NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetExercises,
  GetExerciseById,
  CreateExercise
} from './exercises.routes'
import * as exerciseService from './exercises.services'

export const getExercises: AppRouteHandler<GetExercises> = async c => {
  const exercises = await exerciseService.getExercises()
  return c.json(exercises, OK)
}

export const getExerciseById: AppRouteHandler<GetExerciseById> = async c => {
  const { id } = c.req.valid('param')
  const exercise = await exerciseService.getExerciseById(id)

  if (!exercise) {
    return c.json({ message: 'Exercise not found' }, NOT_FOUND)
  }

  return c.json(exercise, OK)
}

export const createExercise: AppRouteHandler<CreateExercise> = async c => {
  const exerciseData = c.req.valid('json')
  const [createdExercise] = await exerciseService.createExercise(exerciseData)

  return c.json(createdExercise, CREATED)
}
