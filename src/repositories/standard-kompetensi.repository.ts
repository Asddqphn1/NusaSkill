import { prisma } from '../db'
import { Prisma } from '../../generated/prisma/client'
import type {
  CreateStandardKompetensiInput,
  UpdateStandardKompetensiInput,
} from '../validator/standard-kompetensi.validator'

const standardKompetensiSelect = {
  id: true,
  kodeUnit: true,
  judulKopetensi: true,
  deskripsiUnit: true,
  pengetahuan: true,
  keterampilan: true,
  elemenKompetensi: true,
  kriteriaUnjukKerja: true,
  sumberStandar: true,
} as const

function normalizeNullableJson(value: Prisma.InputJsonValue | null | undefined) {
  if (value === null) {
    return Prisma.JsonNull
  }
  return value
}

function mapCreateData(data: CreateStandardKompetensiInput): Prisma.StandardKompetensiCreateInput {
  return {
    ...data,
    pengetahuan: normalizeNullableJson(data.pengetahuan),
    keterampilan: normalizeNullableJson(data.keterampilan),
    elemenKompetensi: normalizeNullableJson(data.elemenKompetensi),
    kriteriaUnjukKerja: normalizeNullableJson(data.kriteriaUnjukKerja),
  }
}

function mapUpdateData(data: UpdateStandardKompetensiInput): Prisma.StandardKompetensiUpdateInput {
  return {
    ...data,
    pengetahuan: normalizeNullableJson(data.pengetahuan),
    keterampilan: normalizeNullableJson(data.keterampilan),
    elemenKompetensi: normalizeNullableJson(data.elemenKompetensi),
    kriteriaUnjukKerja: normalizeNullableJson(data.kriteriaUnjukKerja),
  }
}

export function findStandardKompetensiById(id: number) {
  return prisma.standardKompetensi.findUnique({
    where: { id },
    select: standardKompetensiSelect,
  })
}

export function findStandardKompetensiByKodeUnit(kodeUnit: string) {
  return prisma.standardKompetensi.findUnique({
    where: { kodeUnit },
    select: standardKompetensiSelect,
  })
}

export function findAllStandardKompetensi() {
  return prisma.standardKompetensi.findMany({
    select: standardKompetensiSelect,
    orderBy: { id: 'desc' },
  })
}

export function createStandardKompetensi(data: CreateStandardKompetensiInput) {
  return prisma.standardKompetensi.create({
    data: mapCreateData(data),
    select: standardKompetensiSelect,
  })
}

export function updateStandardKompetensiById(id: number, data: UpdateStandardKompetensiInput) {
  return prisma.standardKompetensi.update({
    where: { id },
    data: mapUpdateData(data),
    select: standardKompetensiSelect,
  })
}

export function deleteStandardKompetensiById(id: number) {
  return prisma.standardKompetensi.delete({
    where: { id },
    select: standardKompetensiSelect,
  })
}