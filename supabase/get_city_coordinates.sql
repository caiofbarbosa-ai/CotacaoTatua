CREATE OR REPLACE FUNCTION public.get_city_coordinates(p_city text)
 RETURNS TABLE(latitude numeric, longitude numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Tenta buscar na tabela de coordenadas
    RETURN QUERY SELECT
        c.latitude,
        c.longitude
    FROM cidades c
    WHERE c.nome = p_city
    LIMIT 1;
END;
$function$
