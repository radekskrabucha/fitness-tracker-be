import { db } from '~/db'

export const getExercises = () => db.query.exercises.findMany()
