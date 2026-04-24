/*
  Warnings:

  - You are about to alter the column `kode_unit` on the `StandardKompetensi` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `judul_kompetensi` on the `StandardKompetensi` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `sumber_standar` on the `StandardKompetensi` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `roadmap_syntax` on the `learning_roadmaps` table. All the data in the column will be lost.
  - Added the required column `roadmap_data` to the `learning_roadmaps` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CareerCompetency" DROP CONSTRAINT "CareerCompetency_careerId_fkey";

-- DropForeignKey
ALTER TABLE "CareerCompetency" DROP CONSTRAINT "CareerCompetency_competencyId_fkey";

-- AlterTable
ALTER TABLE "StandardKompetensi" ALTER COLUMN "kode_unit" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "judul_kompetensi" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "deskripsi_unit" DROP NOT NULL,
ALTER COLUMN "pengetahuan" DROP NOT NULL,
ALTER COLUMN "keterampilan" DROP NOT NULL,
ALTER COLUMN "elemen_kompetensi" DROP NOT NULL,
ALTER COLUMN "kriteria_unjuk_kerja" DROP NOT NULL,
ALTER COLUMN "sumber_standar" DROP NOT NULL,
ALTER COLUMN "sumber_standar" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "learning_roadmaps" DROP COLUMN "roadmap_syntax",
ADD COLUMN     "completed_nodes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "roadmap_data" JSONB NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active';

-- AddForeignKey
ALTER TABLE "CareerCompetency" ADD CONSTRAINT "CareerCompetency_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerCompetency" ADD CONSTRAINT "CareerCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "StandardKompetensi"("id") ON DELETE CASCADE ON UPDATE CASCADE;
