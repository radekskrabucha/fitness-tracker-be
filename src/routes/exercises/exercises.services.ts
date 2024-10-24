import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises } from '~/db/schema/exercise.schema'
import type { InsertExercise, PatchExercise } from '~/lib/dbSchema/exercise'

export const getExercises = () => db.query.exercises.findMany()

export const getExerciseById = (exerciseId: string) =>
  db.query.exercises.findFirst({
    where: ({ id }) => eq(id, exerciseId)
  })

export const createExercise = (exercise: InsertExercise) =>
  db.insert(exercises).values(exercise).returning()

export const updateExercise = (id: string, exercise: PatchExercise) =>
  db.update(exercises).set(exercise).where(eq(exercises.id, id)).returning()

export const deleteExercise = (id: string) =>
  db.delete(exercises).where(eq(exercises.id, id)).returning()
