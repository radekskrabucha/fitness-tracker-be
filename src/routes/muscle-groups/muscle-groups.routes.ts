import { createRoute } from '@hono/zod-openapi'
import {
  selectMuscleGroupSchema,
  insertMuscleGroupSchema,
  patchMuscleGroupSchema
} from '~/lib/dbSchema/exercise'
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
      schema: selectMuscleGroupSchema.openapi('MuscleGroup').array()
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

export const updateMuscleGroup = createRoute({
  method: 'put',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Update a muscle group',
      schema: patchMuscleGroupSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated muscle group',
      schema: selectMuscleGroupSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Muscle group not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type UpdateMuscleGroup = typeof updateMuscleGroup

export const deleteMuscleGroup = createRoute({
  method: 'delete',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Deleted muscle group',
      schema: selectMuscleGroupSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Muscle group not found'
    })
  }
})
export type DeleteMuscleGroup = typeof deleteMuscleGroup
