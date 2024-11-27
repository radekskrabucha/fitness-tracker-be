import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { env } from '~/utils/env'
import * as authSchema from './schema/auth.schema'
import * as exerciseSchema from './schema/exercise.schema'
import * as profileSchema from './schema/profile.schema'
import * as userWorkoutSchema from './schema/user-workout.schema'
import * as workoutPlanSchema from './schema/workout-plan.schema'
import * as workoutSessionSchema from './schema/workout-session.schema'
import * as workoutSchema from './schema/workout.schema'

const sql = neon(env.DATABASE_URL)
export const db = drizzle(sql, {
  schema: {
    ...authSchema,
    ...profileSchema,
    ...exerciseSchema,
    ...workoutSchema,
    ...workoutPlanSchema,
    ...userWorkoutSchema,
    ...workoutSessionSchema
  }
})
