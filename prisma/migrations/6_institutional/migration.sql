-- Panel institucional (Ministerio del Deporte / Comité Olímpico).

-- Rol de organismo rector.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'institucion';

-- Naturaleza de la organización que reporta: el modelo Club agrupa clubes,
-- federaciones y eventos, y este campo los distingue en los conteos.
DO $$ BEGIN
  CREATE TYPE "OrgType" AS ENUM ('club', 'federacion', 'evento');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "orgType" "OrgType" NOT NULL DEFAULT 'club';
