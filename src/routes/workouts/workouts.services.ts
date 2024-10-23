import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { workouts, type InsertWorkout } from '~/db/schema/workout.schema'

export const getUserWorkouts = (userId: string) =>
  db.query.workouts.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })

export const getUserWorkout = (userId: string, workoutId: string) =>
  db.query.workouts.findFirst({
    where: ({ userId: workoutUserId, id }) =>
      and(eq(workoutUserId, userId), eq(id, workoutId))
  })

export const createWorkout = (userId: string, workout: InsertWorkout) =>
  db
    .insert(workouts)
    .values({ ...workout, userId })
    .returning()
