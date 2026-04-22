import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { PrismaPg } from '@prisma/adapter-pg'
import { Prisma, PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL
const schema = process.env.DB_SCHEMA ?? 'joko'

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env')
}

const adapter = new PrismaPg({ connectionString }, { schema })
const prisma = new PrismaClient({ adapter })

type SeedItem = {
  kodeUnit: string
  judulKopetensi: string
  deskripsiUnit: string | null
  pengetahuan: Prisma.InputJsonValue | null
  keterampilan: Prisma.InputJsonValue | null
  elemenKompetensi: Prisma.InputJsonValue | null
  kriteriaUnjukKerja: Prisma.InputJsonValue | null
  sumberStandar: string | null
}

function asNullableJson(value: Prisma.InputJsonValue | null) {
  return value === null ? Prisma.JsonNull : value
}

async function readSeedItemsFromFile() {
  const seedPath = fileURLToPath(new URL('./seeds/standard-kompetensi.seed.json', import.meta.url))
  const raw = await readFile(seedPath, 'utf-8')
  return JSON.parse(raw) as SeedItem[]
}

async function main() {
  const items = await readSeedItemsFromFile()

  if (items.length === 0) {
    console.log('No data in seed file. Nothing to seed.')
    return
  }

  let inserted = 0
  let updated = 0

  for (const item of items) {
    const existing = await prisma.standardKompetensi.findUnique({
      where: { kodeUnit: item.kodeUnit },
      select: { id: true },
    })

    await prisma.standardKompetensi.upsert({
      where: { kodeUnit: item.kodeUnit },
      update: {
        judulKopetensi: item.judulKopetensi,
        deskripsiUnit: item.deskripsiUnit,
        pengetahuan: asNullableJson(item.pengetahuan),
        keterampilan: asNullableJson(item.keterampilan),
        elemenKompetensi: asNullableJson(item.elemenKompetensi),
        kriteriaUnjukKerja: asNullableJson(item.kriteriaUnjukKerja),
        sumberStandar: item.sumberStandar,
      },
      create: {
        kodeUnit: item.kodeUnit,
        judulKopetensi: item.judulKopetensi,
        deskripsiUnit: item.deskripsiUnit,
        pengetahuan: asNullableJson(item.pengetahuan),
        keterampilan: asNullableJson(item.keterampilan),
        elemenKompetensi: asNullableJson(item.elemenKompetensi),
        kriteriaUnjukKerja: asNullableJson(item.kriteriaUnjukKerja),
        sumberStandar: item.sumberStandar,
      },
    })

    if (existing) {
      updated += 1
    } else {
      inserted += 1
    }
  }

  console.log(`Seed complete. inserted=${inserted}, updated=${updated}, total=${items.length}`)
}

main()
  .catch((error) => {
    console.error('Standard kompetensi seeding failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })