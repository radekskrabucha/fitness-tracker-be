import { createRoute } from '@hono/zod-openapi'
import {
  selectUserWorkoutPlanSchema,
  selectUserWorkoutPlanWithDetailsSchema,
  insertUserWorkoutPlanSchema
} from '~/lib/dbSchema/user-workout'
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

export const getUserWorkoutPlanById = createRoute({
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
      schema: selectUserWorkoutPlanWithDetailsSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid UUID'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserWorkoutPlanById = typeof getUserWorkoutPlanById

export const createUserWorkoutPlan = createRoute({
  method: 'post',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new workout plan',
      schema: insertUserWorkoutPlanSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout plan',
      schema: selectUserWorkoutPlanSchema
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type CreateUserWorkoutPlan = typeof createUserWorkoutPlan

export const deleteUserWorkoutPlan = createRoute({
  method: 'delete',
  path: '/{id}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Deleted workout plan',
      schema: selectUserWorkoutPlanSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid UUID'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type DeleteUserWorkoutPlan = typeof deleteUserWorkoutPlan
