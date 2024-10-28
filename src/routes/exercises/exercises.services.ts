import { eq, sql } from 'drizzle-orm'
import { db } from '~/db'
import {
  exercises,
  exerciseMuscleGroups,
  muscleGroups
} from '~/db/schema/exercise.schema'
import type {
  InsertExercise,
  PatchExercise,
  SelectMuscleGroup
} from '~/lib/dbSchema/exercise'

export const getExercises = () => db.query.exercises.findMany()

export const getExerciseById = async (exerciseId: string) => {
  const [result] = await db
    .select({
      exercise: exercises,
      muscleGroups: sql<
        Array<SelectMuscleGroup>
      >`json_agg(row_to_json(${muscleGroups}))`
    })
    .from(exerciseMuscleGroups)
    .leftJoin(exercises, eq(exerciseMuscleGroups.exerciseId, exercises.id))
    .leftJoin(
      muscleGroups,
      eq(exerciseMuscleGroups.muscleGroupId, muscleGroups.id)
    )
    .where(eq(exercises.id, exerciseId))
    .groupBy(exercises.id)

  return result
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
  return await db.transaction(async tx => {
    const [updatedExercise] = await tx
      .update(exercises)
      .set(exerciseData)
      .where(eq(exercises.id, id))
      .returning()

    if (muscleGroupIds) {
      await tx
        .delete(exerciseMuscleGroups)
        .where(eq(exerciseMuscleGroups.exerciseId, id))
      const muscleGroupAssociations = muscleGroupIds.map(muscleGroupId => ({
        exerciseId: id,
        muscleGroupId
      }))

      await tx.insert(exerciseMuscleGroups).values(muscleGroupAssociations)
    }

    return updatedExercise
  })
}

export const deleteExercise = (id: string) =>
  db.delete(exercises).where(eq(exercises.id, id)).returning()
