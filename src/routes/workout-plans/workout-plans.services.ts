import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import {
  defaultWorkoutAttributes,
  defaultWorkoutExerciseAttributes
} from '~/db/schema/workout.schema'
import type {
  InsertWorkoutPlanWithExtras,
  PatchWorkoutPlan
} from '~/lib/dbSchema/workoutPlan'
import {
  transformRawWorkoutPlan,
  transformRawWorkoutPlanWithDetails
} from '~/utils/transforms/workoutPlan'

export const getWorkoutPlans = async () => {
  const retrievedWorkouts = await db.query.workoutPlans.findMany({
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
  })

  return retrievedWorkouts.map(transformRawWorkoutPlan)
}

export const getWorkoutPlanById = async (workoutPlanId: string) => {
  const workout = await db.query.workoutPlans.findFirst({
    where: eq(workoutPlans.id, workoutPlanId),
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
              defaultAttributes: {
                columns: {
                  workoutId: false,
                  workoutPlanId: false,
                  createdAt: false,
                  updatedAt: false
                },
                where: fields => eq(fields.workoutPlanId, workoutPlanId)
              },
              exercises: {
                columns: {
                  id: true,
                  orderIndex: true
                },
                with: {
                  defaultAttributes: {
                    columns: {
                      id: true,
                      name: true,
                      value: true
                    },
                    where: fields => eq(fields.workoutPlanId, workoutPlanId)
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
  })

  if (!workout) {
    return undefined
  }

  return transformRawWorkoutPlanWithDetails(workout)
}

export const createWorkoutPlan = async ({
  workouts,
  ...workoutPlanData
}: InsertWorkoutPlanWithExtras) => {
  const [workoutPlanInserted] = await db
    .insert(workoutPlans)
    .values(workoutPlanData)
    .returning({
      id: workoutPlans.id,
      name: workoutPlans.name,
      description: workoutPlans.description,
      difficultyLevel: workoutPlans.difficultyLevel
    })

  if (!workoutPlanInserted) {
    throw new Error('Workout plan not found')
  }

  const planWorkouts = workouts.map(({ id }, index) => ({
    workoutPlanId: workoutPlanInserted.id,
    orderIndex: index,
    workoutId: id
  }))

  const insertedWorkouts = await db
    .insert(workoutPlanWorkouts)
    .values(planWorkouts)
    .returning()
  const workoutAttributesToInsert = workouts.flatMap(({ id, attributes }) => {
    const workoutPlan = insertedWorkouts.find(
      ({ workoutId }) => workoutId === id
    )

    if (!workoutPlan) {
      return []
    }

    const base = {
      workoutPlanId: workoutPlan.workoutPlanId,
      workoutId: workoutPlan.workoutId
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

  await db.insert(defaultWorkoutAttributes).values(workoutAttributesToInsert)

  const exerciseAttributesToInsert = workouts.flatMap(({ exercises, id }) => {
    const workoutPlan = insertedWorkouts.find(
      ({ workoutId }) => workoutId === id
    )

    if (!workoutPlan) {
      return []
    }

    return exercises.flatMap(({ id, attributes }) =>
      attributes.flatMap(attribute => ({
        ...attribute,
        workoutPlanId: workoutPlanInserted.id,
        workoutExerciseId: id
      }))
    )
  })

  await db
    .insert(defaultWorkoutExerciseAttributes)
    .values(exerciseAttributesToInsert)

  return workoutPlanInserted
}

export const updateWorkoutPlan = (
  id: string,
  workoutPlanData: PatchWorkoutPlan
) =>
  db
    .update(workoutPlans)
    .set(workoutPlanData)
    .where(eq(workoutPlans.id, id))
    .returning({
      id: workoutPlans.id,
      name: workoutPlans.name,
      description: workoutPlans.description,
      difficultyLevel: workoutPlans.difficultyLevel
    })

export const deleteWorkoutPlan = (id: string) =>
  db.delete(workoutPlans).where(eq(workoutPlans.id, id)).returning({
    id: workoutPlans.id,
    name: workoutPlans.name,
    description: workoutPlans.description,
    difficultyLevel: workoutPlans.difficultyLevel
  })
