import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type { GetExercises, GetExerciseById } from './exercises.routes'
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
