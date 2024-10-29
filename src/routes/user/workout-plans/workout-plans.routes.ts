import { createRoute } from '@hono/zod-openapi'
import { selectUserWorkoutPlanSchema } from '~/lib/dbSchema/user-workout'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['User Workout Plans']

export const getUserWorkoutPlans = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of user workout plans',
      schema: selectUserWorkoutPlanSchema.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserWorkoutPlans = typeof getUserWorkoutPlans
