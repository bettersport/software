-- Licencias Bettersport: la marca las compra y las entrega a sus patrocinados.

DO $$ BEGIN
  CREATE TYPE "LicenseStatus" AS ENUM ('disponible', 'asignada', 'vencida');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "License" (
  "id"          TEXT NOT NULL,
  "status"      "LicenseStatus" NOT NULL DEFAULT 'disponible',
  "amount"      INTEGER NOT NULL DEFAULT 0,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd"   TIMESTAMP(3) NOT NULL,
  "assignedAt"  TIMESTAMP(3),
  "notes"       TEXT NOT NULL DEFAULT '',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,
  "brandId"     TEXT NOT NULL,
  "clubId"      TEXT,
  CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "License_brandId_idx" ON "License"("brandId");
CREATE INDEX IF NOT EXISTS "License_clubId_idx" ON "License"("clubId");

ALTER TABLE "License"
  ADD CONSTRAINT "License_brandId_fkey"
  FOREIGN KEY ("brandId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "License"
  ADD CONSTRAINT "License_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;
