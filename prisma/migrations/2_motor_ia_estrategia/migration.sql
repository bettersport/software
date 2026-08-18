-- Motor IA · Estrategia ESG — nuevos enums, tablas y vínculo estrategia→proyecto.

DO $$ BEGIN
  CREATE TYPE "StrategyStatus" AS ENUM ('draft','generated','active','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "EsgPillar" AS ENUM ('ambiental','social','gobernanza');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "DataMaturity" AS ENUM ('con_linea_base','con_diagnostico','sin_datos');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "EsgStrategy" (
  "id" TEXT NOT NULL,
  "status" "StrategyStatus" NOT NULL DEFAULT 'draft',
  "version" INTEGER NOT NULL DEFAULT 1,
  "currentStep" INTEGER NOT NULL DEFAULT 0,
  "orgName" TEXT NOT NULL DEFAULT '',
  "sport" TEXT NOT NULL DEFAULT '',
  "orgType" TEXT NOT NULL DEFAULT '',
  "vigenciaInicio" INTEGER,
  "vigenciaFin" INTEGER,
  "respName" TEXT NOT NULL DEFAULT '',
  "respRole" TEXT NOT NULL DEFAULT '',
  "respEmail" TEXT NOT NULL DEFAULT '',
  "isFirstStrategy" BOOLEAN NOT NULL DEFAULT true,
  "objectives" TEXT[],
  "alignGlobal" BOOLEAN NOT NULL DEFAULT false,
  "globalBody" TEXT,
  "additionalContext" TEXT NOT NULL DEFAULT '',
  "reviewFrequency" TEXT NOT NULL DEFAULT 'anual',
  "maturityScores" JSONB,
  "generatedDoc" JSONB,
  "generatedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "clubId" TEXT NOT NULL,
  CONSTRAINT "EsgStrategy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "StrategyChallenge" (
  "id" TEXT NOT NULL,
  "pillar" "EsgPillar" NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isCustom" BOOLEAN NOT NULL DEFAULT false,
  "hasBaseline" BOOLEAN NOT NULL DEFAULT false,
  "hasDiagnosis" BOOLEAN NOT NULL DEFAULT false,
  "hasHistorical" BOOLEAN NOT NULL DEFAULT false,
  "maturity" "DataMaturity" NOT NULL DEFAULT 'sin_datos',
  "griStandard" TEXT NOT NULL DEFAULT '',
  "griTitle" TEXT NOT NULL DEFAULT '',
  "indicators" TEXT[],
  "sdgs" TEXT[],
  "goalText" TEXT NOT NULL DEFAULT '',
  "goalPreliminary" BOOLEAN NOT NULL DEFAULT true,
  "milestones" JSONB,
  "budgetStatus" TEXT NOT NULL DEFAULT 'no',
  "budgetAmount" DOUBLE PRECISION,
  "budgetCurrency" TEXT NOT NULL DEFAULT 'CLP',
  "budgetPeriod" TEXT NOT NULL DEFAULT 'total',
  "hrStatus" TEXT NOT NULL DEFAULT 'no',
  "hrNote" TEXT NOT NULL DEFAULT '',
  "proposedProjects" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "strategyId" TEXT NOT NULL,
  CONSTRAINT "StrategyChallenge_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "StrategyDocument" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "size" TEXT NOT NULL DEFAULT '',
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "challengeId" TEXT NOT NULL,
  CONSTRAINT "StrategyDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "GriMapping" (
  "id" TEXT NOT NULL,
  "pillar" "EsgPillar" NOT NULL,
  "key" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "griStandard" TEXT NOT NULL,
  "griTitle" TEXT NOT NULL,
  "indicators" TEXT[],
  "sdgs" TEXT[],
  "metricUnit" TEXT NOT NULL DEFAULT '',
  "metricVerb" TEXT NOT NULL DEFAULT 'reducir',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "GriMapping_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "SportFramework" (
  "id" TEXT NOT NULL,
  "sport" TEXT NOT NULL,
  "organism" TEXT NOT NULL,
  "framework" TEXT NOT NULL,
  "summary" TEXT NOT NULL DEFAULT '',
  "active" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "SportFramework_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ESGProject" ADD COLUMN IF NOT EXISTS "challengeId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "GriMapping_key_key" ON "GriMapping"("key");
CREATE UNIQUE INDEX IF NOT EXISTS "SportFramework_sport_key" ON "SportFramework"("sport");
CREATE INDEX IF NOT EXISTS "EsgStrategy_clubId_idx" ON "EsgStrategy"("clubId");
CREATE INDEX IF NOT EXISTS "StrategyChallenge_strategyId_idx" ON "StrategyChallenge"("strategyId");
CREATE INDEX IF NOT EXISTS "StrategyDocument_challengeId_idx" ON "StrategyDocument"("challengeId");

DO $$ BEGIN
  ALTER TABLE "EsgStrategy" ADD CONSTRAINT "EsgStrategy_clubId_fkey"
    FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "StrategyChallenge" ADD CONSTRAINT "StrategyChallenge_strategyId_fkey"
    FOREIGN KEY ("strategyId") REFERENCES "EsgStrategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "StrategyDocument" ADD CONSTRAINT "StrategyDocument_challengeId_fkey"
    FOREIGN KEY ("challengeId") REFERENCES "StrategyChallenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ESGProject" ADD CONSTRAINT "ESGProject_challengeId_fkey"
    FOREIGN KEY ("challengeId") REFERENCES "StrategyChallenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
