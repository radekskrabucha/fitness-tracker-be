import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'
import type { SelectSession, SelectUser } from '~/db/schema/auth.schema'

export type AppBindings = {
  Variables: {
    logger: PinoLogger
    user: SelectUser
    session: SelectSession
  }
}

export type AppOpenApi = OpenAPIHono<AppBindings>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>
