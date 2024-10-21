import { createRoute } from '@hono/zod-openapi'
import { selectUserFitnessProfileSchema } from '~/db/schema/profile.schema'
import { authMiddleware } from '~/middleware/auth'
import { NOT_FOUND, OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

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
