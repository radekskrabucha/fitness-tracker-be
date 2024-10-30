import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { user } from '~/db/schema/auth.schema'
import {
  userWorkoutPlans,
  userWorkoutExerciseAttributes
} from '~/db/schema/user-workout.schema'
import { workouts } from '~/db/schema/workout.schema'
import type { InsertUserWorkoutPlan } from '~/lib/dbSchema/user-workout'
import { transformWorkoutWithExerciseDetailsAndAttributes } from '~/utils/workout'
import { transformWorkoutPlanWithPlanWorkouts } from '~/utils/workoutPlan'

export const getUserWorkoutPlans = async (userId: string) => {
  const retrievedWorkoutPlans = await db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId),
    columns: {},
    with: {
      plan: {
        with: {
          workouts: {
            with: {
              workout: true
            }
          }
        }
      }
    }
  })

  return retrievedWorkoutPlans.map(({ plan }) =>
    transformWorkoutPlanWithPlanWorkouts(plan)
  )
}

export const getUserWorkoutPlanById = async (
  userId: string,
  workoutPlanId: string
) => {
  const workoutPlan = await db.query.userWorkoutPlans.findFirst({
    where: and(
      eq(userWorkoutPlans.userId, userId),
      eq(userWorkoutPlans.workoutPlanId, workoutPlanId)
    ),
    columns: {},
    with: {
      plan: {
        with: {
          workouts: {
            with: {
              workout: true
            }
          }
        }
      }
    }
  })

  if (!workoutPlan) {
    return undefined
  }

  return transformWorkoutPlanWithPlanWorkouts(workoutPlan.plan)
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

export const deleteWorkoutPlan = async (
  userId: string,
  workoutPlanId: string
) =>
  db
    .delete(userWorkoutPlans)
    .where(and(eq(user.id, userId), eq(userWorkoutPlans.id, workoutPlanId)))
    .returning()

export const getUserWorkoutPlanWorkoutById = async (
  userId: string,
  workoutId: string
) => {
  const workout = await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId),
    with: {
      exercises: {
        with: {
          attributes: {
            where: ({ userId: id }) => eq(id, userId)
          },
          exercise: {
            with: {
              category: true,
              muscleGroups: {
                with: {
                  muscleGroup: true
                }
              }
            }
          }
        }
      }
    }
  })

  if (!workout) {
    return undefined
  }

  return transformWorkoutWithExerciseDetailsAndAttributes(workout)
}
