import { createRouter } from '~/lib/createApp'
import * as handlers from './profile.handlers'
import * as routes from './profile.routes'

export const profileRouter = createRouter().openapi(
  routes.getUserProfile,
  handlers.getUserProfile
)
