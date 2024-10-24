import { createRoute } from '@hono/zod-openapi'
import {
  selectWorkoutPlanWorkoutSchema,
  insertWorkoutPlanWorkoutSchema,
  patchWorkoutPlanWorkoutSchema
} from '~/lib/dbSchema/workout-plan'
import { withAdminTag } from '~/lib/openApi'
import { adminMiddleware } from '~/middleware/admin'
import { authMiddleware } from '~/middleware/auth'
import {
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  NOT_FOUND
} from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'
import { paramIdUUIDSchema, UUIDSchema } from '~/utils/schemas'

const tags = ['Workout Plan Exercises']
const adminTags = withAdminTag(tags)

export const getWorkoutPlanWorkouts = createRoute({
  method: 'get',
  path: '/{id}/workouts',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
  request: {
    params: paramIdUUIDSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of workout plans',
      schema: selectWorkoutPlanWorkoutSchema
        .openapi('WorkoutPlan Excercise')
        .array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetWorkoutPlanWorkouts = typeof getWorkoutPlanWorkouts

export const postWorkoutPlanWorkout = createRoute({
  method: 'post',
  path: '/{id}/workouts',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: paramIdUUIDSchema,
    body: jsonContentOpenAPISchema({
      description: 'Create a new workout plan',
      schema: insertWorkoutPlanWorkoutSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Created workout plan',
      schema: selectWorkoutPlanWorkoutSchema
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
export type PostWorkoutPlanWorkout = typeof postWorkoutPlanWorkout

export const putWorkoutPlanWorkout = createRoute({
  method: 'put',
  path: '/{id}/workouts/{workoutId}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: paramIdUUIDSchema.extend({
      workoutId: UUIDSchema('workoutId')
    }),
    body: jsonContentOpenAPISchema({
      description: 'Update an existing workout plan',
      schema: patchWorkoutPlanWorkoutSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Updated workout plan',
      schema: selectWorkoutPlanWorkoutSchema
    }),
    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Workout plan not found'
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
export type PutWorkoutPlanWorkout = typeof putWorkoutPlanWorkout

export const deleteWorkoutPlanWorkout = createRoute({
  method: 'delete',
  path: '/{id}/workouts/{workoutId}',
  tags: adminTags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware, adminMiddleware],
  request: {
    params: paramIdUUIDSchema.extend({
      workoutId: UUIDSchema('workoutId')
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Deleted workout plan',
      schema: selectWorkoutPlanWorkoutSchema
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
export type DeleteWorkoutPlanWorkout = typeof deleteWorkoutPlanWorkout
