-- Plan de pago (Flow.cl): suscripciones al Plan General y vigencia en el usuario.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "planUntil" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"            TEXT NOT NULL,
  "plan"          TEXT NOT NULL DEFAULT 'general',
  "amountNet"     INTEGER NOT NULL,
  "amountTax"     INTEGER NOT NULL,
  "amountTotal"   INTEGER NOT NULL,
  "currency"      TEXT NOT NULL DEFAULT 'CLP',
  "status"        TEXT NOT NULL DEFAULT 'pending',
  "commerceOrder" TEXT NOT NULL,
  "flowToken"     TEXT,
  "flowOrder"     INTEGER,
  "payerEmail"    TEXT,
  "paidAt"        TIMESTAMP(3),
  "periodStart"   TIMESTAMP(3),
  "periodEnd"     TIMESTAMP(3),
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL,
  "userId"        TEXT NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_commerceOrder_key" ON "Subscription"("commerceOrder");
CREATE UNIQUE INDEX IF NOT EXISTS "Subscription_flowToken_key" ON "Subscription"("flowToken");
CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");

ALTER TABLE "Subscription"
  ADD CONSTRAINT "Subscription_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
