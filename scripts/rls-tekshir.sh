#!/usr/bin/env bash
# Supabase migratsiyalari va RLS sinovlari: lokal, vaqtinchalik Postgres klasterida.
# Kerak: Postgres 15+ binar fayllari (initdb, pg_ctl, psql). Masalan: brew install postgresql@17
# Ishga tushirish: npm run db:tekshir   (yoki PGBIN=/yo'l/bin bash scripts/rls-tekshir.sh)
#
# Tartib: toza klaster -> lokal shim (Supabase rollari, auth, storage o'xshatmasi) ->
# migratsiyalar 2 marta (takror ishga tushirish buzmasligini tekshirish) -> supabase/tests/rls_test.sql.
# Klaster vaqtinchalik papkada, oxirida o'chiriladi. Haqiqiy Supabase loyihasiga ulanmaydi.
set -euo pipefail
# macOS: locale bo'lmasa postmaster "became multithreaded during startup" bilan to'xtaydi.
export LC_ALL=C LANG=C

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if [[ -z "${PGBIN:-}" ]]; then
  if command -v brew >/dev/null 2>&1 && [[ -d "$(brew --prefix postgresql@17 2>/dev/null)/bin" ]]; then
    PGBIN="$(brew --prefix postgresql@17)/bin"
  else
    PGBIN="$(dirname "$(command -v initdb)")"
  fi
fi
PORT="${PGPORT_SINOV:-54329}"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/tayanch-db.XXXXXX")"

cleanup() {
  "$PGBIN/pg_ctl" -D "$TMP/data" -m fast stop >/dev/null 2>&1 || true
  rm -rf "$TMP"
}
trap cleanup EXIT

"$PGBIN/initdb" -D "$TMP/data" -U postgres --auth=trust -E UTF8 --locale=C >/dev/null
"$PGBIN/pg_ctl" -D "$TMP/data" -l "$TMP/log" -w \
  -o "-p $PORT -k $TMP -c listen_addresses='' -c timezone=UTC" start >/dev/null

PSQL=("$PGBIN/psql" -h "$TMP" -p "$PORT" -U postgres -X -q -v ON_ERROR_STOP=1)
"${PSQL[@]}" -d postgres -c "create database tayanch_sinov" >/dev/null
PSQL+=(-d tayanch_sinov)

echo "Postgres: $("${PSQL[@]}" -At -c 'show server_version')"
"${PSQL[@]}" -f "$ROOT/supabase/tests/lokal-shim.sql" >/dev/null

for pass in 1 2; do
  for f in "$ROOT"/supabase/migrations/*.sql; do
    "${PSQL[@]}" -f "$f" >/dev/null 2>"$TMP/err" || { cat "$TMP/err"; echo "XATO: $pass-o'tish, $(basename "$f")"; exit 1; }
    if grep -q "ERROR" "$TMP/err"; then cat "$TMP/err"; exit 1; fi
  done
  echo "Migratsiyalar $pass-o'tish: xatosiz ($(ls "$ROOT"/supabase/migrations/*.sql | wc -l | tr -d ' ') fayl)"
done

# RLS hamma public jadvalda yoqilganmi
NO_RLS="$("${PSQL[@]}" -At -c "select string_agg(relname, ', ') from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity")"
if [[ -n "$NO_RLS" ]]; then echo "XATO: RLS o'chiq jadvallar: $NO_RLS"; exit 1; fi
echo "RLS: public sxemadagi $("${PSQL[@]}" -At -c "select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r'") jadvalning hammasida yoqilgan"

# security definer funksiyalarda search_path belgilanganmi
NO_SP="$("${PSQL[@]}" -At -c "select string_agg(n.nspname || '.' || p.proname, ', ') from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname in ('public', 'private') and p.prosecdef and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%')")"
if [[ -n "$NO_SP" ]]; then echo "XATO: search_path belgilanmagan security definer: $NO_SP"; exit 1; fi
echo "security definer: hammasida search_path belgilangan"

"${PSQL[@]}" -f "$ROOT/supabase/tests/rls_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/sessiya_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/analitika_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
