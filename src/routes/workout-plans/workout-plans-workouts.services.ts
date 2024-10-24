import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { workoutPlanWorkouts } from '~/db/schema/workout-plan.schema'
import type { InsertWorkoutPlanWorkout } from '~/db/schema/workout-plan.schema'

export const getWorkoutPlanWorkouts = (id: string) =>
  db.query.workoutPlanWorkouts.findMany({
    where: ({ workoutPlanId }) => eq(workoutPlanId, id)
  })

export const createWorkoutPlanWorkout = (
  workoutPlanId: string,
  workoutPlanWorkout: InsertWorkoutPlanWorkout
) =>
  db
    .insert(workoutPlanWorkouts)
    .values({ ...workoutPlanWorkout, workoutPlanId })
    .returning()
