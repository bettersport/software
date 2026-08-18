-- Almacenamiento de archivos (Railway volume): respaldos del Motor IA con binario.
ALTER TABLE "StrategyDocument" ADD COLUMN IF NOT EXISTS "storageKey" TEXT;
ALTER TABLE "StrategyDocument" ADD COLUMN IF NOT EXISTS "mimeType" TEXT;
