import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { userFitnessProfiles } from '~/db/schema/profile.schema'

export const insertUserFitnessProfileSchema = createInsertSchema(
  userFitnessProfiles,
  {
    height: schema => schema.height.min(1).max(300),
    weight: schema => schema.weight.min(1).max(30_000) // 300kg, 30 000 dekagrams
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true
})
export const patchUserFitnessProfileSchema =
  insertUserFitnessProfileSchema.partial()
export const selectUserFitnessProfileSchema = createSelectSchema(
  userFitnessProfiles
)
  .omit({
    createdAt: true,
    updatedAt: true,
    id: true
  })
  .openapi('UserFitnessProfile')

export type InsertUserFitnessProfile = z.infer<
  typeof insertUserFitnessProfileSchema
>
export type PatchUserFitnessProfile = z.infer<
  typeof patchUserFitnessProfileSchema
>
export type SelectUserFitnessProfile = z.infer<
  typeof selectUserFitnessProfileSchema
>
