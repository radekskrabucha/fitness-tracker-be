import { createRoute } from '@hono/zod-openapi'
import { z } from '@hono/zod-openapi'
import { selectExerciseSchema } from '~/db/schema/exercise.schema'
import { OK } from '~/utils/httpCodes'
import { jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['Exercises']

export const getExercises = createRoute({
  method: 'get',
  path: '/',
  tags,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of exercises',
      schema: z.array(selectExerciseSchema.openapi('Exercise'))
    })
  }
})

export type GetExercises = typeof getExercises
