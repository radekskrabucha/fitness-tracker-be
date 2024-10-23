import { sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { timestampConfig } from './config'

export const exerciseCategoryEnum = pgEnum('exercise_category', [
  'strength',
  'cardio',
  'flexibility',
  'balance',
  'plyometrics'
])

export const exercises = pgTable('exercises', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: exerciseCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const muscleGroups = pgTable('muscle_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', timestampConfig).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', timestampConfig)
    .defaultNow()
    .notNull()
    .$onUpdate(() => sql`now()`)
})

export const exerciseMuscleGroups = pgTable(
  'exercise_muscle_groups',
  {
    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'cascade' }),
    muscleGroupId: uuid('muscle_group_id')
      .notNull()
      .references(() => muscleGroups.id, { onDelete: 'cascade' })
  },
  t => ({
    pk: { columns: [t.exerciseId, t.muscleGroupId] }
  })
)

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchExerciseSchema = insertExerciseSchema.partial()
export const selectExerciseSchema = createSelectSchema(exercises)

export const insertMuscleGroupSchema = createInsertSchema(muscleGroups).omit({
  id: true,
  createdAt: true,
  updatedAt: true
})
export const patchMuscleGroupSchema = insertMuscleGroupSchema.partial()
export const selectMuscleGroupSchema = createSelectSchema(muscleGroups)

export const insertExerciseMuscleGroupSchema =
  createInsertSchema(exerciseMuscleGroups)
export const selectExerciseMuscleGroupSchema =
  createSelectSchema(exerciseMuscleGroups)

export type InsertExercise = z.infer<typeof insertExerciseSchema>
export type SelectExercise = z.infer<typeof selectExerciseSchema>
export type InsertMuscleGroup = z.infer<typeof insertMuscleGroupSchema>
export type SelectMuscleGroup = z.infer<typeof selectMuscleGroupSchema>
export type InsertExerciseMuscleGroup = z.infer<
  typeof insertExerciseMuscleGroupSchema
>
export type SelectExerciseMuscleGroup = z.infer<
  typeof selectExerciseMuscleGroupSchema
>
