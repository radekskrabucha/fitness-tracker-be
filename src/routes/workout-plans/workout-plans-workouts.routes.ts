import { createRoute } from '@hono/zod-openapi'
import {
  selectWorkoutPlanWorkoutSchema,
  insertWorkoutPlanWorkoutSchema
} from '~/db/schema/workout-plan.schema'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'
import { paramIdUUIDSchema } from '~/utils/schemas'

const tags = ['Workout Plan Exercises']

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
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware],
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
