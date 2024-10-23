import { createRoute } from '@hono/zod-openapi'
import { z } from 'zod'
import {
  selectWorkoutExerciseSchema,
  insertWorkoutExerciseSchema,
  patchWorkoutExerciseSchema
} from '~/db/schema/workout.schema'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  CREATED,
  NOT_FOUND,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  zodErrorOpenApiSchema,
  paramIdUUIDSchema,
  UUIDSchema
} from '~/utils/schemas'

const tags = ['Workout Exercises']

export const getWorkoutExercises = createRoute({
  method: 'get',
  path: '/{id}/exercises',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises for the workout',
      schema: z.array(selectWorkoutExerciseSchema.openapi('Exercise'))
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
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
export type AddWorkoutExercise = typeof addWorkoutExercise

export const updateWorkoutExercise = createRoute({
  method: 'put',
  path: '/{id}/exercises/{exerciseId}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
    })
  }
})
export type UpdateWorkoutExercise = typeof updateWorkoutExercise

export const removeWorkoutExercise = createRoute({
  method: 'delete',
  path: '/{id}/exercises/{exerciseId}',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type RemoveWorkoutExercise = typeof removeWorkoutExercise
