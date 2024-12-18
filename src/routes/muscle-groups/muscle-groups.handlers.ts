import type { AppRouteHandlerWithAuth } from '~/types/app'
import { CREATED, NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetMuscleGroups,
  GetMuscleGroup,
  CreateMuscleGroup,
  UpdateMuscleGroup,
  DeleteMuscleGroup
} from './muscle-groups.routes'
import * as muscleGroupService from './muscle-groups.services'

export const getMuscleGroups: AppRouteHandlerWithAuth<
  GetMuscleGroups
> = async c => {
  const muscleGroups = await muscleGroupService.getMuscleGroups()

  return c.json(muscleGroups, OK)
}

export const getMuscleGroup: AppRouteHandlerWithAuth<
  GetMuscleGroup
> = async c => {
  const { id } = c.req.valid('param')
  const muscleGroup = await muscleGroupService.getMuscleGroupById(id)

  if (!muscleGroup) {
    return c.json({ message: 'Muscle group not found' }, NOT_FOUND)
  }

  return c.json(muscleGroup, OK)
}

export const createMuscleGroup: AppRouteHandlerWithAuth<
  CreateMuscleGroup
> = async c => {
  const muscleGroupData = c.req.valid('json')
  const [muscleGroup] =
    await muscleGroupService.createMuscleGroup(muscleGroupData)

  return c.json(muscleGroup, CREATED)
}

export const updateMuscleGroup: AppRouteHandlerWithAuth<
  UpdateMuscleGroup
> = async c => {
  const { id } = c.req.valid('param')
  const muscleGroupData = c.req.valid('json')

  const [updatedMuscleGroup] = await muscleGroupService.updateMuscleGroup(
    id,
    muscleGroupData
  )

  if (!updatedMuscleGroup) {
    return c.json({ message: 'Muscle group not found' }, NOT_FOUND)
  }

  return c.json(updatedMuscleGroup, OK)
}

export const deleteMuscleGroup: AppRouteHandlerWithAuth<
  DeleteMuscleGroup
> = async c => {
  const { id } = c.req.valid('param')

  const [deletedMuscleGroup] = await muscleGroupService.deleteMuscleGroup(id)

  if (!deletedMuscleGroup) {
    return c.json({ message: 'Muscle group not found' }, NOT_FOUND)
  }

  return c.json(deletedMuscleGroup, OK)
}
