import { Hono } from "hono";
import { requireAuth, type AuthVariables } from "../middleware/require-auth";
import { findProgressByProfileId } from "../repositories/user-progress-jrs.repository";
import { findUserProfileById } from "../repositories/user-profile.repository";

export const progressJRSRoutes = new Hono<{ Variables: AuthVariables }>();

// Terapkan middleware JWT
progressJRSRoutes.use("*", requireAuth);

// GET /progress-jrs/profile/:profileId — Fetch JRS history for Impact Projection graph
progressJRSRoutes.get("/profile/:profileId", async (c) => {
  try {
    const profileId = Number(c.req.param("profileId"));
    if (!Number.isInteger(profileId) || profileId <= 0) {
      return c.json({ message: "Invalid profile id" }, 400);
    }

    const userId = c.get("userId");
    const profile = await findUserProfileById(profileId);
    if (!profile || profile.userId !== userId) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const progressHistory = await findProgressByProfileId(profileId);
    return c.json({ data: progressHistory });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ message }, 500);
  }
});
