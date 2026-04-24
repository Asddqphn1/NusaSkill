-- Add new foreign key column on user profiles.
ALTER TABLE "user_profiles"
ADD COLUMN "target_career_id" TEXT;

-- Backfill Career entries from legacy target_career text values.
INSERT INTO "Career" ("id", "name", "description")
SELECT
  CONCAT('legacy_', MD5(LOWER(src."target_career"))),
  src."target_career",
  NULL
FROM (
  SELECT DISTINCT "target_career"
  FROM "user_profiles"
  WHERE "target_career" IS NOT NULL
    AND BTRIM("target_career") <> ''
) AS src
LEFT JOIN "Career" c
  ON LOWER(c."name") = LOWER(src."target_career")
WHERE c."id" IS NULL;

-- Map each profile's legacy target_career text to the corresponding Career id.
UPDATE "user_profiles" up
SET "target_career_id" = c."id"
FROM "Career" c
WHERE up."target_career" IS NOT NULL
  AND LOWER(c."name") = LOWER(up."target_career");

-- Add relation and lookup index.
ALTER TABLE "user_profiles"
ADD CONSTRAINT "user_profiles_target_career_id_fkey"
FOREIGN KEY ("target_career_id") REFERENCES "Career"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "user_profiles_target_career_id_idx"
ON "user_profiles"("target_career_id");

-- Remove legacy column and unused implicit relation table.
ALTER TABLE "user_profiles"
DROP COLUMN "target_career";

DROP TABLE IF EXISTS "_CareerToUser";
