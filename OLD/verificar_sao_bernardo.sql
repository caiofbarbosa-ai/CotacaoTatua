-- =====================================================
-- VERIFICAR DADOS DE SÃO BERNARDO DO CAMPO
-- =====================================================

-- 1. Verificar como a cidade está sendo enviada pelo JavaScript
SELECT
    'São Bernardo do Campo' as nome_exato,
    'São Bernardo do Campo' as nome_sem_acento,
    'SAO BERNARDO DO CAMPO' as nome_maiusculo,
    'Sao Bernardo do Campo' as nome_sem_espaco
WHERE true;

-- 2. Buscar todos os registros da cidade na tabela pricing_data
SELECT
    id,
    city,
    type,
    time_hours,
    price,
    CASE WHEN price IS NOT NULL THEN 'PRECO_OK' ELSE 'PRECO_NULL' END as status_preco
FROM pricing_data
WHERE city ILIKE '%São Bernardo%';  -- Busca insensível a acentos

-- 3. Verificar se existe a cidade exata
SELECT
    id,
    city,
    type,
    time_hours,
    price
FROM pricing_data
WHERE city = 'São Bernardo do Campo'
ORDER BY type, time_hours;

-- 4. Comparar com Santos (para referência)
SELECT
    p1.city as cidade1,
    p1.type as tipo1,
    p1.time_hours as horas1,
    p1.price as preco1,
    p2.city as cidade2,
    p2.type as tipo2,
    p2.time_hours as horas2,
    p2.price as preco2,
    CASE WHEN p1.price = p2.price THEN 'IGUAIS' ELSE 'DIFERENTES' END as comparacao
FROM pricing_data p1
CROSS JOIN pricing_data p2
ON p1.type = p2.type AND p1.time_hours = p2.time_hours
WHERE p1.city = 'São Bernardo do Campo'
  AND p2.city = 'Santos'
ORDER BY p1.type, p1.time_hours;

-- 5. Verificar todas as cidades que começam com "São Bernardo"
SELECT DISTINCT city
FROM pricing_data
WHERE city ILIKE 'São Bernardo%';

-- 6. Verificar função SQL criar_cotacao
-- A função deve estar buscando assim:
-- SELECT price INTO v_base_price_pb FROM pricing_data WHERE city = p_cidade AND type = 'PB' AND time_hours = p_action_time LIMIT 1;

-- =====================================================
-- INSTRUÇÕES PARA O USUÁRIO
-- =====================================================

-- Execute as consultas acima para verificar:
-- 1. O nome exato da cidade
-- 2. Quais registros existem para essa cidade
-- 3. Se está retornando NULL quando não deveria

-- Se os preços estiverem NULL, execute:
-- UPDATE pricing_data SET price = 2200.00 WHERE city = 'São Bernardo do Campo' AND type = 'PB' AND time_hours = 2;
-- UPDATE pricing_data SET price = 2500.00 WHERE city = 'São Bernardo do Campo' AND type = 'Colorido' AND time_hours = 2;

-- E ajuste conforme necessário para outros tempos/horas
