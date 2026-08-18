-- Auditoría: scoring server-side, ranking real, perfil de club, y nuevos flujos.
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "baseEnvironmental" DOUBLE PRECISION;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "baseSocial" DOUBLE PRECISION;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "baseGovernance" DOUBLE PRECISION;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "previousRanking" INTEGER;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "banner" TEXT;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "region" TEXT;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "Club" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "notificationPrefs" JSONB;
ALTER TABLE "SolutionProvider" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "SolutionProvider" ADD COLUMN IF NOT EXISTS "isEmpresaB" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "uploadedById" TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "storageKey" TEXT;
ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "mimeType" TEXT;
ALTER TABLE "ClubEvent" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "SponsorRequest" (
  "id" TEXT NOT NULL, "eventId" TEXT NOT NULL, "message" TEXT NOT NULL DEFAULT '',
  "amount" DOUBLE PRECISION, "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "requesterId" TEXT NOT NULL,
  CONSTRAINT "SponsorRequest_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "SolutionContact" (
  "id" TEXT NOT NULL, "providerId" TEXT NOT NULL, "message" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "requesterId" TEXT NOT NULL,
  CONSTRAINT "SolutionContact_pkey" PRIMARY KEY ("id")
);
CREATE TABLE IF NOT EXISTS "KpiHistory" (
  "id" TEXT NOT NULL, "kpiId" TEXT NOT NULL, "value" DOUBLE PRECISION NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "KpiHistory_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "SponsorRequest_eventId_idx" ON "SponsorRequest"("eventId");
CREATE INDEX IF NOT EXISTS "SolutionContact_providerId_idx" ON "SolutionContact"("providerId");
CREATE INDEX IF NOT EXISTS "KpiHistory_kpiId_idx" ON "KpiHistory"("kpiId");
DO $$ BEGIN
  ALTER TABLE "SponsorRequest" ADD CONSTRAINT "SponsorRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "SolutionContact" ADD CONSTRAINT "SolutionContact_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Inicializar puntajes base: los demo conservan sus valores sembrados; los reales parten en 0.
UPDATE "Club" SET "baseEnvironmental" = COALESCE("baseEnvironmental", CASE WHEN "demo" THEN "environmental" ELSE 0 END),
                  "baseSocial"        = COALESCE("baseSocial",        CASE WHEN "demo" THEN "social"        ELSE 0 END),
                  "baseGovernance"    = COALESCE("baseGovernance",    CASE WHEN "demo" THEN "governance"    ELSE 0 END);
