import { createRoute, z } from '@hono/zod-openapi'
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY
} from '~/utils/httpCodes'
import { errorOpenApiSchema, jsonContentOpenAPISchema } from '~/utils/schemas'

const tags = ['Auth']

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  emailVerified: z.boolean(),
  image: z.string().optional()
})

const sessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional()
})

export const signInEmail = createRoute({
  method: 'post',
  path: '/auth/sign-in/email',
  tags,
  request: {
    body: jsonContentOpenAPISchema({
      schema: z.object({
        email: z.string().email(),
        password: z.string(),
        callbackURL: z.string().optional(),
        dontRememberMe: z.boolean().default(false).optional()
      }),
      description: 'Sign in with email',
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: z.object({
        user: userSchema,
        session: sessionSchema,
        redirect: z.boolean(),
        url: z.string()
      }),
      description: 'Login successful'
    }),
    [UNAUTHORIZED]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid credentials'
    }),
    [BAD_REQUEST]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [INTERNAL_SERVER_ERROR]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Internal server error'
    }),
    [FORBIDDEN]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Forbidden'
    })
  }
})

export const signUpEmail = createRoute({
  method: 'post',
  path: '/auth/sign-up/email',
  tags,
  request: {
    body: jsonContentOpenAPISchema({
      schema: z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
        callbackURL: z.string().optional(),
        image: z.string().optional()
      }),
      description: 'Sign up with email',
      required: true
    }),
    query: z.object({
      currentURL: z.string().optional()
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: z.object({
        user: userSchema,
        session: sessionSchema,
        redirect: z.boolean().optional(),
        url: z.string().optional()
      }),
      description: 'Sign up successful'
    }),
    [BAD_REQUEST]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [UNPROCESSABLE_ENTITY]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'User already exists'
    })
  }
})

export const signOut = createRoute({
  method: 'post',
  path: '/auth/sign-out',
  tags,
  security: [{ cookieAuth: [] }],
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: z.object({
        success: z.literal(true)
      }),
      description: 'Sign out successful'
    }),
    [BAD_REQUEST]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})

export const changePassword = createRoute({
  method: 'post',
  path: '/auth/user/change-password',
  tags,
  security: [{ cookieAuth: [] }],
  request: {
    body: jsonContentOpenAPISchema({
      schema: z.object({
        newPassword: z.string(),
        currentPassword: z.string(),
        revokeOtherSessions: z.boolean().optional()
      }),
      description: 'Change password',
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: userSchema,
      description: 'Change password successful'
    }),
    [BAD_REQUEST]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    }),
    [INTERNAL_SERVER_ERROR]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Internal server error'
    })
  }
})

export const updateUser = createRoute({
  method: 'post',
  path: '/auth/user/update',
  tags,
  security: [{ cookieAuth: [] }],
  request: {
    body: jsonContentOpenAPISchema({
      schema: z.object({
        name: z.string().optional(),
        image: z.string().optional()
      }),
      description: 'Update user',
      required: true
    })
  },
  responses: {
    [OK]: jsonContentOpenAPISchema({
      schema: z.object({
        user: userSchema
      }),
      description: 'Update user successful'
    })
  }
})

export const deleteUser = createRoute({
  method: 'post',
  path: '/auth/user/delete',
  tags,
  security: [{ cookieAuth: [] }],
  request: {
    body: jsonContentOpenAPISchema({
      schema: z.object({
        password: z.string()
      }),
      description: 'Update user',
      required: true
    })
  },
  responses: {
    [OK]: {
      description: 'Delete user successful'
    },
    [BAD_REQUEST]: jsonContentOpenAPISchema({
      schema: errorOpenApiSchema,
      description: 'Invalid request'
    })
  }
})
