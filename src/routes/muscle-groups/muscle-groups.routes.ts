import { createRoute, z } from '@hono/zod-openapi'
import { selectMuscleGroupSchema } from '~/db/schema/exercise.schema'
import { OK } from '~/utils/httpCodes'
import { jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['Muscle Groups']

export const getMuscleGroups = createRoute({
  method: 'get',
  path: '/',
  tags,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'List of muscle groups',
      schema: z.array(selectMuscleGroupSchema.openapi('MuscleGroup'))
    })
  }
})
export type GetMuscleGroups = typeof getMuscleGroups
