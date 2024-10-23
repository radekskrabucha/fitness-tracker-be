import { createRouter } from '~/lib/createApp'
import * as handlers from './muscle-groups.handlers'
import * as routes from './muscle-groups.routes'

export const muscleGroupsRouter = createRouter()
  .openapi(routes.getMuscleGroups, handlers.getMuscleGroups)
  .openapi(routes.getMuscleGroup, handlers.getMuscleGroup)
