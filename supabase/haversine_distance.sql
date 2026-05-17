CREATE OR REPLACE FUNCTION public.haversine_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric)
 RETURNS numeric
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
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
$function$
