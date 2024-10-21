import type { NotFoundHandler } from 'hono'
import { NOT_FOUND } from '~/utils/httpCodes'

export const notFound: NotFoundHandler = c => {
  return c.json(
    {
      message: 'Not found',
      path: c.req.path
    },
    NOT_FOUND
  )
}
