import { createRoute, z } from '@hono/zod-openapi'
import { selectWorkoutWithExercisesSchema } from '~/lib/dbSchema/workout'
import { selectWorkoutPlanSchema } from '~/lib/dbSchema/workoutPlan'
import { authMiddleware } from '~/middleware/auth'
import { OK, UNAUTHORIZED } from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['User Workouts']

const getUserTodayWorkoutPlanSchema = z.object({
  workout: selectWorkoutWithExercisesSchema,
  workoutPlan: selectWorkoutPlanSchema
})

export const getUserTodayWorkoutPlan = createRoute({
  method: 'get',
  path: '/today',
  tags,
  security: [{ cookieAuth: [] }],
  middleware: [authMiddleware] as const,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved today workouts',
      schema: getUserTodayWorkoutPlanSchema.array()
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Unauthorized'
    })
  }
})
export type GetUserTodayWorkoutPlan = typeof getUserTodayWorkoutPlan
