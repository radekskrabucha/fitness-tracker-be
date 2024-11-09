import type { AppRouteHandlerWithAuth } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  ListWorkouts,
  GetWorkout,
  CreateWorkout,
  UpdateWorkout,
  DeleteWorkout
} from './workouts.routes'
import * as workoutService from './workouts.services'

export const listWorkouts: AppRouteHandlerWithAuth<ListWorkouts> = async c => {
  const userWorkouts = await workoutService.getWorkouts()

  return c.json(userWorkouts, OK)
}

export const getWorkout: AppRouteHandlerWithAuth<GetWorkout> = async c => {
  const { id } = c.req.valid('param')

  const workout = await workoutService.getWorkout(id)

  if (!workout) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(workout, OK)
}

export const createWorkout: AppRouteHandlerWithAuth<
  CreateWorkout
> = async c => {
  const workoutData = c.req.valid('json')

  const workout = await workoutService.createWorkout(workoutData)

  return c.json(workout, OK)
}

export const updateWorkout: AppRouteHandlerWithAuth<
  UpdateWorkout
> = async c => {
  const { id } = c.req.valid('param')
  const workoutData = c.req.valid('json')

  const [updatedWorkout] = await workoutService.updateWorkout(id, workoutData)

  if (!updatedWorkout) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(updatedWorkout, OK)
}

export const deleteWorkout: AppRouteHandlerWithAuth<
  DeleteWorkout
> = async c => {
  const { id } = c.req.valid('param')

  const [deletedWorkout] = await workoutService.deleteWorkout(id)

  if (!deletedWorkout) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(deletedWorkout, OK)
}
