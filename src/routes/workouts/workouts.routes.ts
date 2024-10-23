import { createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'
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
