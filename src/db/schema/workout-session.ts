import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'
import { user } from './auth.schema'
import { exercises } from './exercise.schema'
import { workoutPlans } from './workout-plan.schema'
import { exerciseAttributeNameEnum, workouts } from './workout.schema'

export const userWorkoutSessions = pgTable('user_workout_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  workoutPlanId: uuid('workout_plan_id')
    .notNull()
    .references(() => workoutPlans.id, {
      onDelete: 'cascade'
    }),
  workoutId: uuid('workout_id')
    .notNull()
    .references(() => workouts.id, {
      onDelete: 'cascade'
    }),
  date: timestamp('date').defaultNow().notNull(),
  duration: integer('duration').notNull(),
  notes: varchar('notes', { length: 1024 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const userWorkoutSessionExercises = pgTable(
  'user_workout_session_exercises',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => userWorkoutSessions.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    orderIndex: integer('order_index').notNull(),
    completed: boolean('completed').default(false).notNull(),
    notes: varchar('notes', { length: 1024 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`)
  }
)

export const userWorkoutSessionExerciseAttributes = pgTable(
  'user_workout_session_exercise_attributes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    sessionExerciseId: uuid('session_exercise_id')
      .notNull()
      .references(() => userWorkoutSessionExercises.id, {
        onDelete: 'cascade'
      }),
    name: exerciseAttributeNameEnum('name').notNull(),
    value: integer('value').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => sql`now()`)
  }
)

export const userWorkoutSessionsRelations = relations(
  userWorkoutSessions,
  ({ one, many }) => ({
    user: one(user, {
      fields: [userWorkoutSessions.userId],
      references: [user.id]
    }),
    workoutPlan: one(workoutPlans, {
      fields: [userWorkoutSessions.workoutPlanId],
      references: [workoutPlans.id]
    }),
    workout: one(workouts, {
      fields: [userWorkoutSessions.workoutId],
      references: [workouts.id]
    }),
    exercises: many(userWorkoutSessionExercises)
  })
)

export const userWorkoutSessionExercisesRelations = relations(
  userWorkoutSessionExercises,
  ({ one, many }) => ({
    user: one(user, {
      fields: [userWorkoutSessionExercises.userId],
      references: [user.id]
    }),
    session: one(userWorkoutSessions, {
      fields: [userWorkoutSessionExercises.sessionId],
      references: [userWorkoutSessions.id]
    }),
    exercise: one(exercises, {
      fields: [userWorkoutSessionExercises.exerciseId],
      references: [exercises.id]
    }),
    attributes: many(userWorkoutSessionExerciseAttributes)
  })
)

export const userWorkoutSessionExerciseAttributesRelations = relations(
  userWorkoutSessionExerciseAttributes,
  ({ one }) => ({
    user: one(user, {
      fields: [userWorkoutSessionExerciseAttributes.userId],
      references: [user.id]
    }),
    exercise: one(userWorkoutSessionExercises, {
      fields: [userWorkoutSessionExerciseAttributes.sessionExerciseId],
      references: [userWorkoutSessionExercises.id]
    })
  })
)
