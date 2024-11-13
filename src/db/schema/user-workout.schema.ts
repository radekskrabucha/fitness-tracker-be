import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  timestamp,
  integer,
  varchar,
  boolean
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { timestampConfig } from './config'
import { workoutPlans } from './workout-plan.schema'
import {
  exerciseAttributeNameEnum,
  workoutAttributeNameEnum,
  workoutExercises,
  workouts
} from './workout.schema'

export const userWorkoutExerciseAttributes = pgTable(
  'user_workout_exercise_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workoutExerciseId: uuid('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    workoutPlanId: uuid('workout_plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'cascade' }),
    attributeName: exerciseAttributeNameEnum('attribute_name').notNull(),
    value: integer('value').notNull(),
    createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', timestampConfig)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`)
  }
)

export const userWorkoutAttributes = pgTable(
  'user_workout_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    workoutPlanId: uuid('workout_plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'cascade' }),
    attributeName: workoutAttributeNameEnum('attribute_name').notNull(),
    integerValue: integer('integer_value'),
    textValue: varchar('description', { length: 256 }),
    booleanValue: boolean('boolean_value'),
    createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', timestampConfig)
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`)
  },
  table => ({
    onlyOneValueConstraint: sql`CHECK (
    (${table.integerValue} IS NOT NULL)::int + 
    (${table.textValue} IS NOT NULL)::int + 
    (${table.booleanValue} IS NOT NULL)::int = 1
  )`
  })
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
    }),
    workoutPlan: one(workoutPlans, {
      fields: [userWorkoutExerciseAttributes.workoutPlanId],
      references: [workoutPlans.id]
    })
  })
)

export const userWorkoutAttributesRelations = relations(
  userWorkoutAttributes,
  ({ one }) => ({
    workout: one(workouts, {
      fields: [userWorkoutAttributes.workoutId],
      references: [workouts.id]
    }),
    workoutPlan: one(workoutPlans, {
      fields: [userWorkoutAttributes.workoutPlanId],
      references: [workoutPlans.id]
    })
  })
)
