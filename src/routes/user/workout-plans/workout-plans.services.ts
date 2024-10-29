import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  userWorkoutPlans,
  userWorkoutExerciseAttributes
} from '~/db/schema/user-workout.schema'
import type { InsertUserWorkoutPlan } from '~/lib/dbSchema/user-workout'

export const getUserWorkoutPlans = (userId: string) =>
  db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId)
  })

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
