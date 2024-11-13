import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { userFitnessProfiles } from '~/db/schema/profile.schema'
import type {
  InsertUserFitnessProfile,
  PatchUserFitnessProfile
} from '~/lib/dbSchemaNew/profile'

export const getUserProfile = (id: string) =>
  db.query.userFitnessProfiles.findFirst({
    where: ({ userId }) => eq(userId, id)
  })

export const createUserProfile = (
  userId: string,
  profile: InsertUserFitnessProfile
) =>
  db
    .insert(userFitnessProfiles)
    .values({ ...profile, userId })
    .returning()

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
