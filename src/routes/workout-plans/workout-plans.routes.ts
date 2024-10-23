import { createRoute } from '@hono/zod-openapi'
import {
  insertWorkoutPlanSchema,
  selectWorkoutPlanSchema
} from '~/db/schema/workout-plan.schema'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema
} from '~/utils/schemas'

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

export const getWorkoutPlanById = createRoute({
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
      description: 'Retrieved workout plan',
      schema: selectWorkoutPlanSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetWorkoutPlanById = typeof getWorkoutPlanById

export const postWorkoutPlan = createRoute({
  method: 'post',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new workout plan',
      schema: insertWorkoutPlanSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout plan',
      schema: selectWorkoutPlanSchema
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type PostWorkoutPlan = typeof postWorkoutPlan
