import { db } from '~/db'

export const getMuscleGroups = () => db.query.muscleGroups.findMany()
