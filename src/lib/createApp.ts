import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { notFound } from '~/middleware/notFound'
import { onError } from '~/middleware/onError'
import { pinoLogger } from '~/middleware/pinoLogger'
import { serveEmojiFavicon } from '~/middleware/serveEmojiFavicon'
import type { AppBindings } from '~/types/app'
import { env } from '~/utils/env'
import { UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
import { auth } from './auth'
import { formatZodError } from './zod'

export const createRouter = () => {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            message: formatZodError(result.error),
            error: result.error
          },
          UNPROCESSABLE_ENTITY
        )
      }
    }
  })
}

export const createApp = () => {
  const app = createRouter().basePath('/api')

  app.use(pinoLogger())
  app.use(serveEmojiFavicon('⭐️'))

  app.use(
    '*',
    cors({
      origin: env.BETTER_AUTH_TRUSTED_ORIGINS,
      credentials: true
    })
  )

  app.on(['POST', 'GET'], '/auth/**', c => auth.handler(c.req.raw))

  app.notFound(notFound)
  app.onError(onError)

  return app
}
