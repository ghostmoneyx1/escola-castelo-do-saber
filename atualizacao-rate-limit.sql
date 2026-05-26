-- ============================================================
-- Rate limit via Postgres
-- ============================================================
-- Espelho da migration supabase/migrations/20260526000002_rate_limit.sql
-- mantido no root pra seguir o padrão dated do projeto.
--
-- Cria tabela rate_limits + função atômica rate_limit_hit(key, max, window_sec)
-- que retorna {allowed, remaining, reset_at}. Chamada pelo app via
-- src/lib/rate-limit/check.js usando o service role.
--
-- Cole tudo no SQL Editor do Supabase e Run.

CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start
  ON rate_limits(window_start);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION rate_limit_hit(
  p_key TEXT,
  p_max INTEGER,
  p_window_sec INTEGER
)
RETURNS TABLE(allowed BOOLEAN, remaining INTEGER, reset_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_now TIMESTAMPTZ := now();
  v_window_end TIMESTAMPTZ;
  v_count INTEGER;
  v_window_start TIMESTAMPTZ;
BEGIN
  INSERT INTO rate_limits (key, count, window_start)
  VALUES (p_key, 1, v_now)
  ON CONFLICT (key) DO UPDATE
    SET
      count = CASE
        WHEN rate_limits.window_start + (p_window_sec || ' seconds')::interval < v_now
          THEN 1
        ELSE rate_limits.count + 1
      END,
      window_start = CASE
        WHEN rate_limits.window_start + (p_window_sec || ' seconds')::interval < v_now
          THEN v_now
        ELSE rate_limits.window_start
      END
  RETURNING rate_limits.count, rate_limits.window_start
    INTO v_count, v_window_start;

  v_window_end := v_window_start + (p_window_sec || ' seconds')::interval;

  RETURN QUERY SELECT
    v_count <= p_max,
    GREATEST(0, p_max - v_count),
    v_window_end;
END;
$$;

GRANT EXECUTE ON FUNCTION rate_limit_hit(TEXT, INTEGER, INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION rate_limits_cleanup()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < now() - INTERVAL '1 day';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$;

GRANT EXECUTE ON FUNCTION rate_limits_cleanup() TO service_role;
