-- =====================================================
-- SUPABASE REMINDER V3 - Versão Corrigida
-- Sistema de envio de lembretes para cotações com 60 dias
-- =====================================================

-- 1. Criar função para buscar cotações com 60 dias para o evento
CREATE OR REPLACE FUNCTION buscar_cotacoes_60_dias()
RETURNS TABLE (
    codigo_cotacao TEXT,
    nome TEXT,
    telefone TEXT,
    data_evento DATE,
    cidade TEXT,
    action_time INTEGER,
    price_pb NUMERIC,
    price_colorido NUMERIC,
    whatsapp_link TEXT
)
LANGUAGE sql
AS $$
SELECT
    c.codigo_cotacao,
    c.nome,
    c.telefone,
    c.data_evento,
    c.cidade,
    c.action_time,
    c.price_pb,
    c.price_colorido,
    -- Criar link do WhatsApp com mensagem formatada
    'https://wa.me/55' ||
    REGEXP_REPLACE(REGEXP_REPLACE(c.telefone, '[^0-9]', ''), '^(\d{2})(\d{5})(\d{4})$', '\1\2\3') ||
    '?text=Olá%2C+falta+apenas+2+meses+para+seu+evento.+Vamos+deixa-lo+marcado+na+pele+dos+seus+convidados+para+sempre+(ou+até+o+próximo+banho)%3F' AS whatsapp_link
FROM contatos c
WHERE
    c.data_evento >= CURRENT_DATE + INTERVAL '59 days' AND
    c.data_evento <= CURRENT_DATE + INTERVAL '61 days' AND
    c.telefone IS NOT NULL AND
    c.telefone != ''
ORDER BY c.data_evento ASC;
$$;

-- Grant permissão para usuários anon executarem a função
GRANT EXECUTE ON FUNCTION buscar_cotacoes_60_dias TO anon;

-- 2. Verificar políticas RLS na tabela contatos
-- Se as políticas já existirem, mantém. Se não, cria.

DROP POLICY IF EXISTS "Allow anonymous select" ON contatos;
DROP POLICY IF EXISTS "Allow anonymous insert" ON contatos;
DROP POLICY IF EXISTS "Allow anonymous update" ON contatos;

CREATE POLICY "Allow anonymous select" ON contatos
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow anonymous insert" ON contatos
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous update" ON contatos
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Verificar função criada
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'buscar_cotacoes_60_dias';

-- Verificar políticas criadas
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'contatos';

-- Testar a função (retornará vazio se não houver cotações com 60 dias)
-- Descomente para testar:
-- SELECT * FROM buscar_cotacoes_60_dias();
