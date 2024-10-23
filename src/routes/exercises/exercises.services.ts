import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  exercises,
  type InsertExercise,
  type PatchExercise
} from '~/db/schema/exercise.schema'

export const getExercises = () => db.query.exercises.findMany()

export const getExerciseById = (exerciseId: string) =>
  db.query.exercises.findFirst({
    where: ({ id }) => eq(id, exerciseId)
  })

export const createExercise = (exercise: InsertExercise) =>
  db.insert(exercises).values(exercise).returning()

export const updateExercise = (id: string, exercise: PatchExercise) =>
  db.update(exercises).set(exercise).where(eq(exercises.id, id)).returning()
