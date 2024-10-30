import { relations, sql } from 'drizzle-orm'
import { pgTable, uuid, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { workoutPlans } from './workout-plan.schema'
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

export const userWorkoutPlans = pgTable('user_workout_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  workoutPlanId: uuid('workout_plan_id')
    .notNull()
    .references(() => workoutPlans.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const userWorkoutPlansRelations = relations(
  userWorkoutPlans,
  ({ one }) => ({
    user: one(user, {
      fields: [userWorkoutPlans.userId],
      references: [user.id]
    }),
    plan: one(workoutPlans, {
      fields: [userWorkoutPlans.workoutPlanId],
      references: [workoutPlans.id]
    })
  })
)

export const userWorkoutExerciseAttributesRelations = relations(
  userWorkoutExerciseAttributes,
  ({ one }) => ({
    user: one(user, {
      fields: [userWorkoutExerciseAttributes.userId],
      references: [user.id]
    }),
    exercise: one(workoutExercises, {
      fields: [userWorkoutExerciseAttributes.workoutExerciseId],
      references: [workoutExercises.id]
    })
  })
)
