import {
  createStandardKompetensi,
  deleteStandardKompetensiById,
  findAllStandardKompetensi,
  findStandardKompetensiById,
  findStandardKompetensiByKodeUnit,
  updateStandardKompetensiById,
} from '../repositories/standard-kompetensi.repository'
import type {
  CreateStandardKompetensiInput,
  UpdateStandardKompetensiInput,
} from '../validator/standard-kompetensi.validator'

type StandardKompetensiStatusCode = 404 | 409

export class StandardKompetensiError extends Error {
  status: StandardKompetensiStatusCode

  constructor(message: string, status: StandardKompetensiStatusCode) {
    super(message)
    this.status = status
  }
}

async function getStandardKompetensiOrThrow(id: number) {
  const item = await findStandardKompetensiById(id)
  if (!item) {
    throw new StandardKompetensiError('Standar kompetensi not found', 404)
  }
  return item
}

export function listStandardKompetensi() {
  return findAllStandardKompetensi()
}

export async function getStandardKompetensi(id: number) {
  const standarKompetensi = await getStandardKompetensiOrThrow(id)
  return { standarKompetensi }
}

export async function createStandarKompetensi(data: CreateStandardKompetensiInput) {
  const existing = await findStandardKompetensiByKodeUnit(data.kodeUnit)
  if (existing) {
    throw new StandardKompetensiError('Kode unit already exists', 409)
  }

  const standarKompetensi = await createStandardKompetensi(data)
  return {
    message: 'Standar kompetensi created',
    standarKompetensi,
  }
}

export async function updateStandarKompetensi(id: number, data: UpdateStandardKompetensiInput) {
  await getStandardKompetensiOrThrow(id)

  if (data.kodeUnit) {
    const existing = await findStandardKompetensiByKodeUnit(data.kodeUnit)
    if (existing && existing.id !== id) {
      throw new StandardKompetensiError('Kode unit already exists', 409)
    }
  }

  const standarKompetensi = await updateStandardKompetensiById(id, data)
  return {
    message: 'Standar kompetensi updated',
    standarKompetensi,
  }
}

export async function deleteStandarKompetensi(id: number) {
  await getStandardKompetensiOrThrow(id)
  const standarKompetensi = await deleteStandardKompetensiById(id)

  return {
    message: 'Standar kompetensi deleted',
    standarKompetensi,
  }
}