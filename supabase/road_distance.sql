CREATE OR REPLACE FUNCTION public.road_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
DECLARE
    straight_distance NUMERIC;
BEGIN
    straight_distance := haversine_distance(lat1, lon1, lat2, lon2);
    RETURN straight_distance * 1.3; -- Fator de rota
END;
$function$
