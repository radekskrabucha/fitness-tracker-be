import { createMiddleware } from 'hono/factory'
import { auth } from '~/lib/auth'
import type { AppBindings } from '~/types/app'
import { UNAUTHORIZED } from '~/utils/httpCodes'

export type SessionResponse = Awaited<ReturnType<typeof auth.api.getSession>>
export type SessionResponseNonNull = Exclude<SessionResponse, null>
// we have to omit these fields because hono-zod-openapi
// is losing the type information
export type User = Omit<
  SessionResponseNonNull['user'],
  'createdAt' | 'updatedAt'
>
export type Session = Omit<
  SessionResponseNonNull['session'],
  'expiresAt' | 'createdAt' | 'updatedAt'
>

export type AppBindingsWithAuth = {
  Variables: {
    user: User
    session: Session
  }
} & AppBindings

export const authMiddleware = createMiddleware<AppBindingsWithAuth>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session) {
      return c.json({ message: 'Unauthorized' }, UNAUTHORIZED)
    }

    c.set('user', session.user)
    c.set('session', session.session)

    return next()
  }
)
