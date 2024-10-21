import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { env } from '~/utils/env'
import { account, session, user, verification } from './schema/auth.schema'

const sql = neon(env.DATABASE_URL)
export const db = drizzle(sql, {
  schema: {
    user,
    session,
    account,
    verification
  }
})
