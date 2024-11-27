import { createRoute } from '@hono/zod-openapi'
import {
  insertUserWorkoutSessionWithExtrasSchema,
  selectUserWorkoutSessionSchema,
  selectUserWorkoutSessionSchemaWithExtras
} from '~/lib/dbSchema/workoutSession'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['User Workout Sessions']

export const getUserWorkoutSessions = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of user workout sessions',
      schema: selectUserWorkoutSessionSchemaWithExtras.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserWorkoutSessions = typeof getUserWorkoutSessions

export const postUserWorkoutSession = createRoute({
  method: 'post',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new user workout session',
      schema: insertUserWorkoutSessionWithExtrasSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout session',
      schema: selectUserWorkoutSessionSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type PostUserWorkoutSession = typeof postUserWorkoutSession
