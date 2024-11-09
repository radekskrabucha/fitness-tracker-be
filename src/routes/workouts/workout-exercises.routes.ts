import { createRoute } from '@hono/zod-openapi'
import {
  selectWorkoutExerciseSchema,
  insertWorkoutExerciseSchema,
  patchWorkoutExerciseSchema
} from '~/lib/dbSchema/workout'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  CREATED,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  FORBIDDEN
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  zodErrorOpenApiSchema,
  paramIdUUIDSchema,
  UUIDSchema
} from '~/utils/schemas'

const tags = ['Workout Exercises']
const adminTags = withAdminTag(tags)

export const getWorkoutExercises = createRoute({
  method: 'get',
  path: '/{id}/exercises',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises for the workout',
      schema: selectWorkoutExerciseSchema.array()
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
export type GetWorkoutExercises = typeof getWorkoutExercises

export const addWorkoutExercise = createRoute({
  method: 'post',
  path: '/{id}/exercises',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Exercise to add to the workout',
      schema: insertWorkoutExerciseSchema,
      required: true
    })
  },
  responses: {
    [CREATED]: jsonContentOpenAPISchema({
      description: 'Exercise added to the workout',
      schema: selectWorkoutExerciseSchema
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
export type AddWorkoutExercise = typeof addWorkoutExercise

export const updateWorkoutExercise = createRoute({
  method: 'put',
  path: '/{id}/exercises/{exerciseId}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema.extend({
      exerciseId: UUIDSchema('exerciseId')
    }),
    body: jsonContentOpenAPISchema({
      description: 'Updated exercise details',
      schema: patchWorkoutExerciseSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated exercise in the workout',
      schema: selectWorkoutExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout or exercise not found'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    }),
    [FORBIDDEN]: jsonContentOpenAPISchema({
      description: 'Forbidden',
      schema: errorOpenApiSchema
    })
  }
})
export type UpdateWorkoutExercise = typeof updateWorkoutExercise

export const removeWorkoutExercise = createRoute({
  method: 'delete',
  path: '/{id}/exercises/{exerciseId}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema.extend({
      exerciseId: UUIDSchema('exerciseId')
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Exercise removed from the workout',
      schema: selectWorkoutExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout or exercise not found'
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
export type RemoveWorkoutExercise = typeof removeWorkoutExercise
