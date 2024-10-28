import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { workouts } from '~/db/schema/workout.schema'
import type { InsertWorkout, PatchWorkout } from '~/lib/dbSchema/workout'

export const getWorkouts = () => db.query.workouts.findMany()

export const getWorkout = (workoutId: string) =>
  db.query.workouts.findFirst({
    where: ({ id }) => eq(id, workoutId)
  })

export const createWorkout = (workout: InsertWorkout) =>
  db.insert(workouts).values(workout).returning()

export const updateWorkout = (workoutId: string, workout: PatchWorkout) =>
  db.update(workouts).set(workout).where(eq(workouts.id, workoutId)).returning()

export const deleteWorkout = (workoutId: string) =>
  db.delete(workouts).where(eq(workouts.id, workoutId)).returning()
