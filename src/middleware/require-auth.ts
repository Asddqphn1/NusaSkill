import type { MiddlewareHandler } from 'hono'
import { extractBearerToken, verifyAccessToken } from '../services/jwt.service'

export type AuthVariables = {
  userId: number
}

export const requireAuth: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  try {
    const token = extractBearerToken(c.req.header('Authorization'))
    if (!token) {
      return c.json({ message: 'Missing bearer token' }, 401)
    }

    const userId = await verifyAccessToken(token)
    c.set('userId', userId)
    await next()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unauthorized'
    return c.json({ message }, 401)
  }
}
