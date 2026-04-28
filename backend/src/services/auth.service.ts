import { createUser, findPublicUserById, findUserByEmail } from '../repositories/user.repository'
import { createAccessToken } from './jwt.service'
import { hashPassword, verifyPassword } from './password.service'

type AuthStatusCode = 401 | 404 | 409

export class AuthError extends Error {
  status: AuthStatusCode

  constructor(message: string, status: AuthStatusCode) {
    super(message)
    this.status = status
  }
}

export async function registerUser(email: string, password: string) {
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new AuthError('Email already registered', 409)
  }

  const newUser = await createUser(email, hashPassword(password))
  const token = await createAccessToken(newUser.id, newUser.email)

  return {
    message: 'Register success',
    token,
    user: newUser,
  }
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  if (!user || !verifyPassword(password, user.password)) {
    throw new AuthError('Invalid email or password', 401)
  }

  const token = await createAccessToken(user.id, user.email)

  return {
    message: 'Login success',
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  }
}

export async function getCurrentUser(userId: number) {
  const user = await findPublicUserById(userId)
  if (!user) {
    throw new AuthError('User not found', 404)
  }

  return { user }
}
