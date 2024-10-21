import type { ZodError } from 'zod'

export const formatZodError = (error: ZodError) =>
  error.errors
    .map(err => {
      const path = err.path.join(' > ') || 'root'
      return `Error at "${path}": ${err.message}`
    })
    .join('\n')
