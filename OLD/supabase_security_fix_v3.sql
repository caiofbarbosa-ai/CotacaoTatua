-- =====================================================
-- MIGRAÇÃO DE SEGURANÇA V3: Lógica completa de cálculo no servidor
-- =====================================================

-- =====================================================
-- 1. TABELA DE PREÇOS (pricing_data)
-- =====================================================
CREATE TABLE IF NOT EXISTS pricing_data (
    id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('PB', 'Colorido')),
    time_hours INTEGER NOT NULL CHECK (time_hours BETWEEN 2 AND 8),
    price NUMERIC NOT NULL
);

-- Inserir dados de preços
INSERT INTO pricing_data (city, type, time_hours, price) VALUES
-- São Paulo
('São Paulo', 'PB', 2, 2200.00),
('São Paulo', 'PB', 3, 2500.00),
('São Paulo', 'PB', 4, 2800.00),
('São Paulo', 'PB', 5, 3100.00),
('São Paulo', 'PB', 6, 3400.00),
('São Paulo', 'PB', 7, 3800.00),
('São Paulo', 'PB', 8, 4100.00),
('São Paulo', 'Colorido', 2, 2500.00),
('São Paulo', 'Colorido', 3, 2800.00),
('São Paulo', 'Colorido', 4, 3100.00),
('São Paulo', 'Colorido', 5, 3400.00),
('São Paulo', 'Colorido', 6, 3800.00),
('São Paulo', 'Colorido', 7, 4100.00),
('São Paulo', 'Colorido', 8, 4500.00),

-- Santo André
('Santo André', 'PB', 2, 2200.00),
('Santo André', 'PB', 3, 2500.00),
('Santo André', 'PB', 4, 2800.00),
('Santo André', 'PB', 5, 3100.00),
('Santo André', 'PB', 6, 3400.00),
('Santo André', 'PB', 7, 3800.00),
('Santo André', 'PB', 8, 4100.00),
('Santo André', 'Colorido', 2, 2500.00),
('Santo André', 'Colorido', 3, 2800.00),
('Santo André', 'Colorido', 4, 3100.00),
('Santo André', 'Colorido', 5, 3400.00),
('Santo André', 'Colorido', 6, 3800.00),
('Santo André', 'Colorido', 7, 4100.00),
('Santo André', 'Colorido', 8, 4500.00),

-- São Bernardo do Campo
('São Bernardo do Campo', 'PB', 2, 2200.00),
('São Bernardo do Campo', 'PB', 3, 2500.00),
('São Bernardo do Campo', 'PB', 4, 2800.00),
('São Bernardo do Campo', 'PB', 5, 3100.00),
('São Bernardo do Campo', 'PB', 6, 3400.00),
('São Bernardo do Campo', 'PB', 7, 3800.00),
('São Bernardo do Campo', 'PB', 8, 4100.00),
('São Bernardo do Campo', 'Colorido', 2, 2500.00),
('São Bernardo do Campo', 'Colorido', 3, 2800.00),
('São Bernardo do Campo', 'Colorido', 4, 3100.00),
('São Bernardo do Campo', 'Colorido', 5, 3400.00),
('São Bernardo do Campo', 'Colorido', 6, 3800.00),
('São Bernardo do Campo', 'Colorido', 7, 4100.00),
('São Bernardo do Campo', 'Colorido', 8, 4500.00),

-- São Caetano do Sul
('São Caetano do Sul', 'PB', 2, 2200.00),
('São Caetano do Sul', 'PB', 3, 2500.00),
('São Caetano do Sul', 'PB', 4, 2800.00),
('São Caetano do Sul', 'PB', 5, 3100.00),
('São Caetano do Sul', 'PB', 6, 3400.00),
('São Caetano do Sul', 'PB', 7, 3800.00),
('São Caetano do Sul', 'PB', 8, 4100.00),
('São Caetano do Sul', 'Colorido', 2, 2500.00),
('São Caetano do Sul', 'Colorido', 3, 2800.00),
('São Caetano do Sul', 'Colorido', 4, 3100.00),
('São Caetano do Sul', 'Colorido', 5, 3400.00),
('São Caetano do Sul', 'Colorido', 6, 3800.00),
('São Caetano do Sul', 'Colorido', 7, 4100.00),
('São Caetano do Sul', 'Colorido', 8, 4500.00),

-- Santos
('Santos', 'PB', 2, 2000.00),
('Santos', 'PB', 3, 2300.00),
('Santos', 'PB', 4, 2600.00),
('Santos', 'PB', 5, 2900.00),
('Santos', 'PB', 6, 3100.00),
('Santos', 'PB', 7, 3400.00),
('Santos', 'PB', 8, 3700.00),
('Santos', 'Colorido', 2, 2300.00),
('Santos', 'Colorido', 3, 2600.00),
('Santos', 'Colorido', 4, 2900.00),
('Santos', 'Colorido', 5, 3100.00),
('Santos', 'Colorido', 6, 3400.00),
('Santos', 'Colorido', 7, 3700.00),
('Santos', 'Colorido', 8, 4000.00),

-- São Vicente
('São Vicente', 'PB', 2, 2000.00),
('São Vicente', 'PB', 3, 2300.00),
('São Vicente', 'PB', 4, 2600.00),
('São Vicente', 'PB', 5, 2900.00),
('São Vicente', 'PB', 6, 3100.00),
('São Vicente', 'PB', 7, 3400.00),
('São Vicente', 'PB', 8, 3700.00),
('São Vicente', 'Colorido', 2, 2300.00),
('São Vicente', 'Colorido', 3, 2600.00),
('São Vicente', 'Colorido', 4, 2900.00),
('São Vicente', 'Colorido', 5, 3100.00),
('São Vicente', 'Colorido', 6, 3400.00),
('São Vicente', 'Colorido', 7, 3700.00),
('São Vicente', 'Colorido', 8, 4000.00)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. TABELA DE COORDENADAS DE CIDADES (city_coordinates)
-- =====================================================
CREATE TABLE IF NOT EXISTS city_coordinates (
    city TEXT PRIMARY KEY,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL
);

-- Inserir coordenadas das cidades
INSERT INTO city_coordinates (city, latitude, longitude) VALUES
('São Paulo', -23.5505, -46.6333),
('Santos', -23.9527, -46.3331),
('Campinas', -22.9064, -47.0616),
('São Bernardo do Campo', -23.6944, -46.5653),
('Santo André', -23.6632, -46.5384),
('São José dos Campos', -21.2089, -50.4328),
('Ribeirão Preto', -21.1767, -47.8103),
('Sorocaba', -23.5016, -47.4525),
('São José do Rio Preto', -20.8197, -49.3796),
('Bauru', -22.3152, -49.0609),
('Taubaté', -23.0264, -45.5556),
('Piracicaba', -22.7253, -47.6492),
('Limeira', -22.5651, -47.4017),
('Guarulhos', -23.4543, -46.5337),
('São Vicente', -23.9633, -46.3918),
('Diadema', -23.6861, -46.6153),
('Carapicuíba', -23.5225, -46.8369),
('Mauá', -23.6678, -46.4606),
('Itaquaquecetuba', -23.4875, -46.3492),
('Mogi das Cruzes', -23.5208, -46.1875),
('Suzano', -23.5428, -46.3114),
('Taboão da Serra', -23.6261, -46.7917),
('Embu das Artes', -23.6497, -46.8517),
('Cotia', -23.6039, -46.9189),
('Barueri', -23.5111, -46.8811),
('Jandira', -23.5256, -46.9011),
('Osasco', -23.5329, -46.7917),
('São Caetano do Sul', -23.6236, -46.5489),
('Mogi Guaçu', -22.3689, -46.9417),
('São Carlos', -22.0053, -47.8892),
('Araraquara', -21.7947, -48.1753),
('Botucatu', -22.8853, -48.4453),
('Pindamonhangaba', -22.9278, -45.2647),
('Bragança Paulista', -22.9508, -46.5408),
('Jundiaí', -23.1905, -46.8875),
('Francisco Morato', -23.2856, -46.7469),
('Itu', -23.2636, -47.2986),
('São Roque', -23.5244, -47.1344),
('Valinhos', -22.9681, -46.9986),
('Vinhedo', -22.9686, -46.8742),
('Americana', -22.7386, -47.3314),
('Atibaia', -23.1161, -46.5506),
('Jacareí', -23.3075, -45.9611),
('Rio Claro', -22.4081, -47.5631),
('Marília', -22.2144, -49.9456),
('Presidente Prudente', -22.1275, -51.3928),
('Araçatuba', -21.2089, -50.4328),
('São José do Rio Pardo', -21.5975, -46.8875),
('Pirassununga', -21.9856, -47.4256)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. FUNÇÕES AUXILIARES
-- =====================================================

-- Função para calcular distância em linha reta (Haversine) em km
CREATE OR REPLACE FUNCTION haversine_distance(
    lat1 NUMERIC,
    lon1 NUMERIC,
    lat2 NUMERIC,
    lon2 NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    R NUMERIC := 6371; -- Raio da Terra em km
    d_lat NUMERIC;
    d_lon NUMERIC;
    a NUMERIC;
    c NUMERIC;
BEGIN
    d_lat := RADIANS(lat2 - lat1);
    d_lon := RADIANS(lon2 - lon1);

    a := SIN(d_lat / 2) * SIN(d_lat / 2) +
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
         SIN(d_lon / 2) * SIN(d_lon / 2);

    c := 2 * ATAN2(SQRT(a), SQRT(1 - a));

    RETURN R * c;
END;
$$;

-- Função para calcular distância rodoviária (aproximada)
CREATE OR REPLACE FUNCTION road_distance(
    lat1 NUMERIC,
    lon1 NUMERIC,
    lat2 NUMERIC,
    lon2 NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    straight_distance NUMERIC;
BEGIN
    straight_distance := haversine_distance(lat1, lon1, lat2, lon2);
    RETURN straight_distance * 1.3; -- Fator de rota
END;
$$;

-- Função para calcular tempo de ação baseado em convidados
CREATE OR REPLACE FUNCTION calculate_action_time(p_guests INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    IF p_guests < 150 THEN
        RETURN 2;
    ELSE
        RETURN CEIL((p_guests - 150)::NUMERIC / 60.0) + 2;
    END IF;
END;
$$;

-- Função para obter coordenadas de uma cidade
CREATE OR REPLACE FUNCTION get_city_coordinates(p_city TEXT)
RETURNS TABLE (latitude NUMERIC, longitude NUMERIC)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Tenta buscar na tabela de coordenadas
    RETURN QUERY SELECT
        c.latitude,
        c.longitude
    FROM cidades c
    WHERE c.nome = p_city
    LIMIT 1;
END;
$$;

-- =====================================================
-- 4. FUNÇÃO PRINCIPAL: criar_cotacao
-- =====================================================
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
        RETURN;
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

-- =====================================================
-- 5. PERMISSÕES
-- =====================================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "Allow anonymous insert" ON contatos;
DROP POLICY IF EXISTS "Allow anonymous select" ON contatos;
DROP POLICY IF EXISTS "Allow anonymous update" ON contatos;

-- Criar políticas para contatos
CREATE POLICY "Allow anonymous insert" ON contatos
FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON contatos
FOR SELECT TO anon USING (true);

-- Grant permissões
GRANT EXECUTE ON FUNCTION criar_cotacao TO anon;
GRANT SELECT ON pricing_data TO anon;
GRANT SELECT ON city_coordinates TO anon;
GRANT SELECT, INSERT ON contatos TO anon;

-- =====================================================
-- 6. VERIFICAÇÃO
-- =====================================================

-- Verificar função criada
SELECT
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_name = 'criar_cotacao';

-- Contar registros nas tabelas
SELECT 'pricing_data' as tabela, COUNT(*) as total FROM pricing_data
UNION ALL
SELECT 'city_coordinates' as tabela, COUNT(*) as total FROM city_coordinates;
