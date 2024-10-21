import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound } from '~/middleware/notFound'
import { onError } from '~/middleware/onError'
import { pinoLogger } from '~/middleware/pinoLogger'
import { serveEmojiFavicon } from '~/middleware/serveEmojiFavicon'
import type { AppBindings } from '~/types/app'
import { UNPROCESSABLE_ENTITY } from '~/utils/httpCodes'
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

  app.notFound(notFound)
  app.onError(onError)

  return app
}
