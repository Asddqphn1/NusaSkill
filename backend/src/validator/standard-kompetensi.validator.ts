import { z } from 'zod'
import type { Prisma } from '../../generated/prisma/client'

const jsonValueSchema = z.custom<Prisma.InputJsonValue>()
const nullableString = z.string().min(1).nullable().optional()

export const createStandardKompetensiSchema = z.object({
  kodeUnit: z.string().min(1),
  judulKopetensi: z.string().min(1),
  deskripsiUnit: nullableString,
  pengetahuan: jsonValueSchema.nullable().optional(),
  keterampilan: jsonValueSchema.nullable().optional(),
  elemenKompetensi: jsonValueSchema.nullable().optional(),
  kriteriaUnjukKerja: jsonValueSchema.nullable().optional(),
  sumberStandar: nullableString,
})

export const updateStandardKompetensiSchema = createStandardKompetensiSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required',
  })

export type CreateStandardKompetensiInput = z.infer<typeof createStandardKompetensiSchema>
export type UpdateStandardKompetensiInput = z.infer<typeof updateStandardKompetensiSchema>