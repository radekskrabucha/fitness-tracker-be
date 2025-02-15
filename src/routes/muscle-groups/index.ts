import { createRouter } from '~/lib/createApp'
import * as handlers from './muscle-groups.handlers'
import * as routes from './muscle-groups.routes'

export const muscleGroupsRouter = createRouter()
  .openapi(routes.getMuscleGroups, handlers.getMuscleGroups)
  .openapi(routes.getMuscleGroup, handlers.getMuscleGroup)
  .openapi(routes.createMuscleGroup, handlers.createMuscleGroup)
  .openapi(routes.updateMuscleGroup, handlers.updateMuscleGroup)
  .openapi(routes.deleteMuscleGroup, handlers.deleteMuscleGroup)
