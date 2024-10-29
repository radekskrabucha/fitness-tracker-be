import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exerciseCategories } from '~/db/schema/exercise.schema'
import type {
  InsertExerciseCategory,
  PatchExerciseCategory
} from '~/lib/dbSchema/exercise'

export const getExerciseCategories = () =>
  db.query.exerciseCategories.findMany()

export const getExerciseCategoryById = (exerciseCategoryId: string) =>
  db.query.exerciseCategories.findFirst({
    where: ({ id }) => eq(id, exerciseCategoryId)
  })

export const createExerciseCategory = async (
  category: InsertExerciseCategory
) => {
  const [exerciseCategory] = await db
    .insert(exerciseCategories)
    .values(category)
    .returning()

  return exerciseCategory
}

export const updateExerciseCategory = (
  id: string,
  category: PatchExerciseCategory
) =>
  db
    .update(exerciseCategories)
    .set(category)
    .where(eq(exerciseCategories.id, id))
    .returning()

export const deleteExerciseCategory = (id: string) =>
  db.delete(exerciseCategories).where(eq(exerciseCategories.id, id)).returning()
