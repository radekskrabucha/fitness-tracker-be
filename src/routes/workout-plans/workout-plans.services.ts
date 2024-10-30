import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import type {
  InsertWorkoutPlan,
  PatchWorkoutPlan
} from '~/lib/dbSchema/workout-plan'
import { transformWorkoutPlanWithPlanWorkouts } from '~/utils/workoutPlan'

export const getWorkoutPlans = async () => {
  const workouts = await db.query.workoutPlans.findMany({
    with: {
      workouts: {
        with: {
          workout: true
        }
      }
    }
  })

  return workouts.map(transformWorkoutPlanWithPlanWorkouts)
}

export const getWorkoutPlanById = async (workoutPlanId: string) => {
  const workout = await db.query.workoutPlans.findFirst({
    where: eq(workoutPlans.id, workoutPlanId),
    with: {
      workouts: {
        with: {
          workout: true
        }
      }
    }
  })

  if (!workout) {
    return undefined
  }

  return transformWorkoutPlanWithPlanWorkouts(workout)
}

export const createWorkoutPlan = async ({
  workouts,
  ...workoutPlanData
}: InsertWorkoutPlan) => {
  const [workoutPlanInserted] = await db
    .insert(workoutPlans)
    .values(workoutPlanData)
    .returning()

  if (!workoutPlanInserted) {
    throw new Error('Workout plan not found')
  }

  const planWorkouts = workouts.map((workoutId, index) => ({
    workoutPlanId: workoutPlanInserted.id,
    orderIndex: index,
    workoutId
  }))

  await db.insert(workoutPlanWorkouts).values(planWorkouts).returning()

  return workoutPlanInserted
}

export const updateWorkoutPlan = (
  id: string,
  workoutPlanData: PatchWorkoutPlan
) =>
  db
    .update(workoutPlans)
    .set(workoutPlanData)
    .where(eq(workoutPlans.id, id))
    .returning()

export const deleteWorkoutPlan = (id: string) =>
  db.delete(workoutPlans).where(eq(workoutPlans.id, id)).returning()
