import { sql } from 'drizzle-orm'
import { integer, pgTable, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { user } from './auth.schema'
import { timestampConfig } from './config'

export const genderEnum = pgEnum('gender', [
  'male',
  'female',
  'other',
  'prefer_not_to_say'
])
export const activityLevelEnum = pgEnum('activity_level', [
  'sedentary',
  'lightly_active',
  'moderately_active',
  'very_active',
  'extra_active'
])
export const fitnessGoalEnum = pgEnum('fitness_goal', [
  'lose_weight',
  'gain_muscle',
  'maintain_weight',
  'improve_endurance',
  'increase_flexibility'
])
export const dietaryPreferenceEnum = pgEnum('dietary_preference', [
  'no_preference',
  'vegetarian',
  'vegan',
  'pescatarian',
  'keto',
  'paleo',
  'mediterranean'
])

export const userFitnessProfiles = pgTable('user_fitness_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  height: integer('height').notNull(), // in centimeters
  weight: integer('weight').notNull(), // in grams
  age: integer('age').notNull(),
  gender: genderEnum('gender').notNull(),
  activityLevel: activityLevelEnum('activity_level').notNull(),
  fitnessGoal: fitnessGoalEnum('fitness_goal').notNull(),
  dietaryPreference: dietaryPreferenceEnum('dietary_preference'),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export type InsertUserFitnessProfile = typeof userFitnessProfiles.$inferInsert
export type SelectUserFitnessProfile = typeof userFitnessProfiles.$inferSelect

export const insertUserFitnessProfileSchema = createInsertSchema(
  userFitnessProfiles,
  {
    height: schema => schema.height.min(1).max(300),
    weight: schema => schema.weight.min(1).max(300_000),
    age: schema => schema.age.min(1).max(120)
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const patchUserFitnessProfileSchema =
  insertUserFitnessProfileSchema.partial()
export const selectUserFitnessProfileSchema =
  createSelectSchema(userFitnessProfiles)
