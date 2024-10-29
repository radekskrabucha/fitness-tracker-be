import { sql } from 'drizzle-orm'
import { pgTable, uuid, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { workoutExercises } from './workout.schema'

export const exerciseAttributeNameEnum = pgEnum('exercise_attribute_name', [
  'sets',
  'reps',
  'weight',
  'duration',
  'distance'
])

export const userWorkoutExerciseAttributes = pgTable(
  'user_workout_exercise_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id),
    workoutExerciseId: uuid('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id),
    attributeName: exerciseAttributeNameEnum('attribute_name').notNull(),
    value: integer('value').notNull(),
    createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', timestampConfig)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`)
  }
)
