import { createRoute } from '@hono/zod-openapi'
import { selectWorkoutPlanSchema } from '~/db/schema/workout-plan.schema'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['Workout Plans']

export const getWorkoutPlans = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of workout plans',
      schema: selectWorkoutPlanSchema.openapi('WorkoutPlan').array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetWorkoutPlans = typeof getWorkoutPlans
