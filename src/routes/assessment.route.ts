import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/require-auth";

import {
  generateAssessmentSchema,
  submitAssessmentSchema,
} from "../validator/assessment.validator";
import { AssessmentError, generatePreTest, submitPreTest } from "../services/assessment.service";

export const assessmentRoutes = new Hono<{ Variables: AuthVariables }>();

// Terapkan middleware JWT
assessmentRoutes.use("*", requireAuth);

function parseAssessmentId(rawId: string) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

assessmentRoutes.post("/generate", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = generateAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { message: "Invalid request body", errors: parsed.error.format() },
        400,
      );
    }

    const userId = c.get("userId");
    const result = await generatePreTest(userId, parsed.data.profileId);

    return c.json(result, 201);
  } catch (error) {
    if (error instanceof AssessmentError) {
      return c.json({ message: error.message }, error.status);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

assessmentRoutes.post("/:id/submit", async (c) => {
  try {
    const assessmentId = parseAssessmentId(c.req.param("id"));
    if (!assessmentId) return c.json({ message: "Invalid assessment id" }, 400);

    const body = await c.req.json();
    const parsed = submitAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { message: "Invalid request body", errors: parsed.error.format() },
        400,
      );
    }

    const userId = c.get("userId");
    const result = await submitPreTest(
      userId,
      assessmentId,
      parsed.data.answers,
    );

    return c.json(result);
  } catch (error) {
    if (error instanceof AssessmentError) {
      return c.json({ message: error.message }, error.status);
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});
