import { createRoute, z } from '@hono/zod-openapi'
import {
  selectMuscleGroupSchema,
  insertMuscleGroupSchema
} from '~/db/schema/exercise.schema'
import { OK, NOT_FOUND, CREATED, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import {
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  errorOpenApiSchema,
  zodErrorOpenApiSchema
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

export const createMuscleGroup = createRoute({
  method: 'post',
  path: '/',
  tags,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new muscle group',
      schema: insertMuscleGroupSchema,
      required: true
    })
  },
  responses: {
    [CREATED]: jsonContentOpenAPISchema({
      description: 'Created muscle group',
      schema: selectMuscleGroupSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type CreateMuscleGroup = typeof createMuscleGroup
