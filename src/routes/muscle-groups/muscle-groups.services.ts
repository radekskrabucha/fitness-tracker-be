import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  muscleGroups,
  type InsertMuscleGroup,
  type PatchMuscleGroup
} from '~/db/schema/exercise.schema'

export const getMuscleGroups = () => db.query.muscleGroups.findMany()

export const getMuscleGroupById = (id: string) =>
  db.query.muscleGroups.findFirst({
    where: eq(muscleGroups.id, id)
  })

export const createMuscleGroup = (data: InsertMuscleGroup) =>
  db.insert(muscleGroups).values(data).returning()

export const updateMuscleGroup = (id: string, data: PatchMuscleGroup) =>
  db.update(muscleGroups).set(data).where(eq(muscleGroups.id, id)).returning()
