-- =====================================================
-- FUNÇÃO: Buscar cotações com 60 dias para o evento
-- =====================================================

-- Criar função para buscar cotações que faltam 60 dias para o evento
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
    -- Criar link do WhatsApp com mensagem formatada (sem urlencode no SQL)
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

-- Testar a função (opcional - descomente para testar)
-- SELECT * FROM buscar_cotacoes_60_dias();
