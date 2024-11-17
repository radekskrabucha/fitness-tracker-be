import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  pgEnum,
  boolean
} from 'drizzle-orm/pg-core'
import { timestampConfig } from './config'
import { exercises } from './exercise.schema'
import {
  userWorkoutAttributes,
  userWorkoutExerciseAttributes
} from './user-workout.schema'
import { workoutPlans, workoutPlanWorkouts } from './workout-plan.schema'

export const exerciseAttributeNameEnum = pgEnum('exercise_attribute_name', [
  'sets',
  'reps',
  'weight',
  'duration',
  'distance'
])
export const workoutAttributeNameEnum = pgEnum('workout_attribute_name', [
  'days_of_week',
  'intensity_level',
  'duration_goal',
  'warmup_required',
  'cooldown_required',
  'rest_period_between_sets'
])

export const workouts = pgTable('workouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const workoutExercises = pgTable('workout_exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, { onDelete: 'cascade' }),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const defaultWorkoutExerciseAttributes = pgTable(
  'default_workout_exercise_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
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

export const defaultWorkoutAttributes = pgTable(
  'default_workout_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    workoutPlanId: uuid('workout_plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'cascade' }),
    attributeName: workoutAttributeNameEnum('attribute_name').notNull(),
    integerValue: integer('integer_value'),
    textValue: varchar('text_value', { length: 256 }),
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

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id]
    }),
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id]
    }),
    attributes: many(userWorkoutExerciseAttributes),
    defaultAttributes: many(defaultWorkoutExerciseAttributes)
  })
)

export const workoutRelations = relations(workouts, ({ many }) => ({
  exercises: many(workoutExercises),
  planWorkouts: many(workoutPlanWorkouts),
  attributes: many(userWorkoutAttributes),
  defaultAttributes: many(defaultWorkoutAttributes)
}))

export const defaultWorkoutExerciseAttributesRelations = relations(
  defaultWorkoutExerciseAttributes,
  ({ one }) => ({
    workoutExercise: one(workoutExercises, {
      fields: [defaultWorkoutExerciseAttributes.workoutExerciseId],
      references: [workoutExercises.id]
    }),
    workoutPlan: one(workoutPlans, {
      fields: [defaultWorkoutExerciseAttributes.workoutPlanId],
      references: [workoutPlans.id]
    })
  })
)
export const defaultWorkoutAttributesRelations = relations(
  defaultWorkoutAttributes,
  ({ one }) => ({
    workout: one(workouts, {
      fields: [defaultWorkoutAttributes.workoutId],
      references: [workouts.id]
    }),
    workoutPlan: one(workoutPlans, {
      fields: [defaultWorkoutAttributes.workoutPlanId],
      references: [workoutPlans.id]
    })
  })
)
