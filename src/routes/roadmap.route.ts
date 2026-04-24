import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/require-auth";
import { findRoadmapById, findRoadmapsByProfileId } from "../repositories/roadmap.repository";
import { findUserProfileById } from "../repositories/user-profile.repository";

export const roadmapRoutes = new Hono<{ Variables: AuthVariables }>();

// Terapkan middleware JWT
roadmapRoutes.use("*", requireAuth);

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

// GET /roadmaps/profile/:profileId — Fetch all roadmaps for a profile
roadmapRoutes.get("/profile/:profileId", async (c) => {
  try {
    const profileId = parseId(c.req.param("profileId"));
    if (!profileId) return c.json({ message: "Invalid profile id" }, 400);

    const userId = c.get("userId");
    const profile = await findUserProfileById(profileId);
    if (!profile || profile.userId !== userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const roadmaps = await findRoadmapsByProfileId(profileId);
    return c.json({ data: roadmaps });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});

// GET /roadmaps/:id — Fetch a specific roadmap by ID
roadmapRoutes.get("/:id", async (c) => {
  try {
    const roadmapId = parseId(c.req.param("id"));
    if (!roadmapId) return c.json({ message: "Invalid roadmap id" }, 400);

    const userId = c.get("userId");
    const roadmap = await findRoadmapById(roadmapId);
    if (!roadmap) return c.json({ message: "Roadmap not found" }, 404);

    // Validate ownership through the profile
    const profile = await findUserProfileById(roadmap.profileId);
    if (!profile || profile.userId !== userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json({ data: roadmap });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});
