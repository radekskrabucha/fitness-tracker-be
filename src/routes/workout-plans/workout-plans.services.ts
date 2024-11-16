import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import {
  defaultWorkoutAttributes,
  defaultWorkoutExerciseAttributes,
  workoutExercises,
  workouts
} from '~/db/schema/workout.schema'
import type {
  InsertWorkoutPlanWithExtras,
  PatchWorkoutPlan
} from '~/lib/dbSchema/workoutPlan'
import { transformRawWorkoutPlan } from '~/utils/transforms/workoutPlan'

export const getWorkoutPlans = async () => {
  const retrievedWorkouts = await db.query.workoutPlans.findMany({
    with: {
      workouts: {
        with: {
          workout: {
            with: {
              defaultAttributes: {
                where: fields =>
                  and(
                    eq(fields.workoutPlanId, workoutPlans.id),
                    eq(fields.workoutId, workouts.id)
                  )
              },
              exercises: {
                with: {
                  defaultAttributes: {
                    where: fields =>
                      and(
                        eq(fields.workoutPlanId, workoutPlans.id),
                        eq(fields.workoutExerciseId, workoutExercises.id)
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
  })

  return retrievedWorkouts.map(transformRawWorkoutPlan)
}

export const getWorkoutPlanById = async (workoutPlanId: string) => {
  const workout = await db.query.workoutPlans.findFirst({
    where: eq(workoutPlans.id, workoutPlanId),
    with: {
      workouts: {
        with: {
          workout: {
            with: {
              defaultAttributes: {
                where: fields =>
                  and(
                    eq(fields.workoutPlanId, workoutPlans.id),
                    eq(fields.workoutId, workouts.id)
                  )
              },
              exercises: {
                with: {
                  defaultAttributes: {
                    where: fields =>
                      and(
                        eq(fields.workoutPlanId, workoutPlans.id),
                        eq(fields.workoutExerciseId, workoutExercises.id)
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
  })

  if (!workout) {
    return undefined
  }

  return transformRawWorkoutPlan(workout)
}

export const createWorkoutPlan = async ({
  workouts,
  ...workoutPlanData
}: InsertWorkoutPlanWithExtras) => {
  const [workoutPlanInserted] = await db
    .insert(workoutPlans)
    .values(workoutPlanData)
    .returning()

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
    return attributes.flatMap(({ attributeName, value }) => {
      if (
        attributeName === 'days_of_week' ||
        attributeName === 'intensity_level'
      ) {
        return {
          ...base,
          attributeName,
          textValue: value as string
        }
      }
      if (
        attributeName === 'duration_goal' ||
        attributeName === 'rest_period_between_sets'
      ) {
        return {
          ...base,
          attributeName,
          integerValue: value as number
        }
      }
      if (
        attributeName === 'warmup_required' ||
        attributeName === 'cooldown_required'
      ) {
        return {
          ...base,
          attributeName,
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
    .returning()

export const deleteWorkoutPlan = (id: string) =>
  db.delete(workoutPlans).where(eq(workoutPlans.id, id)).returning()
