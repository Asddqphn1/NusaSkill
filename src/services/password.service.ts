import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expectedHash] = stored.split(':')
  if (!salt || !expectedHash) {
    return false
  }

  const expectedHashBuffer = Buffer.from(expectedHash, 'hex')
  const currentHashBuffer = scryptSync(password, salt, 64)

  if (expectedHashBuffer.length !== currentHashBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedHashBuffer, currentHashBuffer)
}
