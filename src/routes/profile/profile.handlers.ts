import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type { GetUserProfile } from './profile.routes'
import * as profileService from './profile.services'

export const getUserProfile: AppRouteHandler<GetUserProfile> = async c => {
  const user = c.get('user')

  const profile = await profileService.getUserProfile(user.id)

  if (!profile) {
    return c.json({ message: 'Profile not found' }, NOT_FOUND)
  }

  return c.json(profile, OK)
}
