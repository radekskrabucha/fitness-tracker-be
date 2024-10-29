import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  CreateUserWorkoutPlan,
  GetUserWorkoutPlanById,
  GetUserWorkoutPlans,
  DeleteUserWorkoutPlan
} from './workout-plans.routes'
import * as userWorkoutPlanService from './workout-plans.services'

export const getUserWorkoutPlans: AppRouteHandler<
  GetUserWorkoutPlans
> = async c => {
  const user = c.get('user')
  const userWorkoutPlans = await userWorkoutPlanService.getUserWorkoutPlans(
    user.id
  )

  return c.json(userWorkoutPlans, OK)
}

export const getUserWorkoutPlanById: AppRouteHandler<
  GetUserWorkoutPlanById
> = async c => {
  const { id } = c.req.valid('param')
  const user = c.get('user')

  const userWorkoutPlan = await userWorkoutPlanService.getUserWorkoutPlanById(
    user.id,
    id
  )

  if (!userWorkoutPlan) {
    return c.json({ message: 'User workout plan not found' }, NOT_FOUND)
  }

  return c.json(userWorkoutPlan, OK)
}

export const createUserWorkoutPlan: AppRouteHandler<
  CreateUserWorkoutPlan
> = async c => {
  const user = c.get('user')
  const workoutPlanData = c.req.valid('json')

  const workoutPlan = await userWorkoutPlanService.createUserWorkoutPlan(
    user.id,
    workoutPlanData
  )

  return c.json(workoutPlan, OK)
}

export const deleteUserWorkoutPlan: AppRouteHandler<
  DeleteUserWorkoutPlan
> = async c => {
  const { id } = c.req.valid('param')

  const [deletedUserWorkoutPlan] =
    await userWorkoutPlanService.deleteWorkoutPlan(id)

  if (!deletedUserWorkoutPlan) {
    return c.json({ message: 'User workout plan not found' }, NOT_FOUND)
  }

  return c.json(deletedUserWorkoutPlan, OK)
}
