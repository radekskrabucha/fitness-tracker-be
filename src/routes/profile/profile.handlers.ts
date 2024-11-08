import { HTTPException } from 'hono/http-exception'
import type { AppRouteHandler } from '~/types/app'
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import { gramsToKg, kgToGrams } from '~/utils/profile'
import type {
  CreateUserProfile,
  DeleteUserProfile,
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

  return c.json(
    {
      ...profile,
      weight: gramsToKg(profile.weight)
    },
    OK
  )
}

export const createUserProfile: AppRouteHandler<
  CreateUserProfile
> = async c => {
  const { id } = c.get('user')
  const profileReq = c.req.valid('json')

  const [profile] = await profileService.createUserProfile(id, {
    ...profileReq,
    weight: kgToGrams(profileReq.weight)
  })

  if (!profile) {
    throw new HTTPException(UNPROCESSABLE_ENTITY, {
      message: 'Invalid request'
    })
  }

  return c.json(
    {
      ...profile,
      weight: gramsToKg(profile.weight)
    },
    OK
  )
}

export const updateUserProfile: AppRouteHandler<
  UpdateUserProfile
> = async c => {
  const user = c.get('user')
  const profileReq = c.req.valid('json')

  const [profile] = await profileService.updateUserProfile(user.id, {
    ...profileReq,
    weight: profileReq.weight ? kgToGrams(profileReq.weight) : undefined
  })

  if (!profile) {
    return c.json({ message: 'Profile not found' }, NOT_FOUND)
  }

  return c.json(
    {
      ...profile,
      weight: gramsToKg(profile.weight)
    },
    OK
  )
}

export const deleteUserProfile: AppRouteHandler<
  DeleteUserProfile
> = async c => {
  const user = c.get('user')

  const [profile] = await profileService.deleteUserProfile(user.id)

  if (!profile) {
    return c.json({ message: 'Profile not found' }, NOT_FOUND)
  }

  return c.json(
    {
      ...profile,
      weight: gramsToKg(profile.weight)
    },
    OK
  )
}
