import { eq } from 'drizzle-orm'
import { db } from '~/db'

export const getUserWorkoutPlans = (userId: string) =>
  db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })
