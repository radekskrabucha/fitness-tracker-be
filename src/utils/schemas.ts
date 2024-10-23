import { z } from '@hono/zod-openapi'

type JsonContentParams<T extends z.ZodType<NonNullable<unknown>>> = {
  schema: T
  description: string
  required?: boolean
}

export const jsonContentOpenAPISchema = <
  T extends z.ZodType<NonNullable<unknown>>
>({
  description,
  schema,
  required
}: JsonContentParams<T>) => {
  return {
    content: {
      'application/json': {
        schema
      }
    },
    description,
    required
  }
}

export const paramIdNumberSchema = z.object({
  id: z.coerce
    .number()
    .positive()
    .openapi({
      param: {
        name: 'id',
        in: 'path'
      },
      example: 1
    })
})

export const paramIdUUIDSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: {
        name: 'id',
        in: 'path'
      },
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
})

export const errorOpenApiSchema = z
  .object({
    message: z.string().openapi({
      example: 'Error message'
    })
  })
  .openapi('Error')

export const zodErrorOpenApiSchema = errorOpenApiSchema
  .merge(
    z.object({
      error: z.object({
        issues: z.array(
          z.object({
            code: z.string().openapi({
              example: 'issue code'
            }),
            expected: z.string().openapi({
              example: 'expected type'
            }),
            received: z.string().openapi({
              example: 'received type'
            }),
            path: z.array(z.string()).openapi({
              example: ['path', 'to', 'error']
            }),
            message: z.string().openapi({
              example: 'Error message'
            })
          })
        ),
        name: z.string().openapi({
          example: 'ZodError'
        })
      })
    })
  )
  .openapi('ZodError')
