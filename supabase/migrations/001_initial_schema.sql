-- =============================================================================
-- MVP: Gestão de Animais Comunitários
-- Passo 1 — Estrutura inicial do banco (Supabase / PostgreSQL)
-- =============================================================================
-- Execute este arquivo no SQL Editor do Supabase ou via CLI:
--   supabase db push
-- =============================================================================

-- Tipos enumerados garantem valores consistentes no app e no banco
CREATE TYPE species_type AS ENUM ('dog', 'cat');
CREATE TYPE health_record_type AS ENUM ('vaccine', 'dewormer');

-- -----------------------------------------------------------------------------
-- Tabela: animals
-- Cadastro principal de cada animal comunitário (cão ou gato de rua)
-- -----------------------------------------------------------------------------
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species species_type NOT NULL,
  photo_url TEXT,
  location_description TEXT NOT NULL,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  is_neutered BOOLEAN NOT NULL DEFAULT FALSE,
  is_emergency BOOLEAN NOT NULL DEFAULT FALSE,
  emergency_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para destacar emergências no dashboard (ordenar primeiro)
CREATE INDEX idx_animals_emergency ON animals (is_emergency DESC, updated_at DESC);

-- -----------------------------------------------------------------------------
-- Tabela: feeding_logs
-- Histórico de alimentação — cada registro = um "Alimentei agora"
-- -----------------------------------------------------------------------------
CREATE TABLE feeding_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  fed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fed_by_name TEXT,
  notes TEXT
);

-- Busca rápida da última refeição por animal
CREATE INDEX idx_feeding_logs_animal_fed_at ON feeding_logs (animal_id, fed_at DESC);

-- -----------------------------------------------------------------------------
-- Tabela: health_records
-- Diário de saúde: vacinas e vermífugos
-- -----------------------------------------------------------------------------
CREATE TABLE health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  record_type health_record_type NOT NULL,
  title TEXT NOT NULL,
  applied_at DATE NOT NULL,
  next_due_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_health_records_animal ON health_records (animal_id, applied_at DESC);

-- -----------------------------------------------------------------------------
-- Trigger: atualiza updated_at automaticamente em animals
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (RLS) — MVP aberto para leitura/escrita anônima
-- Em produção, substitua por auth (Supabase Auth) e políticas por usuário
-- -----------------------------------------------------------------------------
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de animais" ON animals FOR SELECT USING (true);
CREATE POLICY "Inserção pública de animais" ON animals FOR INSERT WITH CHECK (true);
CREATE POLICY "Atualização pública de animais" ON animals FOR UPDATE USING (true);

CREATE POLICY "Leitura pública de alimentação" ON feeding_logs FOR SELECT USING (true);
CREATE POLICY "Inserção pública de alimentação" ON feeding_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Leitura pública de saúde" ON health_records FOR SELECT USING (true);
CREATE POLICY "Inserção pública de saúde" ON health_records FOR INSERT WITH CHECK (true);

-- View auxiliar: última alimentação por animal (usada no dashboard)
CREATE OR REPLACE VIEW animals_with_last_feeding AS
SELECT
  a.*,
  fl.fed_at AS last_fed_at,
  fl.fed_by_name AS last_fed_by
FROM animals a
LEFT JOIN LATERAL (
  SELECT fed_at, fed_by_name
  FROM feeding_logs
  WHERE animal_id = a.id
  ORDER BY fed_at DESC
  LIMIT 1
) fl ON true;
