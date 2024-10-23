import { serve } from '@hono/node-server'
import { createApp } from '~/lib/createApp'
import { configureOpenApi } from '~/lib/openApi'
import { exercisesRouter } from '~/routes/exercises'
import { profileRouter } from '~/routes/profile'
import { env } from '~/utils/env'

export const app = createApp()

configureOpenApi(app)

app.route('/profile', profileRouter)
app.route('/exercises', exercisesRouter)

serve({
  fetch: app.fetch,
  port: env.PORT
})

console.log(`Server is running on port ${env.PORT}`)
