import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetExercises } from './exercises.routes'
import * as exerciseService from './exercises.services'

export const getExercises: AppRouteHandler<GetExercises> = async c => {
  const exercises = await exerciseService.getExercises()

  return c.json(exercises, OK)
}
