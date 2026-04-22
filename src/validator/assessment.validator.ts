import { z } from "zod";

export const generateAssessmentSchema = z.object({
  profileId: z.number().int().positive(),
});

// Skema untuk jawaban user.
// Asumsinya user mengirimkan array berisi index jawaban yang mereka pilih (0-3).
export const submitAssessmentSchema = z.object({
  answers: z
    .array(z.number().int().min(0).max(3))
    .min(1, "Jawaban tidak boleh kosong"),
});

export type GenerateAssessmentInput = z.infer<typeof generateAssessmentSchema>;
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;
