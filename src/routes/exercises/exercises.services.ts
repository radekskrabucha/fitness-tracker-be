import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises, exerciseMuscleGroups } from '~/db/schema/exercise.schema'
import type { InsertExercise, PatchExercise } from '~/lib/dbSchema/exercise'

export const getExercises = () => db.query.exercises.findMany()

export const getExerciseById = (exerciseId: string) =>
  db.query.exercises.findFirst({
    where: ({ id }) => eq(id, exerciseId)
  })

export const createExercise = async ({
  muscleGroupIds,
  ...exerciseData
}: InsertExercise) => {
  return await db.transaction(async tx => {
    const [exercise] = await tx
      .insert(exercises)
      .values(exerciseData)
      .returning()

    if (!exercise) {
      await tx.rollback()
      throw new Error('Exercise not found')
    }

    const muscleGroupAssociations = muscleGroupIds.map(muscleGroupId => ({
      exerciseId: exercise.id,
      muscleGroupId
    }))

    await tx.insert(exerciseMuscleGroups).values(muscleGroupAssociations)

    return exercise
  })
}

export const updateExercise = (id: string, exercise: PatchExercise) =>
  db.update(exercises).set(exercise).where(eq(exercises.id, id)).returning()

export const deleteExercise = (id: string) =>
  db.delete(exercises).where(eq(exercises.id, id)).returning()
