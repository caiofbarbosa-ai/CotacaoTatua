-- =====================================================
-- CORREÇÃO: Fixar ambiguidade de coluna "latitude"
-- =====================================================
-- Execute este script no SQL Editor do Supabase

-- 1. Remover a função antiga get_city_coordinates
DROP FUNCTION IF EXISTS get_city_coordinates(TEXT);

-- 2. Recriar get_city_coordinates com especificação explícita de colunas
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

-- 3. Grant permissão para executar a função
GRANT EXECUTE ON FUNCTION get_city_coordinates TO anon;

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================

-- Testar a função
SELECT * FROM get_city_coordinates('São Paulo');
SELECT * FROM get_city_coordinates('Campinas');
SELECT * FROM get_city_coordinates('Santos');
