import { serve } from '@hono/node-server'
import { createApp } from '~/lib/createApp'
import { configureOpenApi } from '~/lib/openApi'
import { tasksRouter } from '~/routes/tasks'
import { env } from '~/utils/env'

export const app = createApp()

configureOpenApi(app)

app.route('/tasks', tasksRouter)

serve({
  fetch: app.fetch,
  port: env.PORT
})

console.log(`Server is running on port ${env.PORT}`)
