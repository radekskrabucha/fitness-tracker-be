import { eq } from 'drizzle-orm'
import { db } from '~/db'

export const getWorkoutPlanWorkouts = (id: string) =>
  db.query.workoutPlanWorkouts.findMany({
    where: ({ workoutPlanId }) => eq(workoutPlanId, id)
  })
