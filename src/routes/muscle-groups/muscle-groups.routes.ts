import { createRoute, z } from '@hono/zod-openapi'
import { selectMuscleGroupSchema } from '~/db/schema/exercise.schema'
import { OK, NOT_FOUND } from '~/utils/httpCodes'
import {
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  errorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Muscle Groups']

export const getMuscleGroups = createRoute({
  method: 'get',
  path: '/',
  tags,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of muscle groups',
      schema: z.array(selectMuscleGroupSchema.openapi('MuscleGroup'))
    })
  }
})
export type GetMuscleGroups = typeof getMuscleGroups

export const getMuscleGroup = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved muscle group',
      schema: selectMuscleGroupSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Muscle group not found'
    })
  }
})
export type GetMuscleGroup = typeof getMuscleGroup
