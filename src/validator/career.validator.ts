import { z } from "zod";

const nullableString = z.string().min(1).nullable().optional();

export const createCareerSchema = z.object({
  name: z.string().min(1),
  description: nullableString,
  competencyIds: z.array(z.number().int().positive()).optional(),
});

export const updateCareerSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: nullableString,
    competencyIds: z.array(z.number().int().positive()).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export type CreateCareerInput = z.infer<typeof createCareerSchema>;
export type UpdateCareerInput = z.infer<typeof updateCareerSchema>;
