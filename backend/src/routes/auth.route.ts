import { Hono } from 'hono'
import { requireAuth, type AuthVariables } from '../middleware/require-auth'
import { AuthError, getCurrentUser, loginUser, registerUser } from '../services/auth.service'
import { authSchema } from '../validator/auth.validator'

export const authRoutes = new Hono<{ Variables: AuthVariables }>()

authRoutes.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = authSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const result = await registerUser(parsed.data.email, parsed.data.password)
    return c.json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

authRoutes.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const parsed = authSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ message: 'Invalid request body' }, 400)
    }

    const result = await loginUser(parsed.data.email, parsed.data.password)
    return c.json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})

authRoutes.get('/me', requireAuth, async (c) => {
  try {
    const userId = c.get('userId')
    const result = await getCurrentUser(userId)
    return c.json(result)
  } catch (error) {
    if (error instanceof AuthError) {
      return c.json({ message: error.message }, error.status)
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    return c.json({ message }, 500)
  }
})
