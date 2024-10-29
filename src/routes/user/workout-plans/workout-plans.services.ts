import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  userWorkoutPlans,
  userWorkoutExerciseAttributes
} from '~/db/schema/user-workout.schema'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import { workouts } from '~/db/schema/workout.schema'
import type {
  InsertUserWorkoutPlan,
  SelectUserWorkoutPlanWithDetails
} from '~/lib/dbSchema/user-workout'

export const getUserWorkoutPlans = (userId: string) =>
  db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })

export const getUserWorkoutPlanById = async (
  userId: string,
  workoutPlanId: string
): Promise<SelectUserWorkoutPlanWithDetails | undefined> => {
  const result = await db
    .select({
      userWorkoutPlan: userWorkoutPlans,
      workoutPlan: workoutPlans,
      workoutPlanWorkout: workoutPlanWorkouts,
      workout: workouts
    })
    .from(userWorkoutPlans)
    .leftJoin(workoutPlans, eq(userWorkoutPlans.workoutPlanId, workoutPlans.id))
    .leftJoin(
      workoutPlanWorkouts,
      eq(userWorkoutPlans.workoutPlanId, workoutPlanWorkouts.workoutPlanId)
    )
    .leftJoin(workouts, eq(workoutPlanWorkouts.workoutId, workouts.id))
    .where(
      and(
        eq(userWorkoutPlans.userId, userId),
        eq(userWorkoutPlans.id, workoutPlanId)
      )
    )

  const userWorkoutPlan = result[0]?.userWorkoutPlan
  const workoutPlan = result[0]?.workoutPlan

  if (!userWorkoutPlan || !workoutPlan) {
    return undefined
  }

  const workoutsFiltered = result.flatMap(({ workout }) => {
    if (!workout) {
      return []
    }

    return workout
  })

  return {
    ...userWorkoutPlan,
    details: workoutPlan,
    workouts: workoutsFiltered
  }
}

export const createUserWorkoutPlan = async (
  userId: string,
  { exerciseAttributes, ...workoutPlan }: InsertUserWorkoutPlan
) => {
  const [insertedUSerWorkoutPlan] = await db
    .insert(userWorkoutPlans)
    .values({ ...workoutPlan, userId })
    .returning()

  if (!insertedUSerWorkoutPlan) {
    throw new Error('User workout plan not found')
  }

  const exerciseAttributesIds = exerciseAttributes.map(item => ({
    ...item,
    userId
  }))

  await db.insert(userWorkoutExerciseAttributes).values(exerciseAttributesIds)

  return insertedUSerWorkoutPlan
}

export const deleteWorkoutPlan = async (workoutPlanId: string) =>
  db
    .delete(userWorkoutPlans)
    .where(eq(userWorkoutPlans.id, workoutPlanId))
    .returning()
