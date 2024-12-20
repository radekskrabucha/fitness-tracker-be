import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { exercises, exerciseMuscleGroups } from '~/db/schema/exercise.schema'
import type {
  InsertExerciseWithDetails,
  PatchExerciseWithExtras
} from '~/lib/dbSchema/exercise'
import { transformRawExercise } from '~/utils/transforms/exercise'

export const getExercises = async () => {
  const retrievedExercises = await db.query.exercises.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
      categoryId: false
    },
    with: {
      c: true,
      mGs: {
        columns: {},
        with: {
          mG: {
            columns: {
              createdAt: false,
              updatedAt: false
            }
          }
        }
      }
    }
  })

  return retrievedExercises.map(transformRawExercise)
}

export const getExerciseById = async (exerciseId: string) => {
  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
    columns: {
      createdAt: false,
      updatedAt: false,
      categoryId: false
    },
    with: {
      c: true,
      mGs: {
        columns: {},
        with: {
          mG: {
            columns: {
              createdAt: false,
              updatedAt: false
            }
          }
        }
      }
    }
  })

  if (!exercise) {
    return undefined
  }

  return transformRawExercise(exercise)
}

export const createExercise = async ({
  muscleGroupIds,
  ...exerciseData
}: InsertExerciseWithDetails) => {
  const [exercise] = await db.insert(exercises).values(exerciseData).returning({
    id: exercises.id,
    name: exercises.name,
    description: exercises.description
  })

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
  { muscleGroupIds, ...exerciseData }: PatchExerciseWithExtras
) => {
  const [updatedExercise] = await db
    .update(exercises)
    .set(exerciseData)
    .where(eq(exercises.id, id))
    .returning({
      id: exercises.id,
      name: exercises.name,
      description: exercises.description
    })

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
  db.delete(exercises).where(eq(exercises.id, id)).returning({
    id: exercises.id,
    name: exercises.name,
    description: exercises.description
  })
