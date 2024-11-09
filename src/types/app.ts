import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { PinoLogger } from 'hono-pino'
import type { AppBindingsWithAuth } from '~/middleware/auth'

export type AppBindings = {
  Variables: {
    logger: PinoLogger
  }
}

export type AppOpenApi = OpenAPIHono<AppBindings>

export type AppRouteHandler<R extends RouteConfig, E extends AppBindings = AppBindings> = RouteHandler<
  R,
  E
>

export type AppRouteHandlerWithAuth<R extends RouteConfig> = AppRouteHandler<
  R,
  AppBindingsWithAuth
>
