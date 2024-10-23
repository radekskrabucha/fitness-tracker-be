import { and, eq } from 'drizzle-orm'
import { db } from '~/db'

export const getUserWorkouts = (userId: string) =>
  db.query.workouts.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })

export const getUserWorkout = (userId: string, workoutId: string) =>
  db.query.workouts.findFirst({
    where: ({ userId: workoutUserId, id }) =>
      and(eq(workoutUserId, userId), eq(id, workoutId))
  })
