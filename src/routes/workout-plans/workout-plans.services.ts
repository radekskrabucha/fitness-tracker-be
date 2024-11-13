import { and, eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  workoutPlans,
  workoutPlanWorkouts
} from '~/db/schema/workout-plan.schema'
import {
  defaultWorkoutExerciseAttributes,
  workoutExercises
} from '~/db/schema/workout.schema'
import type {
  InsertWorkoutPlanWithExtras,
  PatchWorkoutPlan
} from '~/lib/dbSchema/workoutPlan'
import { transformRawWorkoutPlan } from '~/utils/transforms/workoutPlan'

export const getWorkoutPlans = async () => {
  const workouts = await db.query.workoutPlans.findMany({
    with: {
      workouts: {
        with: {
          workout: {
            with: {
              exercises: {
                with: {
                  defaultAttributes: {
                    where: fields => eq(fields.workoutPlanId, workoutPlans.id)
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

  return workouts.map(transformRawWorkoutPlan)
}

export const getWorkoutPlanById = async (workoutPlanId: string) => {
  const workout = await db.query.workoutPlans.findFirst({
    where: eq(workoutPlans.id, workoutPlanId),
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
                        eq(fields.workoutPlanId, workoutPlans.id),
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

  const attributesToInsert = workouts.flatMap(({ exercises, id }) => {
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

  await db.insert(defaultWorkoutExerciseAttributes).values(attributesToInsert)

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
