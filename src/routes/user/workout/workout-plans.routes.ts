import { createRoute, z } from '@hono/zod-openapi'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['User Workouts']

export const getUserTodayWorkoutPlan = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved today workouts',
      schema: z.array(z.string())
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserTodayWorkoutPlan = typeof getUserTodayWorkoutPlan
