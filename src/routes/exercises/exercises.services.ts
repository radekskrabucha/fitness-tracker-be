import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  exercises,
  exerciseMuscleGroups,
  muscleGroups,
  exerciseCategories
} from '~/db/schema/exercise.schema'
import type {
  InsertExercise,
  PatchExercise,
  SelectExerciseWithDetails
} from '~/lib/dbSchema/exercise'

export const getExercises = async () => {
  const result = await db
    .select({
      exercise: exercises,
      category: exerciseCategories
    })
    .from(exercises)
    .leftJoin(
      exerciseCategories,
      eq(exercises.categoryId, exerciseCategories.id)
    )
  const filteredExercises = result.flatMap(({ exercise, category }) => {
    if (!category) {
      return []
    }

    return {
      ...exercise,
      category
    }
  })

  return filteredExercises
}

export const getExerciseById = async (
  exerciseId: string
): Promise<SelectExerciseWithDetails | undefined> => {
  const result = await db
    .select({
      exercise: exercises,
      muscleGroups,
      category: exerciseCategories
    })
    .from(exerciseMuscleGroups)
    .leftJoin(exercises, eq(exerciseMuscleGroups.exerciseId, exercises.id))
    .leftJoin(
      muscleGroups,
      eq(exerciseMuscleGroups.muscleGroupId, muscleGroups.id)
    )
    .leftJoin(
      exerciseCategories,
      eq(exercises.categoryId, exerciseCategories.id)
    )
    .where(eq(exercises.id, exerciseId))

  const exercise = result[0]?.exercise
  const category = result[0]?.category

  if (!exercise || !category) {
    return undefined
  }

  const muscles = result.flatMap(({ muscleGroups }) => {
    if (!muscleGroups) {
      return []
    }

    return muscleGroups
  })

  return {
    ...exercise,
    muscleGroups: muscles,
    category
  }
}

export const createExercise = async ({
  muscleGroupIds,
  ...exerciseData
}: InsertExercise) => {
  const [exercise] = await db.insert(exercises).values(exerciseData).returning()

  if (!exercise) {
    throw new Error('Exercise not found')
  }

  const muscleGroupAssociations = muscleGroupIds.map(muscleGroupId => ({
    exerciseId: exercise.id,
    muscleGroupId
  }))

  await db.insert(exerciseMuscleGroups).values(muscleGroupAssociations)

  return exercise
}

export const updateExercise = async (
  id: string,
  { muscleGroupIds, ...exerciseData }: PatchExercise
) => {
  const [updatedExercise] = await db
    .update(exercises)
    .set(exerciseData)
    .where(eq(exercises.id, id))
    .returning()

  if (muscleGroupIds) {
    await db
      .delete(exerciseMuscleGroups)
      .where(eq(exerciseMuscleGroups.exerciseId, id))
    const muscleGroupAssociations = muscleGroupIds.map(muscleGroupId => ({
      exerciseId: id,
      muscleGroupId
    }))

    await db.insert(exerciseMuscleGroups).values(muscleGroupAssociations)
  }

  return updatedExercise
}

export const deleteExercise = (id: string) =>
  db.delete(exercises).where(eq(exercises.id, id)).returning()
