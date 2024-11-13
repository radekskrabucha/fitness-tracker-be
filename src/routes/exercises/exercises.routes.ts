import { createRoute } from '@hono/zod-openapi'
import {
  insertExerciseWithExtrasSchema,
  patchExerciseSchema,
  selectExerciseSchema,
  selectExerciseWithDetailsSchema
} from '~/lib/dbSchema/exercise'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  NOT_FOUND,
  UNPROCESSABLE_ENTITY,
  FORBIDDEN,
  UNAUTHORIZED
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  zodErrorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Exercises']
const adminTags = withAdminTag(tags)

export const getExercises = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises',
      schema: selectExerciseWithDetailsSchema.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    })
  }
})
export type GetExercises = typeof getExercises

export const getExerciseById = createRoute({
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
      description: 'Exercise details',
      schema: selectExerciseWithDetailsSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid UUID',
      schema: errorOpenApiSchema
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    })
  }
})
export type GetExerciseById = typeof getExerciseById

export const createExercise = createRoute({
  method: 'post',
  path: '/',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Exercise to create',
      schema: insertExerciseWithExtrasSchema
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created exercise',
      schema: selectExerciseSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
      schema: zodErrorOpenApiSchema
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
export type CreateExercise = typeof createExercise

export const updateExercise = createRoute({
  method: 'put',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Updated exercise data',
      schema: patchExerciseSchema
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated exercise',
      schema: selectExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
      schema: zodErrorOpenApiSchema
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
export type UpdateExercise = typeof updateExercise

export const deleteExercise = createRoute({
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
      description: 'Deleted exercise',
      schema: selectExerciseSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
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
export type DeleteExercise = typeof deleteExercise
