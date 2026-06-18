-- Investigaciones realizadas por el agente
CREATE TABLE investigations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  report TEXT,
  steps JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documentos/fuentes encontrados por el agente
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  content TEXT,
  sha256 TEXT,
  is_pdf BOOLEAN DEFAULT FALSE,
  pdf_pages INTEGER,
  pdf_size_bytes BIGINT,
  tx_hash TEXT,         -- Hash de transacción en Syscoin (null hasta que se selle)
  block_number BIGINT,  -- Bloque en Syscoin donde quedó registrado
  stamped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Datos estructurados extraídos del informe (contratos, proveedores, pagos, anomalías)
CREATE TABLE investigation_structured (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  investigation_id UUID REFERENCES investigations(id) ON DELETE CASCADE UNIQUE,
  project_name     TEXT NOT NULL,
  project          JSONB,
  projects         JSONB DEFAULT '[]'::jsonb,
  contracts        JSONB DEFAULT '[]'::jsonb,
  suppliers        JSONB DEFAULT '[]'::jsonb,
  payments         JSONB DEFAULT '[]'::jsonb,
  anomalies        JSONB DEFAULT '[]'::jsonb,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para ordenar por fecha descendente
CREATE INDEX idx_investigation_structured_created ON investigation_structured (created_at DESC);

-- Migración para tablas existentes (ejecutar si la tabla ya existe):
-- ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_pdf BOOLEAN DEFAULT FALSE;
-- ALTER TABLE documents ADD COLUMN IF NOT EXISTS pdf_pages INTEGER;
-- ALTER TABLE documents ADD COLUMN IF NOT EXISTS pdf_size_bytes BIGINT;
-- ALTER TABLE investigation_structured ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]'::jsonb;
