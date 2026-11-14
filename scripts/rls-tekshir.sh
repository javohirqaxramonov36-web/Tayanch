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
cd "$ROOT"
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
cat > "$TMP/create.sql" <<'SQL'
create database tayanch_sinov;
SQL
"${PSQL[@]}" -d postgres -f "$TMP/create.sql" >/dev/null
PSQL+=(-d tayanch_sinov)

cat > "$TMP/version.sql" <<'SQL'
show server_version;
SQL
echo "Postgres: $("${PSQL[@]}" -At -f "$TMP/version.sql")"
"${PSQL[@]}" -f "$ROOT/supabase/tests/lokal-shim.sql" >/dev/null

for pass in 1 2; do
  for f in "$ROOT"/supabase/migrations/*.sql; do
    "${PSQL[@]}" -f "$f" >/dev/null 2>"$TMP/err" || { cat "$TMP/err"; echo "XATO: $pass-o'tish, $(basename "$f")"; exit 1; }
    if grep -q "ERROR" "$TMP/err"; then cat "$TMP/err"; exit 1; fi
  done
  echo "Migratsiyalar $pass-o'tish: xatosiz ($(ls "$ROOT"/supabase/migrations/*.sql | wc -l | tr -d ' ') fayl)"
done

# RLS hamma public jadvalda yoqilganmi
cat > "$TMP/rls.sql" <<'SQL'
select string_agg(relname, ', ') from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity;
SQL
cat > "$TMP/tables.sql" <<'SQL'
select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r';
SQL
NO_RLS="$("${PSQL[@]}" -At -f "$TMP/rls.sql")"
if [[ -n "$NO_RLS" ]]; then echo "XATO: RLS o'chiq jadvallar: $NO_RLS"; exit 1; fi
echo "RLS: public sxemadagi $("${PSQL[@]}" -At -f "$TMP/tables.sql") jadvalning hammasida yoqilgan"

# security definer funksiyalarda search_path belgilanganmi
cat > "$TMP/search-path.sql" <<'SQL'
select string_agg(n.nspname || '.' || p.proname, ', ') from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('public', 'private') and p.prosecdef
  and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%');
SQL
NO_SP="$("${PSQL[@]}" -At -f "$TMP/search-path.sql")"
if [[ -n "$NO_SP" ]]; then echo "XATO: search_path belgilanmagan security definer: $NO_SP"; exit 1; fi
echo "security definer: hammasida search_path belgilangan"

"${PSQL[@]}" -f "$ROOT/supabase/tests/rls_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/sessiya_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/kurs_sessiya_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/kurs_spr_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/analitika_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/lugat_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/kvota_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/kun_savoli_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/xato_daftari_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/obuna_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/xavfsizlik_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/adaptiv_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/xabar_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/ai_tutor_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/mock_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'
"${PSQL[@]}" -f "$ROOT/supabase/tests/guruh_test.sql" 2>&1 | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'

"${PSQL[@]}" -f "$ROOT/supabase/tests/metrikalar_test.sql" 2>&1 | grep -v "WARNING:" | sed -E 's/^psql:.*:[0-9]+: (NOTICE|WARNING|ERROR):  /  \1: /'

# P25: docs/metrikalar.sql sun'iy ma'lumotda. Kutilgan har qator natijada aynan bo'lishi kerak.
"${PSQL[@]}" -f "$ROOT/supabase/tests/metrikalar_sorov_malumot.sql" > "$TMP/metrika.kutilgan"
"${PSQL[@]}" -At -F '|' -f "$ROOT/docs/metrikalar.sql" > "$TMP/metrika.natija"
"${PSQL[@]}" -c "delete from public.payments where provider_order_id in ('ms-1', 'ms-2');
  delete from auth.users where id::text like '00000000-0000-4000-8000-0000000000d_';" >/dev/null
TOPILMADI=0
while IFS= read -r qator; do
  [[ -z "$qator" ]] && continue
  grep -Fxq -- "$qator" "$TMP/metrika.natija" || { echo "XATO: metrikalar.sql natijasida yo'q: $qator"; TOPILMADI=1; }
done < "$TMP/metrika.kutilgan"
if [[ "$TOPILMADI" == "1" ]]; then echo "--- natija:"; cat "$TMP/metrika.natija"; exit 1; fi
echo "  NOTICE: OK MS01 docs/metrikalar.sql: $(grep -c . "$TMP/metrika.kutilgan") kutilgan qator sun'iy ma'lumotda topildi (DAU, WAU, ro'yxat, D1/D7, funnel, daromad)"

# P19 K06: parallel so'rovlar. 10 ta alohida ulanish bir vaqtda 1 birlikdan sarflaydi, limit 3:
# aynan 3 tasi o'tishi, hisoblagich 3 bo'lishi kerak (hisoblagich qatori hali yo'q: insert poygasi ham sinaladi).
# Bu ma'lumot tranzaksiyadan tashqarida yoziladi; vaqtinchalik klaster oxirida o'chiriladi.
U_PAR="00000000-0000-4000-8000-0000000000f6"
cat > "$TMP/parallel-setup.sql" <<'SQL'
insert into auth.users (id, email, raw_user_meta_data) values (:'uid', 'kp@sinov.invalid', '{}');
update public.plans set limits = limits || '{"parallel_sinov": {"max": 3, "per": "day"}}' where code = 'free';
SQL
cat > "$TMP/parallel-use.sql" <<'SQL'
select pg_sleep(0.2);
select private.consume_quota(:'uid', 'parallel_sinov', 1);
SQL
cat > "$TMP/parallel-check.sql" <<'SQL'
select coalesce(sum(count), 0) from public.usage_counters where user_id = :'uid' and key = 'parallel_sinov';
SQL
cat > "$TMP/parallel-cleanup.sql" <<'SQL'
update public.plans set limits = limits - 'parallel_sinov' where code = 'free';
delete from auth.users where id = :'uid';
SQL
"${PSQL[@]}" -v uid="$U_PAR" -f "$TMP/parallel-setup.sql" >/dev/null
for i in $(seq 1 10); do
  ( "${PSQL[@]}" -At -v uid="$U_PAR" -f "$TMP/parallel-use.sql" \
      >/dev/null 2>&1 && echo ok > "$TMP/par.$i" || echo rad > "$TMP/par.$i" ) &
done
wait
OTDI="$(cat "$TMP"/par.* | grep -c '^ok$' || true)"
SON="$("${PSQL[@]}" -At -v uid="$U_PAR" -f "$TMP/parallel-check.sql")"
"${PSQL[@]}" -v uid="$U_PAR" -f "$TMP/parallel-cleanup.sql" >/dev/null
if [[ "$OTDI" == "3" && "$SON" == "3" ]]; then
  echo "  NOTICE: OK K06 parallel: 10 ta bir vaqtdagi so'rovdan 3 tasi o'tdi (limit 3), hisoblagich 3"
else
  echo "XATO: K06 parallel: o'tdi=$OTDI, hisoblagich=$SON (kutilgan 3 va 3)"; exit 1
fi
