import { db } from '~/db'
import {
  userWorkoutSessions,
  userWorkoutSessionExercises,
  userWorkoutSessionExerciseAttributes
} from '~/db/schema/workout-session.schema'
import type { InsertUserWorkoutSessionWithExtras } from '~/lib/dbSchema/workoutSession'

export const postUserWorkoutSession = async (
  userId: string,
  { exercises, ...rest }: InsertUserWorkoutSessionWithExtras
) => {
  const [insertedWorkoutSession] = await db
    .insert(userWorkoutSessions)
    .values({ ...rest, userId })
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
