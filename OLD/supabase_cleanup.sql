-- =====================================================
-- Migração: Remover colunas antigas e adicionar quantidade_convidados
-- =====================================================

-- 1. Adicionar nova coluna quantidade_convidados
ALTER TABLE contatos
ADD COLUMN IF NOT EXISTS quantidade_convidados INTEGER;

-- 2. Remover colunas antigas que não são mais necessárias
ALTER TABLE contatos
DROP COLUMN IF EXISTS tempo_acao,
DROP COLUMN IF EXISTS tipo_calculo,
DROP COLUMN IF EXISTS valor_pb,
DROP COLUMN IF EXISTS valor_colorido;

-- 3. Adicionar comentário para documentação
COMMENT ON COLUMN contatos.quantidade_convidados IS 'Quantidade de convidados (preenchido apenas quando time_option = "guests", null caso contrário)';

-- 4. Verificar a estrutura final da tabela
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'contatos'
ORDER BY ordinal_position;
