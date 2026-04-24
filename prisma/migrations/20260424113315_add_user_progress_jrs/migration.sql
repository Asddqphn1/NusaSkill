-- CreateTable
CREATE TABLE "user_progress_jrs" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "jrs_score" REAL NOT NULL,
    "passed_kuk" INTEGER NOT NULL,
    "total_kuk" INTEGER NOT NULL,
    "career_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_progress_jrs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_progress_jrs" ADD CONSTRAINT "user_progress_jrs_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
