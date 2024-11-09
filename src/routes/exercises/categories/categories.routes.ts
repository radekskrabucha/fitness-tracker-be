import { createRoute } from '@hono/zod-openapi'
import {
  insertExerciseCategorySchema,
  patchExerciseCategorySchema,
  selectExerciseCategorySchema
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
  jsonContentOpenAPISchema,
  paramIdUUIDSchema,
  errorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Exercise Categories']
const adminTags = withAdminTag(tags)

export const getExerciseCategories = createRoute({
  method: 'get',
  path: '/',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercise categories',
      schema: selectExerciseCategorySchema.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      description: 'Unauthorized',
      schema: errorOpenApiSchema
    })
  }
})
export type GetExerciseCategories = typeof getExerciseCategories

export const getExerciseCategory = createRoute({
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
      description: 'Exercise category details',
      schema: selectExerciseCategorySchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise category not found',
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
export type GetExerciseCategory = typeof getExerciseCategory

export const createExerciseCategory = createRoute({
  method: 'post',
  path: '/',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Exercise category to create',
      schema: insertExerciseCategorySchema
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created exercise category',
      schema: selectExerciseCategorySchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
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
export type CreateExerciseCategory = typeof createExerciseCategory

export const updateExerciseCategory = createRoute({
  method: 'put',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware] as const,
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Updated exercise category data',
      schema: patchExerciseCategorySchema
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated exercise category',
      schema: selectExerciseCategorySchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise category not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
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
export type UpdateExerciseCategory = typeof updateExerciseCategory

export const deleteExerciseCategory = createRoute({
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
      description: 'Deleted exercise category',
      schema: selectExerciseCategorySchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise category not found',
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
export type DeleteExerciseCategory = typeof deleteExerciseCategory
