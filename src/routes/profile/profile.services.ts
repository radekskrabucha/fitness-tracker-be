import { eq } from 'drizzle-orm'
import { db } from '~/db'
import { userFitnessProfiles } from '~/db/schema/profile.schema'
import type {
  InsertUserFitnessProfile,
  PatchUserFitnessProfile
} from '~/lib/dbSchema/profile'

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
    .values({ ...profile, userId, dateOfBirth: new Date(profile.dateOfBirth) })
    .returning()

export const updateUserProfile = (
  id: string,
  profile: PatchUserFitnessProfile
) => {
  const { dateOfBirth, ...rest } = profile

  return db
    .update(userFitnessProfiles)
    .set({
      ...rest,
      ...(dateOfBirth ? { dateOfBirth: new Date(dateOfBirth) } : {})
    })
    .where(eq(userFitnessProfiles.userId, id))
    .returning()
}

export const deleteUserProfile = (id: string) =>
  db
    .delete(userFitnessProfiles)
    .where(eq(userFitnessProfiles.userId, id))
    .returning()
