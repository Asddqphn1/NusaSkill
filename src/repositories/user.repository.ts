import { prisma } from '../db'

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } })
}

export function createUser(email: string, password: string) {
  return prisma.user.create({
    data: {
      email,
      password,
    },
    select: {
      id: true,
      email: true,
    },
  })
}

export function findPublicUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  })
}
