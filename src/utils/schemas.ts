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

export const IdNumberSchema = (name: string) =>
  z.coerce
    .number()
    .positive()
    .openapi({
      param: {
        name,
        in: 'path'
      },
      example: 1
    })
export const paramIdNumberSchema = z.object({
  id: IdNumberSchema('id')
})

export const UUIDSchema = (name: string) =>
  z
    .string()
    .uuid()
    .openapi({
      param: {
        name,
        in: 'path'
      },
      example: '123e4567-e89b-12d3-a456-426614174000'
    })
export const paramIdUUIDSchema = z.object({
  id: UUIDSchema('id')
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

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({
      param: {
        name: 'page',
        in: 'query'
      },
      example: 1
    }),
  limit: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .openapi({
      param: {
        name: 'limit',
        in: 'query'
      },
      example: 10
    })
})

export type PaginationQuery = z.infer<typeof paginationSchema>

export const paginationMetaSchema = z
  .object({
    total: z.number().int().positive(),
    limit: z.number().int().positive(),
    offset: z.number().int().positive(),
    page: z.number().int().positive()
  })
  .optional()

export const withPaginationMeta = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    data: schema,
    meta: paginationMetaSchema
  })
