import { createRoute, z } from '@hono/zod-openapi'
import {
  insertExerciseSchema,
  selectExerciseSchema,
  patchExerciseSchema,
  selectMuscleGroupSchema
} from '~/lib/dbSchema/exercise'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import { CREATED, OK, NOT_FOUND, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
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
  middleware: [authMiddleware],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises',
      schema: selectExerciseSchema.openapi('Exercise').array()
    })
  }
})
export type GetExercises = typeof getExercises

export const getExerciseById = createRoute({
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
      description: 'Exercise details',
      schema: z.object({
        exercise: selectExerciseSchema.openapi('Exercise'),
        muscleGroups: z.array(selectMuscleGroupSchema)
      })
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      description: 'Exercise not found',
      schema: errorOpenApiSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid UUID',
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
  middleware: [authMiddleware, adminMiddleware],
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Exercise to create',
      schema: insertExerciseSchema
    })
  },
  responses: {
    [CREATED]: jsonContentOpenAPISchema({
      description: 'Created exercise',
      schema: selectExerciseSchema
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      description: 'Invalid input',
      schema: zodErrorOpenApiSchema
    })
  }
})
export type CreateExercise = typeof createExercise

export const updateExercise = createRoute({
  method: 'put',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware],
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
    })
  }
})
export type UpdateExercise = typeof updateExercise

export const deleteExercise = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware],
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
    })
  }
})
export type DeleteExercise = typeof deleteExercise
