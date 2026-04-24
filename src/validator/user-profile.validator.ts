import { z } from "zod";

const nullableString = z.string().min(1).nullable().optional();

export const createUserProfileSchema = z.object({
  nama: z.string().min(1),
  lokasi: nullableString,
  pendidikanTerakhir: nullableString,
  waktuBelajarJam: z.number().int().nonnegative().nullable().optional(),
  levelKemampuan: nullableString,
  targetCareerId: z.string().min(1),
});

export const updateUserProfileSchema = createUserProfileSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
