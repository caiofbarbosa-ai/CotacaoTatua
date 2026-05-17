-- =====================================================
-- MIGRAÇÃO DE SEGURANÇA: Mover cálculos para o servidor
-- =====================================================

-- 1. Remover permissão direta de INSERT na tabela contatos
DROP POLICY IF EXISTS "Allow anonymous insert" ON contatos;

-- 2. Criar função SQL para calcular e salvar cotação
CREATE OR REPLACE FUNCTION criar_cotacao(
    p_codigo_cotacao TEXT,
    p_data_evento DATE,
    p_cidade TEXT,
    p_time_option TEXT,
    p_action_time INTEGER,
    p_nome TEXT DEFAULT NULL,
    p_telefone TEXT DEFAULT NULL,
    p_quantidade_convidados INTEGER DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    codigo_cotacao TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_price_pb NUMERIC;
    v_price_colorido NUMERIC;
    v_sao_paulo_pb NUMERIC;
    v_sao_paulo_colorido NUMERIC;
    v_date_adjustment_factor NUMERIC := 1.0;
    v_days_until_event INTEGER;
BEGIN
    -- Validações básicas
    IF p_cidade IS NULL OR p_cidade = '' THEN
        RETURN QUERY SELECT false, 'Cidade é obrigatória'::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    IF p_data_evento IS NULL OR p_data_evento < CURRENT_DATE THEN
        RETURN QUERY SELECT false, 'Data do evento inválida'::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    IF p_time_option NOT IN ('guests', 'time') THEN
        RETURN QUERY SELECT false, 'Opção de tempo inválida'::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    IF p_action_time IS NULL OR p_action_time < 1 THEN
        RETURN QUERY SELECT false, 'Tempo de ação inválido'::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    -- Calcular ajuste de data (diferença em dias)
    v_days_until_event := (p_data_evento - CURRENT_DATE)::INTEGER;

    IF v_days_until_event > 730 THEN -- Mais de 2 anos
        RETURN QUERY SELECT false, 'Data do evento muito distante (máximo 2 anos)'::TEXT, NULL::TEXT;
        RETURN;
    ELSIF v_days_until_event > 365 THEN -- Entre 1 e 2 anos
        v_date_adjustment_factor := 1.05;
    END IF;

    -- Buscar preço base da tabela de preços (você precisa ter uma tabela de preços)
    -- Por enquanto, usando valores padrão baseados no tempo de ação
    v_sao_paulo_pb := 2200.0 + (p_action_time - 2) * 400.0; -- Exemplo: 2h=2200, 3h=2600, etc.
    v_sao_paulo_colorido := 2500.0 + (p_action_time - 2) * 450.0;

    -- Verificar se é cidade catalogada (você pode adicionar uma tabela de cidades com preços)
    -- Por enquanto, todas as cidades usam o preço de São Paulo + ajustes
    v_price_pb := v_sao_paulo_pb;
    v_price_colorido := v_sao_paulo_colorido;

    -- Aplicar ajuste de data
    v_price_pb := v_price_pb * v_date_adjustment_factor;
    v_price_colorido := v_price_colorido * v_date_adjustment_factor;

    -- Inserir a cotação
    INSERT INTO contatos (
        codigo_cotacao,
        data_evento,
        data_cotacao,
        nome,
        telefone,
        cidade,
        time_option,
        action_time,
        quantidade_convidados,
        price_pb,
        price_colorido,
        guest_details,
        route_details,
        date_adjustment_details
    ) VALUES (
        p_codigo_cotacao,
        p_data_evento,
        NOW(),
        p_nome,
        p_telefone,
        p_cidade,
        p_time_option,
        p_action_time,
        p_quantidade_convidados,
        v_price_pb,
        v_price_colorido,
        CASE WHEN p_time_option = 'guests' AND p_quantidade_convidados IS NOT NULL
             THEN '<p><strong>Quantidade de convidados:</strong> ' || p_quantidade_convidados || '</p>'
             ELSE NULL END,
        NULL, -- Será calculado se tiver tabela de coordenadas
        NULL -- Não exibe detalhes do ajuste de data
    );

    RETURN QUERY SELECT true, 'Cotação criada com sucesso'::TEXT, p_codigo_cotacao;
END;
$$;

-- 3. Grant execute na função para usuários anon
GRANT EXECUTE ON FUNCTION criar_cotacao TO anon;

-- 4. Verificar a função criada
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_name = 'criar_cotacao';
