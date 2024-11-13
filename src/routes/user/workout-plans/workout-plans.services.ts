import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { user } from '~/db/schema/auth.schema'
import {
  userWorkoutPlans,
  userWorkoutExerciseAttributes
} from '~/db/schema/user-workout.schema'
import { workoutExercises } from '~/db/schema/workout.schema'
import type { InsertUserWorkoutPlanWithExtras } from '~/lib/dbSchemaNew/userWorkoutPlan'
import { transformRawWorkoutPlan } from '~/utils/new/workoutPlan'

export const getUserWorkoutPlans = async (userId: string) => {
  const retrievedWorkoutPlans = await db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId),
    columns: {},
    with: {
      plan: {
        with: {
          workouts: {
            with: {
              workout: {
                with: {
                  exercises: {
                    with: {
                      defaultAttributes: {
                        where: fields =>
                          eq(
                            fields.workoutPlanId,
                            userWorkoutPlans.workoutPlanId
                          )
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
              }
            }
          }
        }
      }
    }
  })

  return retrievedWorkoutPlans.map(({ plan }) => transformRawWorkoutPlan(plan))
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
              workout: {
                with: {
                  exercises: {
                    with: {
                      defaultAttributes: {
                        where: fields =>
                          and(
                            eq(
                              fields.workoutPlanId,
                              userWorkoutPlans.workoutPlanId
                            ),
                            eq(
                              fields.workoutExerciseId,
                              workoutExercises.exerciseId
                            )
                          )
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
              }
            }
          }
        }
      }
    }
  })

  if (!workoutPlan) {
    return undefined
  }

  return transformRawWorkoutPlan(workoutPlan.plan)
}

export const createUserWorkoutPlan = async (
  userId: string,
  { workoutPlanId, workouts }: InsertUserWorkoutPlanWithExtras
) => {
  const [insertedUSerWorkoutPlan] = await db
    .insert(userWorkoutPlans)
    .values({ workoutPlanId, userId })
    .returning()

  if (!insertedUSerWorkoutPlan) {
    throw new Error('User workout plan not found')
  }

  const attributesToInsert = workouts.flatMap(({ exercises }) => {
    return exercises.flatMap(({ id, attributes }) =>
      attributes.flatMap(attributes => ({
        ...attributes,
        workoutExerciseId: id,
        workoutPlanId: insertedUSerWorkoutPlan.id,
        userId
      }))
    )
  })

  await db.insert(userWorkoutExerciseAttributes).values(attributesToInsert)

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
