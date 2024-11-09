import type { AppRouteHandlerWithAuth } from '~/types/app'
import { CREATED, NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  GetWorkoutExercises,
  AddWorkoutExercise,
  UpdateWorkoutExercise,
  RemoveWorkoutExercise
} from './workout-exercises.routes'
import * as workoutExerciseService from './workout-exercises.services'

export const getWorkoutExercises: AppRouteHandlerWithAuth<
  GetWorkoutExercises
> = async c => {
  const { id } = c.req.valid('param')
  const exercises = await workoutExerciseService.getWorkoutExercises(id)

  if (!exercises) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(exercises, OK)
}

export const addWorkoutExercise: AppRouteHandlerWithAuth<
  AddWorkoutExercise
> = async c => {
  const { id } = c.req.valid('param')
  const exerciseData = c.req.valid('json')

  const [newExercise] = await workoutExerciseService.addWorkoutExercise(
    id,
    exerciseData
  )

  if (!newExercise) {
    return c.json({ message: 'Workout not found' }, NOT_FOUND)
  }

  return c.json(newExercise, CREATED)
}

export const updateWorkoutExercise: AppRouteHandlerWithAuth<
  UpdateWorkoutExercise
> = async c => {
  const { id, exerciseId } = c.req.valid('param')
  const exerciseData = c.req.valid('json')

  const [updatedExercise] = await workoutExerciseService.updateWorkoutExercise(
    id,
    exerciseId,
    exerciseData
  )

  if (!updatedExercise) {
    return c.json({ message: 'Workout or exercise not found' }, NOT_FOUND)
  }

  return c.json(updatedExercise, OK)
}

export const removeWorkoutExercise: AppRouteHandlerWithAuth<
  RemoveWorkoutExercise
> = async c => {
  const { id, exerciseId } = c.req.valid('param')

  const [removedExercise] = await workoutExerciseService.removeWorkoutExercise(
    id,
    exerciseId
  )

  if (!removedExercise) {
    return c.json({ message: 'Workout or exercise not found' }, NOT_FOUND)
  }

  return c.json(removedExercise, OK)
}
