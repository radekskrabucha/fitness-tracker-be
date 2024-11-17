import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { muscleGroups } from '~/db/schema/exercise.schema'
import type {
  InsertMuscleGroup,
  PatchMuscleGroup
} from '~/lib/dbSchema/muscleGroups'

export const getMuscleGroups = () =>
  db.query.muscleGroups.findMany({
    columns: {
      updatedAt: false,
      createdAt: false
    }
  })

export const getMuscleGroupById = (id: string) =>
  db.query.muscleGroups.findFirst({
    where: eq(muscleGroups.id, id),
    columns: {
      createdAt: false,
      updatedAt: false
    }
  })

export const createMuscleGroup = (data: InsertMuscleGroup) =>
  db.insert(muscleGroups).values(data).returning()

export const updateMuscleGroup = (id: string, data: PatchMuscleGroup) =>
  db.update(muscleGroups).set(data).where(eq(muscleGroups.id, id)).returning()

export const deleteMuscleGroup = (id: string) =>
  db.delete(muscleGroups).where(eq(muscleGroups.id, id)).returning()
