import { createMiddleware } from 'hono/factory'
import { UNAUTHORIZED, FORBIDDEN } from '~/utils/httpCodes'
import type { AppBindingsWithAuth } from './auth'

export const adminMiddleware = createMiddleware<AppBindingsWithAuth>(
  async (c, next) => {
    const user = c.get('user')

    if (!user) {
      return c.json(
        {
          message: 'Unauthorized'
        },
        UNAUTHORIZED
      )
    }

    if (user.role !== 'admin') {
      return c.json(
        {
          message: 'Forbidden'
        },
        FORBIDDEN
      )
    }

    return next()
  }
)
