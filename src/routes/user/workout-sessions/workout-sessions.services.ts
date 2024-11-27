import { and, desc, eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  userWorkoutSessions,
  userWorkoutSessionExercises,
  userWorkoutSessionExerciseAttributes
} from '~/db/schema/workout-session.schema'
import type { InsertUserWorkoutSessionWithExtras } from '~/lib/dbSchema/workoutSession'
import { transformRawWorkoutSession } from '~/utils/transforms/workoutSession'

export const getUserWorkoutSessions = async (userId: string) => {
  const workoutSessions = await db.query.userWorkoutSessions.findMany({
    where: fields => eq(fields.userId, userId),
    columns: {
      id: true,
      notes: true,
      date: true,
      duration: true
    },
    with: {
      workout: {
        columns: {
          id: true,
          name: true,
          description: true
        }
      },
      workoutPlan: {
        columns: {
          id: true,
          name: true,
          description: true,
          difficultyLevel: true
        }
      },
      exercises: {
        where: fields => eq(fields.userId, userId),
        columns: {
          id: true,
          notes: true,
          completed: true,
          orderIndex: true
        },
        with: {
          attributes: {
            where: fields => eq(fields.userId, userId),
            columns: {
              id: true,
              name: true,
              value: true
            }
          }
        }
      }
    }
  })

  return workoutSessions.map(transformRawWorkoutSession)
}

export const getUserWorkoutSessionById = async (userId: string, id: string) => {
  const workoutSession = await db.query.userWorkoutSessions.findFirst({
    where: fields => and(eq(fields.userId, userId), eq(fields.id, id)),
    columns: {
      id: true,
      notes: true,
      date: true,
      duration: true
    },
    with: {
      workout: {
        columns: {
          id: true,
          name: true,
          description: true
        }
      },
      workoutPlan: {
        columns: {
          id: true,
          name: true,
          description: true,
          difficultyLevel: true
        }
      },
      exercises: {
        where: fields => eq(fields.userId, userId),
        columns: {
          id: true,
          notes: true,
          completed: true,
          orderIndex: true
        },
        with: {
          attributes: {
            where: fields => eq(fields.userId, userId),
            columns: {
              id: true,
              name: true,
              value: true
            }
          }
        }
      }
    }
  })

  if (!workoutSession) {
    return undefined
  }

  return transformRawWorkoutSession(workoutSession)
}

export const getUserLatestWorkoutSession = async (userId: string) => {
  const workoutSession = await db.query.userWorkoutSessions.findFirst({
    where: fields => eq(fields.userId, userId),
    orderBy: fields => [desc(fields.date), desc(fields.createdAt)],
    columns: {
      id: true,
      notes: true,
      date: true,
      duration: true
    },
    with: {
      workout: {
        columns: {
          id: true,
          name: true,
          description: true
        }
      },
      workoutPlan: {
        columns: {
          id: true,
          name: true,
          description: true,
          difficultyLevel: true
        }
      },
      exercises: {
        where: fields => eq(fields.userId, userId),
        columns: {
          id: true,
          notes: true,
          completed: true,
          orderIndex: true
        },
        with: {
          attributes: {
            where: fields => eq(fields.userId, userId),
            columns: {
              id: true,
              name: true,
              value: true
            }
          }
        }
      }
    }
  })

  if (!workoutSession) {
    return undefined
  }

  return transformRawWorkoutSession(workoutSession)
}

export const postUserWorkoutSession = async (
  userId: string,
  { exercises, date, ...rest }: InsertUserWorkoutSessionWithExtras
) => {
  const [insertedWorkoutSession] = await db
    .insert(userWorkoutSessions)
    .values({ ...rest, userId, date: new Date(date).toISOString() })
    .returning({
      id: userWorkoutSessions.id,
      date: userWorkoutSessions.date,
      notes: userWorkoutSessions.notes,
      duration: userWorkoutSessions.duration
    })

  if (!insertedWorkoutSession) {
    throw new Error('Workout session not found')
  }

  const preparedWorkoutSessionExercises = exercises.flatMap(
    ({ exerciseId, completed, notes }, orderIndex) => ({
      exerciseId,
      completed,
      notes,
      orderIndex,
      userId,
      sessionId: insertedWorkoutSession.id
    })
  )

  const insertedWorkoutSessionExercises = await db
    .insert(userWorkoutSessionExercises)
    .values(preparedWorkoutSessionExercises)
    .returning()

  const preparedWorkoutSessionExerciseAttributes = exercises.flatMap(
    ({ attributes, exerciseId }) => {
      const sessionExercise = insertedWorkoutSessionExercises.find(
        exercise => exercise.exerciseId === exerciseId
      )

      if (!sessionExercise) {
        return []
      }

      return attributes.flatMap(({ name, value }) => ({
        userId,
        sessionExerciseId: sessionExercise.id,
        name,
        value
      }))
    }
  )

  await db
    .insert(userWorkoutSessionExerciseAttributes)
    .values(preparedWorkoutSessionExerciseAttributes)
    .returning()

  return insertedWorkoutSession
}
