import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  type InsertWorkoutPlan,
  type PatchWorkoutPlan
} from '~/db/schema/workout-plan.schema'

export const getWorkoutPlans = () => db.query.workoutPlans.findMany()

export const getWorkoutPlanById = (workoutPlanId: string) =>
  db.query.workoutPlans.findFirst({
    where: ({ id }) => eq(id, workoutPlanId)
  })

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
