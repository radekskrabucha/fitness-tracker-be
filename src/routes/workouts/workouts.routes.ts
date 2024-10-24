import { createRoute } from '@hono/zod-openapi'
import {
  selectWorkoutSchema,
  insertWorkoutSchema,
  patchWorkoutSchema
} from '~/lib/dbSchema/workout'
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
  paramIdUUIDSchema,
  zodErrorOpenApiSchema
} from '~/utils/schemas'

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
      schema: selectWorkoutSchema.openapi('Workout').array()
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
  middleware: [authMiddleware],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved workout',
      schema: selectWorkoutSchema
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
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type CreateWorkout = typeof createWorkout

export const updateWorkout = createRoute({
  method: 'put',
  path: '/{id}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type UpdateWorkout = typeof updateWorkout

export const deleteWorkout = createRoute({
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
      description: 'Deleted workout',
      schema: selectWorkoutSchema
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
export type DeleteWorkout = typeof deleteWorkout
