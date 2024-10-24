import { createRoute } from '@hono/zod-openapi'
import { selectWorkoutPlanWorkoutSchema } from '~/db/schema/workout-plan.schema'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
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
