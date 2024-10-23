import { db } from '~/db'

export const getWorkoutPlans = () => db.query.workoutPlans.findMany()
