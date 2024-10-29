import type { AppRouteHandler } from '~/types/app'
import { OK, NOT_FOUND } from '~/utils/httpCodes'
import type {
  GetWorkoutPlans,
  GetWorkoutPlanById,
  DeleteWorkoutPlan,
  PostWorkoutPlan,
  PutWorkoutPlan
} from './workout-plans.routes'
import * as workoutService from './workout-plans.services'

export const getWorkoutPlans: AppRouteHandler<GetWorkoutPlans> = async c => {
  const workoutPlans = await workoutService.getWorkoutPlans()

  return c.json(workoutPlans, OK)
}

export const getWorkoutPlanById: AppRouteHandler<
  GetWorkoutPlanById
> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlan = await workoutService.getWorkoutPlanById(id)

  if (!workoutPlan) {
    return c.json({ message: 'Workout plan not found' }, NOT_FOUND)
  }

  return c.json(workoutPlan, OK)
}

export const postWorkoutPlan: AppRouteHandler<PostWorkoutPlan> = async c => {
  const user = c.get('user')
  const workoutPlanData = c.req.valid('json')
  const newWorkoutPlan = await workoutService.createWorkoutPlan(
    user.id,
    workoutPlanData
  )

  return c.json(newWorkoutPlan, OK)
}

export const putWorkoutPlan: AppRouteHandler<PutWorkoutPlan> = async c => {
  const { id } = c.req.valid('param')
  const workoutPlanData = c.req.valid('json')

  const [updatedWorkoutPlan] = await workoutService.updateWorkoutPlan(
    id,
    workoutPlanData
  )

  if (!updatedWorkoutPlan) {
    return c.json({ message: 'Workout plan not found' }, NOT_FOUND)
  }

  return c.json(updatedWorkoutPlan, OK)
}

export const deleteWorkoutPlan: AppRouteHandler<
  DeleteWorkoutPlan
> = async c => {
  const { id } = c.req.valid('param')

  const [deletedWorkoutPlan] = await workoutService.deleteWorkoutPlan(id)

  if (!deletedWorkoutPlan) {
    return c.json({ message: 'Workout plan not found' }, NOT_FOUND)
  }

  return c.json(deletedWorkoutPlan, OK)
}
