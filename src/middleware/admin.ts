import { createMiddleware } from 'hono/factory'
import type { AppBindings } from '~/types/app'
import { UNAUTHORIZED, FORBIDDEN } from '~/utils/httpCodes'

export const adminMiddleware = createMiddleware<AppBindings>(
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
