import { eq } from 'drizzle-orm'
import { db } from '~/db'

export const getUserWorkouts = (userId: string) =>
  db.query.workouts.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })
