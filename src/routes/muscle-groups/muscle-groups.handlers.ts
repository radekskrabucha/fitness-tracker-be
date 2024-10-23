import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type { GetMuscleGroups, GetMuscleGroup } from './muscle-groups.routes'
import * as muscleGroupService from './muscle-groups.services'

export const getMuscleGroups: AppRouteHandler<GetMuscleGroups> = async c => {
  const muscleGroups = await muscleGroupService.getMuscleGroups()

  return c.json(muscleGroups, OK)
}

export const getMuscleGroup: AppRouteHandler<GetMuscleGroup> = async c => {
  const { id } = c.req.valid('param')
  const muscleGroup = await muscleGroupService.getMuscleGroupById(id)

  if (!muscleGroup) {
    return c.json({ message: 'Muscle group not found' }, NOT_FOUND)
  }

  return c.json(muscleGroup, OK)
}
