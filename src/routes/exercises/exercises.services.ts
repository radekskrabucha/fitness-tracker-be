import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises, type InsertExercise } from '~/db/schema/exercise.schema'

export const getExercises = () => db.query.exercises.findMany()

export const getExerciseById = (exerciseId: string) =>
  db.query.exercises.findFirst({
    where: ({ id }) => eq(id, exerciseId)
  })

export const createExercise = (exercise: InsertExercise) =>
  db.insert(exercises).values(exercise).returning()
