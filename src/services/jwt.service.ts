import { sign, verify } from 'hono/jwt'

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set in environment')
  }
  return jwtSecret
}

export async function createAccessToken(userId: number, email: string) {
  const payload = {
    sub: String(userId),
    email,
    exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
  }

  return sign(payload, getJwtSecret())
}

export function extractBearerToken(authHeader?: string) {
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }
  return authHeader.slice('Bearer '.length)
}

export async function verifyAccessToken(token: string) {
  const payload = (await verify(token, getJwtSecret(), 'HS256')) as { sub?: string }
  const userId = Number(payload.sub)

  if (!Number.isInteger(userId)) {
    throw new Error('Invalid token payload')
  }

  return userId
}
