import { swaggerUI } from '@hono/swagger-ui'
import type { AppOpenApi } from '~/types/app'
import packageJson from '../../package.json' with { type: "json" }
import {
  changePassword,
  deleteUser,
  signOut,
  signUpEmail,
  signInEmail,
  updateUser
} from './authOpenApi'

export const configureOpenApi = (app: AppOpenApi) => {
  // The OpenAPI documentation will be available at /api/doc
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: packageJson.version,
      title: packageJson.name
    }
  })
  app.get('/swagger', swaggerUI({ url: '/api/doc' }))

  app.openAPIRegistry.registerComponent('securitySchemes', 'Cookie', {
    type: 'apiKey',
    in: 'cookie',
    name: 'better-auth.session_token'
  })

  app.openAPIRegistry.registerPath(signInEmail)
  app.openAPIRegistry.registerPath(signUpEmail)
  app.openAPIRegistry.registerPath(signOut)
  app.openAPIRegistry.registerPath(changePassword)
  app.openAPIRegistry.registerPath(updateUser)
  app.openAPIRegistry.registerPath(deleteUser)
}
