import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK } from '~/utils/httpCodes'
import type {
  CreateUserProfile,
  GetUserProfile,
  UpdateUserProfile
} from './profile.routes'
import * as profileService from './profile.services'

export const getUserProfile: AppRouteHandler<GetUserProfile> = async c => {
  const user = c.get('user')

  const profile = await profileService.getUserProfile(user.id)

  if (!profile) {
    return c.json({ message: 'Profile not found' }, NOT_FOUND)
  }

  return c.json(profile, OK)
}

export const createUserProfile: AppRouteHandler<
  CreateUserProfile
> = async c => {
  const { id } = c.get('user')
  const profileReq = c.req.valid('json')

  const [profile] = await profileService.createUserProfile({
    ...profileReq,
    userId: id
  })

  return c.json(profile, OK)
}

export const updateUserProfile: AppRouteHandler<
  UpdateUserProfile
> = async c => {
  const user = c.get('user')
  const profileReq = c.req.valid('json')

  const [profile] = await profileService.updateUserProfile(user.id, profileReq)

  return c.json(profile, OK)
}
