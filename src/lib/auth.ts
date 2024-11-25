import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { db } from '~/db'
import { env } from '~/utils/env'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),
  advanced: {
    generateId: false
  },
  plugins: [admin()],
  trustedOrigins: [env.BETTER_AUTH_TRUSTED_ORIGINS],
  emailAndPassword: {
    enabled: true
  },
  user: {
    modelName: 'user',
    fields: {
      name: 'displayName'
    }
  }
})
