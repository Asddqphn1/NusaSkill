import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
const schema = process.env.DB_SCHEMA ?? 'joko'

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env')
}

const adapter = new PrismaPg({ connectionString }, { schema })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = `smoke-${Date.now()}@example.com`

  const user = await prisma.user.create({
    data: {
      email,
      password: '123456',
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  })

  const totalUsers = await prisma.user.count()

  console.log('Inserted user:', user)
  console.log('Total users:', totalUsers)
}

main()
  .catch((error) => {
    console.error('Prisma smoke test failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
