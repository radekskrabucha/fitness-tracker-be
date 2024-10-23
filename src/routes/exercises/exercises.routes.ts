import { createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { selectExerciseSchema } from '~/db/schema/exercise.schema'
import { NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema
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
  path: '/:id',
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
