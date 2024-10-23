import { eq } from 'drizzle-orm'
import { db } from '~/db'
import {
  userFitnessProfiles,
  type InsertUserFitnessProfile,
  type PatchUserFitnessProfile
} from '~/db/schema/profile.schema'

export const getUserProfile = (id: string) =>
  db.query.userFitnessProfiles.findFirst({
    where: ({ userId }) => eq(userId, id)
  })

export const createUserProfile = (profile: InsertUserFitnessProfile) =>
  db.insert(userFitnessProfiles).values(profile).returning()

export const updateUserProfile = (
  id: string,
  profile: PatchUserFitnessProfile
) =>
  db
    .update(userFitnessProfiles)
    .set(profile)
    .where(eq(userFitnessProfiles.userId, id))
    .returning()

export const deleteUserProfile = (id: string) =>
  db
    .delete(userFitnessProfiles)
    .where(eq(userFitnessProfiles.userId, id))
    .returning()
