/*
  Warnings:

  - You are about to drop the `standard_kompetensi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "standard_kompetensi";

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardKompetensi" (
    "id" SERIAL NOT NULL,
    "kode_unit" TEXT NOT NULL,
    "judul_kompetensi" TEXT NOT NULL,
    "deskripsi_unit" TEXT NOT NULL,
    "pengetahuan" JSONB NOT NULL,
    "keterampilan" JSONB NOT NULL,
    "elemen_kompetensi" JSONB NOT NULL,
    "kriteria_unjuk_kerja" JSONB NOT NULL,
    "sumber_standar" TEXT NOT NULL,

    CONSTRAINT "StandardKompetensi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerCompetency" (
    "careerId" TEXT NOT NULL,
    "competencyId" INTEGER NOT NULL,

    CONSTRAINT "CareerCompetency_pkey" PRIMARY KEY ("careerId","competencyId")
);

-- CreateTable
CREATE TABLE "_CareerToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CareerToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StandardKompetensi_kode_unit_key" ON "StandardKompetensi"("kode_unit");

-- CreateIndex
CREATE INDEX "_CareerToUser_B_index" ON "_CareerToUser"("B");

-- AddForeignKey
ALTER TABLE "CareerCompetency" ADD CONSTRAINT "CareerCompetency_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerCompetency" ADD CONSTRAINT "CareerCompetency_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "StandardKompetensi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareerToUser" ADD CONSTRAINT "_CareerToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Career"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareerToUser" ADD CONSTRAINT "_CareerToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
