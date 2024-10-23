import type { AppRouteHandler } from '~/types/app'
import { OK } from '~/utils/httpCodes'
import type { GetMuscleGroups } from './muscle-groups.routes'
import * as muscleGroupService from './muscle-groups.services'

export const getMuscleGroups: AppRouteHandler<GetMuscleGroups> = async c => {
  const muscleGroups = await muscleGroupService.getMuscleGroups()

  return c.json(muscleGroups, OK)
}
