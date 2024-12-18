import { defineConfig } from 'drizzle-kit'
import { env } from './src/utils/env'

export default defineConfig({
  schema: './src/db/schema/*.schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
})
