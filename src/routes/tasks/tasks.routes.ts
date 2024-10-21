import { createRoute, z } from '@hono/zod-openapi'
import {
  insertTaskSchema,
  patchTaskSchema,
  selectTaskSchema
} from '~/db/schema'
import { OK, NOT_FOUND, UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import {
  errorOpenApiSchema,
  jsonContentOpenAPISchema,
  paramIdNumberSchema,
  zodErrorOpenApiSchema
} from '~/utils/schemas'

const tags = ['Tasks']

export const getAllTasks = createRoute({
  method: 'get',
  path: '/',
  tags,
  responses: {
    [OK]: jsonContentOpenAPISchema({
      description: 'Retrieved tasks',
      schema: z.array(selectTaskSchema)
    })
  }
})
export type GetAllTasks = typeof getAllTasks

export const getTaskById = createRoute({
  method: 'get',
  path: '/{id}',
  tags,
  request: {
    params: paramIdNumberSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: selectTaskSchema.openapi('Task'),
      description: 'Retrieved task'
    }),

    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Task not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type GetTaskById = typeof getTaskById

export const createTask = createRoute({
  method: 'post',
  path: '/',
  tags,
  request: {
    body: jsonContentOpenAPISchema({
      description: 'Create a task',
      schema: insertTaskSchema,
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: selectTaskSchema,
      description: 'Created task'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type CreateTask = typeof createTask

export const updateTask = createRoute({
  method: 'patch',
  path: '/{id}',
  tags,
  request: {
    params: paramIdNumberSchema,

    body: jsonContentOpenAPISchema({
      schema: patchTaskSchema,
      description: 'Update a task',
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: selectTaskSchema,
      description: 'Updated task'
    }),

    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Task not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type UpdateTask = typeof updateTask

export const deleteTask = createRoute({
  method: 'delete',
  path: '/{id}',
  tags,
  request: {
    params: paramIdNumberSchema
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: selectTaskSchema,
      description: 'Deleted task'
    }),

    [NOT_FOUND]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Task not found'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: zodErrorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
export type DeleteTask = typeof deleteTask
