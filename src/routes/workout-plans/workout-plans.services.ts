import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import { workouts } from '~/db/schema/workout.schema'
import type {
  InsertWorkoutPlan,
  PatchWorkoutPlan,
  SelectWorkoutPlanWithWorkouts
} from '~/lib/dbSchema/workout-plan'

export const getWorkoutPlans = () => db.query.workoutPlans.findMany()

export const getWorkoutPlanById = async (
  workoutPlanId: string
): Promise<SelectWorkoutPlanWithWorkouts | undefined> => {
  const result = await db
    .select({
      workoutPlan: workoutPlans,
      workouts: workouts
    })
    .from(workoutPlanWorkouts)
    .leftJoin(
      workoutPlans,
      eq(workoutPlanWorkouts.workoutPlanId, workoutPlans.id)
    )
    .leftJoin(workouts, eq(workoutPlanWorkouts.workoutId, workouts.id))
    .where(eq(workoutPlans.id, workoutPlanId))

  const workoutPlan = result[0]?.workoutPlan

  if (!workoutPlan) {
    return undefined
  }

  const filteredWorkouts = result.flatMap(({ workouts }) => {
    if (!workouts) {
      return []
    }

    return workouts
  })

  return {
    ...workoutPlan,
    workouts: filteredWorkouts
  }
}

export const createWorkoutPlan = (
  userId: string,
  workoutPlanData: InsertWorkoutPlan
) =>
  db
    .insert(workoutPlans)
    .values({ ...workoutPlanData, userId })
    .returning()

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
