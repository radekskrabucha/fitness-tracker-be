import { createRoute } from '@hono/zod-openapi'
import {
  selectWorkoutSchema,
  selectWorkoutWithExercisesSchema,
  selectWorkoutWithDetailedExercisesSchema,
  insertWorkoutSchema,
  patchWorkoutSchema
} from '~/lib/dbSchema/workout'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import {
  FORBIDDEN,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  zodErrorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Workouts']
const adminTags = withAdminTag(tags)

export const listWorkouts = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of user workouts',
      schema: selectWorkoutWithExercisesSchema.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type ListWorkouts = typeof listWorkouts

export const getWorkout = createRoute({
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
      description: 'Retrieved workout',
      schema: selectWorkoutWithDetailedExercisesSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})

export type GetWorkout = typeof getWorkout

export const createWorkout = createRoute({
  method: 'post',
  path: '/',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a new workout',
      schema: insertWorkoutSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout',
      schema: selectWorkoutSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
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
export type CreateWorkout = typeof createWorkout

export const updateWorkout = createRoute({
  method: 'put',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Update a workout',
      schema: patchWorkoutSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated workout',
      schema: selectWorkoutSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
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
export type UpdateWorkout = typeof updateWorkout

export const deleteWorkout = createRoute({
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
      description: 'Deleted workout',
      schema: selectWorkoutSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout not found'
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
export type DeleteWorkout = typeof deleteWorkout
