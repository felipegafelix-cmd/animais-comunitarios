-- =============================================================================
-- Passo 2 — Autenticação e Proteção RLS
-- =============================================================================

-- Substituir as políticas de acesso público por políticas restritas a usuários autenticados.

-- 1. Animals: Todos podem ver, mas só usuários autenticados podem inserir/atualizar
DROP POLICY IF EXISTS "Leitura pública de animais" ON animals;
DROP POLICY IF EXISTS "Inserção pública de animais" ON animals;
DROP POLICY IF EXISTS "Atualização pública de animais" ON animals;

CREATE POLICY "Leitura pública de animais" ON animals FOR SELECT USING (true);
CREATE POLICY "Inserção autenticada de animais" ON animals FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Atualização autenticada de animais" ON animals FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 2. Feeding Logs: Todos podem ver, mas só autenticados podem inserir
DROP POLICY IF EXISTS "Leitura pública de alimentação" ON feeding_logs;
DROP POLICY IF EXISTS "Inserção pública de alimentação" ON feeding_logs;

CREATE POLICY "Leitura pública de alimentação" ON feeding_logs FOR SELECT USING (true);
CREATE POLICY "Inserção autenticada de alimentação" ON feeding_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Health Records: Todos podem ver, mas só autenticados podem inserir
DROP POLICY IF EXISTS "Leitura pública de saúde" ON health_records;
DROP POLICY IF EXISTS "Inserção pública de saúde" ON health_records;

CREATE POLICY "Leitura pública de saúde" ON health_records FOR SELECT USING (true);
CREATE POLICY "Inserção autenticada de saúde" ON health_records FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
