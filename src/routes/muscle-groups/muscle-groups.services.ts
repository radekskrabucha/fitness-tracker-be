import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { muscleGroups } from '~/db/schema/exercise.schema'

export const getMuscleGroups = () => db.query.muscleGroups.findMany()

export const getMuscleGroupById = (id: string) =>
  db.query.muscleGroups.findFirst({
    where: eq(muscleGroups.id, id)
  })
