import { createRoute } from '@hono/zod-openapi'
import {
  insertWorkoutPlanWithExtrasSchema,
  patchWorkoutPlanSchema,
  selectWorkoutPlanSchema,
  selectWorkoutPlanWithWorkoutsSchema
} from '~/lib/dbSchemaNew/workout-plan'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  FORBIDDEN
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema
} from '~/utils/schemas'

const tags = ['Workout Plans']
const adminTags = withAdminTag(tags)

export const getWorkoutPlans = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of workout plans',
      schema: selectWorkoutPlanWithWorkoutsSchema.array()
    })
  }
})
export type GetWorkoutPlans = typeof getWorkoutPlans

export const getWorkoutPlanById = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  security: [{ cookieAuth: [] }],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved workout plan',
      schema: selectWorkoutPlanWithWorkoutsSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    })
  }
})
export type GetWorkoutPlanById = typeof getWorkoutPlanById

export const postWorkoutPlan = createRoute({
  method: 'post',
  path: '/',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new workout plan',
      schema: insertWorkoutPlanWithExtrasSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout plan',
      schema: selectWorkoutPlanSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    }),
    [FORBIDDEN]: jsonContentOpenAPISchema({
      description: 'Forbidden',
      schema: errorOpenApiSchema
    })
  }
})
export type PostWorkoutPlan = typeof postWorkoutPlan

export const putWorkoutPlan = createRoute({
  method: 'put',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Update an existing workout plan',
      schema: patchWorkoutPlanSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated workout plan',
      schema: selectWorkoutPlanSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    }),
    [FORBIDDEN]: jsonContentOpenAPISchema({
      description: 'Forbidden',
      schema: errorOpenApiSchema
    })
  }
})
export type PutWorkoutPlan = typeof putWorkoutPlan

export const deleteWorkoutPlan = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Deleted workout plan',
      schema: selectWorkoutPlanSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid UUID',
      schema: errorOpenApiSchema
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    }),
    [FORBIDDEN]: jsonContentOpenAPISchema({
      description: 'Forbidden',
      schema: errorOpenApiSchema
    })
  }
})
export type DeleteWorkoutPlan = typeof deleteWorkoutPlan
