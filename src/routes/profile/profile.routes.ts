import { createRoute } from '@hono/zod-openapi'
import {
  insertUserFitnessProfileSchema,
  selectUserFitnessProfileSchema
} from '~/db/schema/profile.schema'
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
  zodErrorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Profile']

export const getUserProfile = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved profile',
      schema: selectUserFitnessProfileSchema.openapi('UserFitnessProfile')
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Profile not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserProfile = typeof getUserProfile

export const createUserProfile = createRoute({
  method: 'post',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a fitness profile',
      schema: insertUserFitnessProfileSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created fitness profile',
      schema: selectUserFitnessProfileSchema
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema.openapi('ZodError'),
      description: 'Invalid request'
    })
  }
})
export type CreateUserProfile = typeof createUserProfile
