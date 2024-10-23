import { createRoute, z } from '@hono/zod-openapi'
import { authMiddleware } from '~/middleware/auth'
import {
  NOT_FOUND,
  OK,
  UNAUTHORIZED
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema
} from '~/utils/schemas'
import { selectWorkoutSchema } from '~/db/schema/workout.schema'

const tags = ['Workouts']

export const listWorkouts = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of user workouts',
      schema: z.array(selectWorkoutSchema.openapi('Workout'))
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type ListWorkouts = typeof listWorkouts

export const getWorkout = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved workout',
      schema: selectWorkoutSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})

export type GetWorkout = typeof getWorkout
