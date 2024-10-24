import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { db } from '~/db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    generateId: false
  }),
  plugins: [admin()],
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
