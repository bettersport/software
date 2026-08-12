-- Marca los catálogos sembrados para poder ocultarlos a las cuentas reales.
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "demo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SolutionProvider" ADD COLUMN IF NOT EXISTS "demo" BOOLEAN NOT NULL DEFAULT false;
