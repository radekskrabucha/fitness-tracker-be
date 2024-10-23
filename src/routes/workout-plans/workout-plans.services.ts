import { eq } from 'drizzle-orm'
import { db } from '~/db'

export const getWorkoutPlans = () => db.query.workoutPlans.findMany()

export const getWorkoutPlanById = (workoutPlanId: string) =>
  db.query.workoutPlans.findFirst({
    where: ({ id }) => eq(id, workoutPlanId)
  })
