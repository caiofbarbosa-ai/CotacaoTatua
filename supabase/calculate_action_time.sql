CREATE OR REPLACE FUNCTION public.calculate_action_time(p_guests integer)
 RETURNS integer
 LANGUAGE plpgsql
 IMMUTABLE
AS $function$
BEGIN
    IF p_guests < 150 THEN
        RETURN 2;
    ELSE
        RETURN CEIL((p_guests - 150)::NUMERIC / 60.0) + 2;
    END IF;
END;
$function$
