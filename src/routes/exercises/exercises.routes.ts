import { createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import {
  insertExerciseSchema,
  selectExerciseSchema,
  patchExerciseSchema
} from '~/db/schema/exercise.schema'
import { CREATED, OK, NOT_FOUND, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  zodErrorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Exercises']

export const getExercises = createRoute({
  method: 'get',
  path: '/',
  tags,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises',
      schema: z.array(selectExerciseSchema.openapi('Exercise'))
    })
  }
})
export type GetExercises = typeof getExercises

export const getExerciseById = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Exercise details',
      schema: selectExerciseSchema.openapi('Exercise')
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid UUID',
      schema: errorOpenApiSchema
    })
  }
})
export type GetExerciseById = typeof getExerciseById

export const createExercise = createRoute({
  method: 'post',
  path: '/',
  tags,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Exercise to create',
      schema: insertExerciseSchema
    })
  },
  responses: {
    [CREATED]: jsonContentOpenAPISchema({
      description: 'Created exercise',
      schema: selectExerciseSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
      schema: zodErrorOpenApiSchema
    })
  }
})
export type CreateExercise = typeof createExercise

export const updateExercise = createRoute({
  method: 'put',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Updated exercise data',
      schema: patchExerciseSchema
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated exercise',
      schema: selectExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
      schema: zodErrorOpenApiSchema
    })
  }
})
export type UpdateExercise = typeof updateExercise

export const deleteExercise = createRoute({
  method: 'delete',
  path: '/{id}',
  tags,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Deleted exercise',
      schema: selectExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    })
  }
})
export type DeleteExercise = typeof deleteExercise
