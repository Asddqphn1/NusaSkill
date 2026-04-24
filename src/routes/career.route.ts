import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/require-auth";
import {
  CareerError,
  createCareerService,
  deleteCareerService,
  getCareer,
  listCareers,
  updateCareerService,
} from "../services/career.service";
import {
  createCareerSchema,
  updateCareerSchema,
} from "../validator/career.validator";

export const careerRoutes = new Hono<{ Variables: AuthVariables }>();

careerRoutes.use("*", requireAuth);

function parseCareerId(rawId: string) {
  const id = rawId.trim();
  if (!id) {
    return null;
  }
  return id;
}

careerRoutes.get("/", async (c) => {
  try {
    const careers = await listCareers();
    return c.json({ careers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

careerRoutes.get("/:id", async (c) => {
  try {
    const id = parseCareerId(c.req.param("id"));
    if (!id) {
      return c.json({ message: "Invalid career id" }, 400);
    }

    const result = await getCareer(id);
    return c.json(result);
  } catch (error) {
    if (error instanceof CareerError) {
      return c.json({ message: error.message }, error.status);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

careerRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createCareerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: "Invalid request body" }, 400);
    }

    const result = await createCareerService(parsed.data);
    return c.json(result);
  } catch (error) {
    if (error instanceof CareerError) {
      return c.json({ message: error.message }, error.status);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

careerRoutes.put("/:id", async (c) => {
  try {
    const id = parseCareerId(c.req.param("id"));
    if (!id) {
      return c.json({ message: "Invalid career id" }, 400);
    }

    const body = await c.req.json();
    const parsed = updateCareerSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ message: "Invalid request body" }, 400);
    }

    const result = await updateCareerService(id, parsed.data);
    return c.json(result);
  } catch (error) {
    if (error instanceof CareerError) {
      return c.json({ message: error.message }, error.status);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

careerRoutes.delete("/:id", async (c) => {
  try {
    const id = parseCareerId(c.req.param("id"));
    if (!id) {
      return c.json({ message: "Invalid career id" }, 400);
    }

    const result = await deleteCareerService(id);
    return c.json(result);
  } catch (error) {
    if (error instanceof CareerError) {
      return c.json({ message: error.message }, error.status);
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});
