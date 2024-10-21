import { config } from 'dotenv'
import path from 'node:path'
import { z } from 'zod'

config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  )
})

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(4000),
  LOG_LEVEL: z.enum([
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
    'silent'
  ]),
  DATABASE_URL: z.string()
})

export type Env = z.infer<typeof EnvSchema>

export let env: Env

try {
  env = EnvSchema.parse(process.env)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Invalid environment variables')
    console.error(error.flatten().fieldErrors)
    process.exit(1)
  }
}
