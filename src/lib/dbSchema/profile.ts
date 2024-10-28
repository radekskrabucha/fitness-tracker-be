import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userFitnessProfiles } from '~/db/schema/profile.schema'

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
  createSelectSchema(userFitnessProfiles).openapi('UserFitnessProfile')

export type InsertUserFitnessProfile = z.infer<
  typeof insertUserFitnessProfileSchema
>
export type PatchUserFitnessProfile = z.infer<
  typeof patchUserFitnessProfileSchema
>
export type SelectUserFitnessProfile = z.infer<
  typeof selectUserFitnessProfileSchema
>
