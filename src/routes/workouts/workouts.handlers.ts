import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type { ListWorkouts, GetWorkout, CreateWorkout } from './workouts.routes'
import * as workoutService from './workouts.services'

export const listWorkouts: AppRouteHandler<ListWorkouts> = async c => {
  const { id } = c.get('user')

  const userWorkouts = await workoutService.getUserWorkouts(id)

  return c.json(userWorkouts, OK)
}

export const getWorkout: AppRouteHandler<GetWorkout> = async c => {
  const user = c.get('user')
  const { id } = c.req.valid('param')

  const workout = await workoutService.getUserWorkout(user.id, id)

  if (!workout) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(workout, OK)
}

export const createWorkout: AppRouteHandler<CreateWorkout> = async c => {
  const user = c.get('user')
  const workoutData = c.req.valid('json')

  const [workout] = await workoutService.createWorkout(user.id, workoutData)

  return c.json(workout, OK)
}
