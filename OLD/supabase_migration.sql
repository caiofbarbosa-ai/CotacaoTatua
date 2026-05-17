-- =====================================================
-- Migração: Adicionar colunas e configurar RLS na tabela contatos
-- =====================================================

-- 1. Adicionar colunas faltantes à tabela contatos
ALTER TABLE contatos
ADD COLUMN IF NOT EXISTS time_option TEXT,
ADD COLUMN IF NOT EXISTS action_time INTEGER,
ADD COLUMN IF NOT EXISTS price_pb NUMERIC,
ADD COLUMN IF NOT EXISTS price_colorido NUMERIC,
ADD COLUMN IF NOT EXISTS guest_details TEXT,
ADD COLUMN IF NOT EXISTS route_details TEXT,
ADD COLUMN IF NOT EXISTS date_adjustment_details TEXT;

-- 2. Configurar Row Level Security (RLS)
-- Habilitar RLS na tabela (se ainda não estiver habilitado)
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- 3. Criar política para permitir INSERT com a chave ANON
-- Esta política permite que usuários anônimos insiram novos registros
DROP POLICY IF EXISTS "Allow anonymous insert" ON contatos;

CREATE POLICY "Allow anonymous insert"
ON contatos
FOR INSERT
TO anon
WITH CHECK (true);

-- 4. Criar política para permitir SELECT com a chave ANON
-- Esta política permite que usuários anônimos leiam os registros
DROP POLICY IF EXISTS "Allow anonymous select" ON contatos;

CREATE POLICY "Allow anonymous select"
ON contatos
FOR SELECT
TO anon
USING (true);

-- 5. Criar política para permitir UPDATE com a chave ANON (opcional)
-- Esta política permite que usuários anônimos atualizem seus próprios registros
-- Se você não quer permitir updates, pode remover esta parte
DROP POLICY IF EXISTS "Allow anonymous update" ON contatos;

CREATE POLICY "Allow anonymous update"
ON contatos
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 6. (Opcional) Adicionar comentários às colunas para documentação
COMMENT ON COLUMN contatos.codigo_cotacao IS 'Código único/hash da cotação';
COMMENT ON COLUMN contatos.data_evento IS 'Data do evento';
COMMENT ON COLUMN contatos.data_cotacao IS 'Data e hora em que a cotação foi gerada';
COMMENT ON COLUMN contatos.nome IS 'Nome do cliente';
COMMENT ON COLUMN contatos.telefone IS 'Telefone do cliente';
COMMENT ON COLUMN contatos.cidade IS 'Cidade do evento';
COMMENT ON COLUMN contatos.time_option IS 'Opção de tempo: "guests" ou "time"';
COMMENT ON COLUMN contatos.action_time IS 'Tempo de ação em horas';
COMMENT ON COLUMN contatos.price_pb IS 'Preço para tatuagens preto e branco';
COMMENT ON COLUMN contatos.price_colorido IS 'Preço para tatuagens coloridas';
COMMENT ON COLUMN contatos.guest_details IS 'Detalhes adicionais sobre convidados (opcional)';
COMMENT ON COLUMN contatos.route_details IS 'Detalhes sobre a rota/cálculo de distância (opcional)';
COMMENT ON COLUMN contatos.date_adjustment_details IS 'Detalhes sobre ajuste de data (opcional)';

-- 7. Verificar as políticas criadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contatos';

-- 8. Verificar a estrutura final da tabela
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'contatos'
ORDER BY ordinal_position;
