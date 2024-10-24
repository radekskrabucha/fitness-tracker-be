import { eq, and } from 'drizzle-orm'
import { db } from '~/db'
import { workoutPlanWorkouts } from '~/db/schema/workout-plan.schema'
import type {
  InsertWorkoutPlanWorkout,
  PatchWorkoutPlanWorkout
} from '~/db/schema/workout-plan.schema'

export const getWorkoutPlanWorkouts = (id: string) =>
  db.query.workoutPlanWorkouts.findMany({
    where: ({ workoutPlanId }) => eq(workoutPlanId, id)
  })

export const createWorkoutPlanWorkout = (
  workoutPlanId: string,
  workoutPlanWorkout: InsertWorkoutPlanWorkout
) =>
  db
    .insert(workoutPlanWorkouts)
    .values({ ...workoutPlanWorkout, workoutPlanId })
    .returning()

export const updateWorkoutPlanWorkout = (
  workoutPlanId: string,
  workoutPlanWorkoutId: string,
  workoutPlanWorkout: PatchWorkoutPlanWorkout
) =>
  db
    .update(workoutPlanWorkouts)
    .set(workoutPlanWorkout)
    .where(
      and(
        eq(workoutPlanWorkouts.workoutPlanId, workoutPlanId),
        eq(workoutPlanWorkouts.workoutId, workoutPlanWorkoutId)
      )
    )
    .returning()

export const deleteWorkoutPlanWorkout = (
  workoutPlanId: string,
  workoutPlanWorkoutId: string
) =>
  db
    .delete(workoutPlanWorkouts)
    .where(
      and(
        eq(workoutPlanWorkouts.workoutPlanId, workoutPlanId),
        eq(workoutPlanWorkouts.workoutId, workoutPlanWorkoutId)
      )
    )
    .returning()
