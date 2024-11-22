import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import { user } from '~/db/schema/auth.schema'
import {
  userWorkoutPlans,
  userWorkoutExerciseAttributes,
  userWorkoutAttributes
} from '~/db/schema/user-workout.schema'
import { workoutPlans } from '~/db/schema/workout-plan.schema'
import { workoutExercises, workouts } from '~/db/schema/workout.schema'
import type { InsertUserWorkoutPlanWithExtras } from '~/lib/dbSchema/userWorkoutPlan'
import { transformRawUserWorkoutPlan, transformRawUserWorkoutPlanWithDetails } from '~/utils/transforms/workoutPlan'

export const getUserWorkoutPlans = async (userId: string) => {
  const retrievedWorkoutPlans = await db.query.userWorkoutPlans.findMany({
    where: ({ userId: id }) => eq(id, userId),
    columns: {},
    with: {
      plan: {
        columns: {
          createdAt: false,
          updatedAt: false
        },
        with: {
          workouts: {
            columns: {
              orderIndex: true
            },
            with: {
              workout: {
                columns: {
                  createdAt: false,
                  updatedAt: false
                }
              }
            }
          }
        }
      }
    }
  })

  return retrievedWorkoutPlans.map(({ plan }) =>
    transformRawUserWorkoutPlan(plan)
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
        columns: {
          createdAt: false,
          updatedAt: false
        },
        with: {
          workouts: {
            columns: {
              orderIndex: true
            },
            with: {
              workout: {
                columns: {
                  createdAt: false,
                  updatedAt: false
                },
                with: {
                  attributes: {
                    columns: {
                      workoutId: false,
                      workoutPlanId: false,
                      createdAt: false,
                      updatedAt: false,
                      userId: false
                    },
                    where: fields =>
                      and(
                        eq(fields.userId, userId),
                        eq(fields.workoutPlanId, workoutPlans.id),
                        eq(fields.workoutId, workouts.id)
                      )
                  },
                  exercises: {
                    columns: {
                      id: true,
                      orderIndex: true
                    },
                    with: {
                      attributes: {
                        columns: {
                          id: true,
                          name: true,
                          value: true
                        },
                        where: fields =>
                          and(
                            eq(fields.userId, userId),
                            eq(fields.workoutPlanId, workoutPlans.id),
                            eq(fields.workoutExerciseId, workoutExercises.id)
                          )
                      },
                      exercise: {
                        columns: {
                          createdAt: false,
                          updatedAt: false,
                          categoryId: false
                        },
                        with: {
                          category: true,
                          muscleGroups: {
                            columns: {},
                            with: {
                              muscleGroup: {
                                columns: {
                                  createdAt: false,
                                  updatedAt: false
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
      }
    }
  })

  if (!workoutPlan) {
    return undefined
  }

  return transformRawUserWorkoutPlanWithDetails(workoutPlan.plan)
}

export const createUserWorkoutPlan = async (
  userId: string,
  { workoutPlanId, workouts }: InsertUserWorkoutPlanWithExtras
) => {
  const [insertedUserWorkoutPlan] = await db
    .insert(userWorkoutPlans)
    .values({ workoutPlanId, userId })
    .returning({
      id: userWorkoutPlans.id,
      workoutPlanId: userWorkoutPlans.workoutPlanId
    })

  if (!insertedUserWorkoutPlan) {
    throw new Error('User workout plan not found')
  }

  const workoutAttributesToInsert = workouts.flatMap(({ id, attributes }) => {
    const base = {
      workoutPlanId,
      workoutId: id,
      userId
    }

    return attributes.flatMap(({ name, value }) => {
      if (name === 'days_of_week' || name === 'intensity_level') {
        return {
          ...base,
          name,
          textValue: value as string
        }
      }
      if (name === 'duration_goal' || name === 'rest_period_between_sets') {
        return {
          ...base,
          name,
          integerValue: value as number
        }
      }
      if (name === 'warmup_required' || name === 'cooldown_required') {
        return {
          ...base,
          name,
          booleanValue: value as boolean
        }
      }

      return []
    })
  })

  await db.insert(userWorkoutAttributes).values(workoutAttributesToInsert)

  const attributesToInsert = workouts.flatMap(({ exercises }) => {
    return exercises.flatMap(({ id, attributes }) =>
      attributes.flatMap(attributes => ({
        ...attributes,
        workoutExerciseId: id,
        workoutPlanId,
        userId
      }))
    )
  })

  await db.insert(userWorkoutExerciseAttributes).values(attributesToInsert)

  return insertedUserWorkoutPlan
}

export const deleteWorkoutPlan = async (
  userId: string,
  workoutPlanId: string
) =>
  db
    .delete(userWorkoutPlans)
    .where(and(eq(user.id, userId), eq(userWorkoutPlans.id, workoutPlanId)))
    .returning({
      id: userWorkoutPlans.id,
      workoutPlanId: userWorkoutPlans.workoutPlanId
    })
