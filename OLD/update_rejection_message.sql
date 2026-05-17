-- =====================================================
-- Atualizar Mensagem de Rejeição por Distância > 130km
-- =====================================================

-- Função corrigida com nova mensagem
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
    codigo_cotacao TEXT,
    price_pb NUMERIC,
    price_colorido NUMERIC,
    guest_details TEXT,
    route_details TEXT,
    date_adjustment_details TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    -- Variáveis de preço
    v_base_price_pb NUMERIC;
    v_base_price_colorido NUMERIC;
    v_price_pb NUMERIC;
    v_price_colorido NUMERIC;

    -- Variáveis de ajuste de data
    v_days_until_event INTEGER;
    v_date_adjustment_factor NUMERIC := 1.0;
    v_date_adjustment_percentage INTEGER := 0;

    -- Variáveis de distância
    v_city_lat NUMERIC;
    v_city_lon NUMERIC;
    v_sp_lat NUMERIC := -23.5505;
    v_sp_lon NUMERIC := -46.6333;
    v_straight_distance NUMERIC;
    v_road_distance NUMERIC;
    v_distance_surcharge NUMERIC;

    -- Variáveis de controle
    v_city_found BOOLEAN := FALSE;
    v_is_cataloged_city BOOLEAN := FALSE;
    v_route_details TEXT;
    v_guest_details TEXT;
    v_date_details TEXT;
BEGIN
    -- =====================================================
    -- 1. VALIDAÇÕES
    -- =====================================================

    -- Valida cidade
    IF p_cidade IS NULL OR TRIM(p_cidade) = '' THEN
        RETURN QUERY SELECT false, 'Cidade é obrigatória'::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::NUMERIC, NULL::TEXT, NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    -- Valida data do evento (não pode ser no passado)
    IF p_data_evento < CURRENT_DATE THEN
        RETURN QUERY SELECT false, 'A data do evento não pode ser anterior à data atual.'::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::NUMERIC, NULL::TEXT, NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    -- Valida opção de tempo
    IF p_time_option NOT IN ('guests', 'time') THEN
        RETURN QUERY SELECT false, 'Opção de tempo inválida'::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::NUMERIC, NULL::TEXT, NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    -- Valida tempo de ação
    IF p_action_time IS NULL OR p_action_time < 1 THEN
        RETURN QUERY SELECT false, 'Tempo de ação inválido'::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::NUMERIC, NULL::TEXT, NULL::TEXT, NULL::TEXT;
        RETURN;
    END IF;

    -- =====================================================
    -- 2. CÁLCULO DE AJUSTE DE DATA
    -- =====================================================

    v_days_until_event := (p_data_evento - CURRENT_DATE)::INTEGER;

    IF v_days_until_event > 730 THEN -- Mais de 2 anos
        v_date_details := 'Data do evento muito distante (' || v_days_until_event || ' dias). Aceitamos cotações para eventos até 2 anos à frente.';
        RETURN QUERY SELECT false, v_date_details::TEXT, NULL::TEXT, NULL::NUMERIC, NULL::NUMERIC, NULL::TEXT, NULL::TEXT, v_date_details::TEXT;
        RETURN;
    ELSIF v_days_until_event > 365 THEN -- Entre 1 e 2 anos
        v_date_adjustment_factor := 1.05;
        v_date_adjustment_percentage := 5;
        v_date_details := 'Evento entre 1 e 2 anos: acréscimo de 5%';
    ELSE -- Menos de 1 ano
        v_date_adjustment_factor := 1.0;
        v_date_adjustment_percentage := 0;
        v_date_details := 'Evento dentro de 1 ano: sem ajuste';
    END IF;

    -- =====================================================
    -- 3. CÁLCULO DE DISTÂNCIA
    -- =====================================================

    -- Obter coordenadas da cidade
    SELECT coords.latitude, coords.longitude INTO v_city_lat, v_city_lon
    FROM get_city_coordinates(p_cidade) AS coords
    LIMIT 1;

    -- Calcular distâncias
    v_straight_distance := haversine_distance(v_city_lat, v_city_lon, v_sp_lat, v_sp_lon);
    v_road_distance := road_distance(v_city_lat, v_city_lon, v_sp_lat, v_sp_lon);

    -- Verificar limite de distância
    IF v_road_distance > 130 THEN
        RETURN QUERY SELECT false,
            'Desculpe, para essa distância não conseguimos efetuar uma cotação automático. Entre em contato pelo WhatsApp para que façamos seu atendimento.'::TEXT,
            NULL::TEXT,
            NULL::NUMERIC,
            NULL::NUMERIC,
            NULL::TEXT,
            NULL::TEXT,
            NULL::TEXT;
    END IF;

    -- =====================================================
    -- 4. OBTENÇÃO DE PREÇO BASE
    -- =====================================================

    -- Verifica se a cidade está na tabela de preços catalogados
    SELECT price INTO v_base_price_pb
    FROM pricing_data
    WHERE city = p_cidade AND type = 'PB' AND time_hours = p_action_time
    LIMIT 1;

    SELECT price INTO v_base_price_colorido
    FROM pricing_data
    WHERE city = p_cidade AND type = 'Colorido' AND time_hours = p_action_time
    LIMIT 1;

    -- Verifica se encontrou preço catalogado
    IF v_base_price_pb IS NOT NULL AND v_base_price_colorido IS NOT NULL THEN
        v_is_cataloged_city := TRUE;
    END IF;

    -- Se não é cidade catalogada, usa preço de SP + sobretaxa de distância
    IF NOT v_is_cataloged_city THEN
        -- Busca preço de SP
        SELECT price INTO v_base_price_pb
        FROM pricing_data
        WHERE city = 'São Paulo' AND type = 'PB' AND time_hours = p_action_time
        LIMIT 1;

        SELECT price INTO v_base_price_colorido
        FROM pricing_data
        WHERE city = 'São Paulo' AND type = 'Colorido' AND time_hours = p_action_time
        LIMIT 1;

        -- Valores padrão se não encontrar
        IF v_base_price_pb IS NULL THEN
            v_base_price_pb := 2200.00;
        END IF;
        IF v_base_price_colorido IS NULL THEN
            v_base_price_colorido := 2500.00;
        END IF;

        -- Calcula sobretaxa de distância
        v_distance_surcharge := CEIL(v_road_distance) * 9;

        -- Aplica sobretaxa
        v_base_price_pb := v_base_price_pb + v_distance_surcharge;
        v_base_price_colorido := v_base_price_colorido + v_distance_surcharge;

        -- Gera detalhes da rota
        v_route_details := 'Detalhes da Rota:
• Distância em linha reta: ' || ROUND(v_straight_distance, 1) || ' km
• Distância em rota de carro: ' || ROUND(v_road_distance, 1) || ' km
• Base de cálculo: Zona Sul de São Paulo
• Sobretaxa por distância: R$ ' || v_distance_surcharge || '.00';
    END IF;

    -- =====================================================
    -- 5. APLICAÇÃO DE AJUSTE DE DATA
    -- =====================================================

    v_price_pb := v_base_price_pb * v_date_adjustment_factor;
    v_price_colorido := v_base_price_colorido * v_date_adjustment_factor;

    -- =====================================================
    -- 6. GERAÇÃO DE DETALHES
    -- =====================================================

    -- Detalhes de convidados (se aplicável)
    IF p_time_option = 'guests' AND p_quantidade_convidados IS NOT NULL THEN
        v_guest_details := 'Quantidade de convidados: ' || p_quantidade_convidados;
    END IF;

    -- Detalhes de ajuste de data
    IF v_date_adjustment_percentage > 0 THEN
        v_date_details := v_date_details || ' (' || v_date_adjustment_percentage || '% de acréscimo aplicado)';
    END IF;

    -- =====================================================
    -- 7. INSERÇÃO DA COTAÇÃO
    -- =====================================================

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
        v_guest_details,
        v_route_details,
        v_date_details
    );

    -- =====================================================
    -- 8. RETORNO DO RESULTADO
    -- =====================================================

    RETURN QUERY SELECT
        true,
        'Cotação criada com sucesso'::TEXT,
        p_codigo_cotacao,
        v_price_pb,
        v_price_colorido,
        v_guest_details,
        v_route_details,
        v_date_details;

END;
$$;

-- Verificar se a função foi atualizada
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'criar_cotacao';
