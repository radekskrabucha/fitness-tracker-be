import { relations, sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  pgEnum
} from 'drizzle-orm/pg-core'
import { timestampConfig } from './config'
import { userWorkoutPlans } from './user-workout.schema'
import { workouts } from './workout.schema'

export const difficultyLevelEnum = pgEnum('difficulty_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert'
])

export const workoutPlans = pgTable('workout_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  difficultyLevel: difficultyLevelEnum('difficulty_level').notNull(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const workoutPlanWorkouts = pgTable(
  'workout_plan_workouts',
  {
    workoutPlanId: uuid('workout_plan_id')
      .notNull()
      .references(() => workoutPlans.id, { onDelete: 'cascade' }),
    workoutId: uuid('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull()
  },
  t => ({
    pk: { columns: [t.workoutPlanId, t.workoutId] }
  })
)

export const workoutPlansRelations = relations(workoutPlans, ({ many }) => ({
  workouts: many(workoutPlanWorkouts),
  userPlans: many(userWorkoutPlans)
}))

export const workoutPlanWorkoutsRelations = relations(
  workoutPlanWorkouts,
  ({ one }) => ({
    plan: one(workoutPlans, {
      fields: [workoutPlanWorkouts.workoutPlanId],
      references: [workoutPlans.id]
    }),
    workout: one(workouts, {
      fields: [workoutPlanWorkouts.workoutId],
      references: [workouts.id]
    })
  })
)
