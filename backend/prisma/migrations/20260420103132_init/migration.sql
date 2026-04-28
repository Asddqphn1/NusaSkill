-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standard_kompetensi" (
    "id" SERIAL NOT NULL,
    "kode_unit" VARCHAR(100) NOT NULL,
    "judul_kopetensi" VARCHAR(255) NOT NULL,
    "deskripsi_unit" TEXT,
    "pengetahuan" JSONB,
    "keterampilan" JSONB,
    "elemen_kompetensi" JSONB,
    "kriteria_unjuk_kerja" JSONB,
    "sumber_standar" VARCHAR(255),

    CONSTRAINT "standard_kompetensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "nama" VARCHAR(255) NOT NULL,
    "lokasi" VARCHAR(255),
    "pendidikan_terakhir" VARCHAR(100),
    "waktu_belajar_jam" INTEGER,
    "level_kemampuan" VARCHAR(50),
    "target_career" VARCHAR(255),

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "questions_json" JSONB,
    "user_answers_json" JSONB,
    "gap_analysis_result" TEXT,
    "score_summary" REAL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_roadmaps" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "roadmap_syntax" TEXT,
    "total_nodes" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "standard_kompetensi_kode_unit_key" ON "standard_kompetensi"("kode_unit");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_roadmaps" ADD CONSTRAINT "learning_roadmaps_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_roadmaps" ADD CONSTRAINT "learning_roadmaps_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
