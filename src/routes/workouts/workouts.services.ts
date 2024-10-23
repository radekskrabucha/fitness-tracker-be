import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workouts,
  type InsertWorkout,
  type PatchWorkout
} from '~/db/schema/workout.schema'

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
    // @ts-expect-error date is coerced to string in the schema
    .values({ ...workout, userId })
    .returning()

export const updateWorkout = (
  userId: string,
  workoutId: string,
  workout: PatchWorkout
) =>
  db
    .update(workouts)
    // @ts-expect-error date is coerced to string in the schema
    .set(workout)
    .where(and(eq(workouts.userId, userId), eq(workouts.id, workoutId)))
    .returning()

export const deleteWorkout = (userId: string, workoutId: string) =>
  db
    .delete(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.id, workoutId)))
    .returning()
