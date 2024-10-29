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
