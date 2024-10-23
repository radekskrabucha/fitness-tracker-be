import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  type InsertWorkoutPlan
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
