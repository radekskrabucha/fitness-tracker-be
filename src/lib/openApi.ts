import { swaggerUI } from '@hono/swagger-ui'
import type { AppOpenApi } from '~/types/app'
import packageJson from '../../package.json' with { type: "json" }

export const configureOpenApi = (app: AppOpenApi) => {
  // The OpenAPI documentation will be available at /doc
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJson.version,
      title: packageJson.name
    }
  })
  app.get('/swagger', swaggerUI({ url: '/api/doc' }))
}
