import { createRoute } from '@hono/zod-openapi'
import {
  insertUserWorkoutSessionWithExtrasSchema,
  selectUserWorkoutSessionSchema,
  selectUserWorkoutSessionSchemaWithExtras
} from '~/lib/dbSchema/workoutSession'
import { authMiddleware } from '~/middleware/auth'
import {
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema
} from '~/utils/schemas'

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

export const getUserWorkoutSessionById = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'User workout session by id',
      schema: selectUserWorkoutSessionSchemaWithExtras
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserWorkoutSessionById = typeof getUserWorkoutSessionById

export const getUserLatestWorkoutSession = createRoute({
  method: 'get',
  path: '/latest',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'User latest workout by session date',
      schema: selectUserWorkoutSessionSchemaWithExtras
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserLatestWorkoutSession = typeof getUserLatestWorkoutSession

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
