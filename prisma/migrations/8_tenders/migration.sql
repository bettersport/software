-- Licitaciones de producción de eventos deportivos y catálogo de productoras.

ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'productora';

DO $$ BEGIN
  CREATE TYPE "TenderStatus" AS ENUM ('abierta', 'evaluacion', 'adjudicada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "BidStatus" AS ENUM ('enviada', 'preseleccionada', 'descartada', 'adjudicada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Producer" (
  "id"                TEXT NOT NULL,
  "name"              TEXT NOT NULL,
  "initials"          TEXT NOT NULL DEFAULT '',
  "color"             TEXT NOT NULL DEFAULT '#22d3ee',
  "description"       TEXT NOT NULL DEFAULT '',
  "website"           TEXT,
  "country"           TEXT NOT NULL DEFAULT 'Chile',
  "flag"              TEXT NOT NULL DEFAULT '🇨🇱',
  "regions"           TEXT[],
  "specialties"       TEXT[],
  "capabilities"      TEXT[],
  "certifications"    TEXT[],
  "maxCapacity"       INTEGER NOT NULL DEFAULT 0,
  "eventsProduced"    INTEGER NOT NULL DEFAULT 0,
  "reportsOnPlatform" BOOLEAN NOT NULL DEFAULT false,
  "verified"          BOOLEAN NOT NULL DEFAULT false,
  "demo"              BOOLEAN NOT NULL DEFAULT false,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL,
  "userId"            TEXT,
  CONSTRAINT "Producer_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Producer_userId_key" ON "Producer"("userId");

CREATE TABLE IF NOT EXISTS "Tender" (
  "id"             TEXT NOT NULL,
  "title"          TEXT NOT NULL,
  "description"    TEXT NOT NULL DEFAULT '',
  "eventType"      TEXT NOT NULL,
  "sport"          TEXT NOT NULL DEFAULT '',
  "participants"   INTEGER NOT NULL DEFAULT 0,
  "region"         TEXT NOT NULL DEFAULT 'Nacional',
  "eventDate"      TEXT NOT NULL DEFAULT '',
  "budget"         INTEGER NOT NULL DEFAULT 0,
  "requirements"   TEXT NOT NULL DEFAULT '',
  "sustainability" TEXT[],
  "deadline"       TEXT NOT NULL DEFAULT '',
  "status"         "TenderStatus" NOT NULL DEFAULT 'abierta',
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL,
  "brandId"        TEXT NOT NULL,
  CONSTRAINT "Tender_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Tender_brandId_idx" ON "Tender"("brandId");
CREATE INDEX IF NOT EXISTS "Tender_status_idx" ON "Tender"("status");

CREATE TABLE IF NOT EXISTS "TenderBid" (
  "id"         TEXT NOT NULL,
  "message"    TEXT NOT NULL DEFAULT '',
  "amount"     INTEGER NOT NULL DEFAULT 0,
  "approach"   TEXT NOT NULL DEFAULT '',
  "status"     "BidStatus" NOT NULL DEFAULT 'enviada',
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL,
  "tenderId"   TEXT NOT NULL,
  "producerId" TEXT NOT NULL,
  CONSTRAINT "TenderBid_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "TenderBid_tenderId_producerId_key" ON "TenderBid"("tenderId", "producerId");
CREATE INDEX IF NOT EXISTS "TenderBid_tenderId_idx" ON "TenderBid"("tenderId");

ALTER TABLE "Producer"
  ADD CONSTRAINT "Producer_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Tender"
  ADD CONSTRAINT "Tender_brandId_fkey"
  FOREIGN KEY ("brandId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenderBid"
  ADD CONSTRAINT "TenderBid_tenderId_fkey"
  FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TenderBid"
  ADD CONSTRAINT "TenderBid_producerId_fkey"
  FOREIGN KEY ("producerId") REFERENCES "Producer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
