import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises, exerciseMuscleGroups } from '~/db/schema/exercise.schema'
import type {
  InsertExercise,
  PatchExercise,
  SelectExercise,
  SelectExerciseCategory,
  SelectMuscleGroup,
  SelectExerciseWithDetails
} from '~/lib/dbSchema/exercise'

type ExerciseWithDetails = SelectExercise & {
  category: SelectExerciseCategory
  exerciseMuscleGroups: Array<{
    muscleGroup: SelectMuscleGroup
  }>
}

const transformExerciseWithDetails = (
  exercise: ExerciseWithDetails
): SelectExerciseWithDetails => {
  const { exerciseMuscleGroups, ...exerciseDetails } = exercise

  return {
    ...exerciseDetails,
    muscleGroups: exerciseMuscleGroups.map(
      muscleGroup => muscleGroup.muscleGroup
    )
  }
}

export const getExercises = async () => {
  const result = await db.query.exercises.findMany({
    with: {
      category: true,
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true
        }
      }
    }
  })

  return result.map(transformExerciseWithDetails)
}

export const getExerciseById = async (
  exerciseId: string
): Promise<SelectExerciseWithDetails | undefined> => {
  const result = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
    with: {
      category: true,
      exerciseMuscleGroups: {
        with: {
          muscleGroup: true
        }
      }
    }
  })

  if (!result) {
    return undefined
  }

  return transformExerciseWithDetails(result)
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
