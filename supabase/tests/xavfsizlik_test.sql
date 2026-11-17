-- P26: umumiy xavfsizlik sinovi (ruxsat ro'yxati asosida). Faqat katalogni o'qiydi, hech narsa yozmaydi.
-- Maqsad: yangi jadval yoki funksiya qo'shilganda anon/authenticated huquqi tasodifan ochilib qolsa ushlash.
-- rls_test.sql A/B/anon xatti-harakatini sinaydi; bu fayl esa HAMMA public obyektlarni ro'yxat bilan solishtiradi.
-- Lokal: npm run db:tekshir. Haqiqiy loyihada `db query --read-only` DO blokini qabul qilmaydi: bir xil tekshiruvlar
-- SELECT ko'rinishida docs/xavfsizlik-hisobot.md (Tekshiruv natijalari) da; 2026-11-12 da jonli bazada toza chiqdi.
-- Ro'yxatni o'zgartirish = ataylab qaror: yangi ochiq jadval/RPC qo'shilsa shu yerga sababi bilan yoziladi.
\set ON_ERROR_STOP on
\set QUIET on

do $$
declare
  v text;
begin
  -- X1. anon: jadval huquqi faqat ochiq katalogda (faol tariflar, tasdiqlangan so'zlar), faqat SELECT.
  select string_agg(format('%s:%s', c.relname, p.priv), ', ' order by c.relname, p.priv) into v
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  cross join unnest(array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER']) as p(priv)
  where n.nspname = 'public' and c.relkind in ('r', 'p', 'v', 'm')
    and has_table_privilege('anon', c.oid, p.priv)
    and format('%s:%s', c.relname, p.priv) not in ('plans:SELECT', 'vocab_words:SELECT');
  if v is not null then raise exception 'FAIL X1 anon kutilmagan jadval huquqi: %', v; end if;

  -- X1b. anon: ustun darajasidagi huquq ham yo'q (ruxsat ro'yxatidagi jadvallardan tashqari).
  select string_agg(distinct format('%s.%s', c.relname, a.attname), ', ') into v
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
  where n.nspname = 'public' and c.relkind in ('r', 'p')
    and c.relname not in ('plans', 'vocab_words')
    and (has_column_privilege('anon', c.oid, a.attnum, 'SELECT')
         or has_column_privilege('anon', c.oid, a.attnum, 'INSERT')
         or has_column_privilege('anon', c.oid, a.attnum, 'UPDATE'));
  if v is not null then raise exception 'FAIL X1b anon ustun huquqi: %', v; end if;
  raise notice 'OK X1 anon: faqat plans va vocab_words SELECT, boshqa jadval/ustun huquqi yo''q';

  -- X2. anon: public funksiyalardan faqat kun savoli (event_trigger funksiyalari RPC orqali chaqirilmaydi).
  select string_agg(p.proname, ', ' order by p.proname) into v
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prorettype <> 'pg_catalog.event_trigger'::regtype
    and has_function_privilege('anon', p.oid, 'EXECUTE')
    and p.proname not in ('daily_question_public', 'check_daily_answer');
  if v is not null then raise exception 'FAIL X2 anon kutilmagan RPC: %', v; end if;
  raise notice 'OK X2 anon RPC: faqat daily_question_public va check_daily_answer';

  -- X3. authenticated: admin va to'lov holatini yozuvchi funksiyalar faqat service_role uchun.
  select string_agg(p.proname, ', ' order by p.proname) into v
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and (p.proname like 'admin\_%' or p.proname in
         ('payment_create', 'payment_set_invoice', 'payment_apply_event', 'payment_pending_stale'))
    and (has_function_privilege('authenticated', p.oid, 'EXECUTE') or has_function_privilege('anon', p.oid, 'EXECUTE'));
  if v is not null then raise exception 'FAIL X3 admin/to''lov funksiyasi ochiq: %', v; end if;
  raise notice 'OK X3 admin_* va payment_create/set_invoice/apply_event/pending_stale: anon va authenticated chaqira olmaydi';

  -- X4. authenticated: server yozadigan jadvallarga to'g'ridan-to'g'ri yozuv yo'q.
  select string_agg(format('%s:%s', t.nom, p.priv), ', ') into v
  from unnest(array['questions', 'plans', 'payments', 'subscriptions', 'payment_events', 'usage_counters',
                    'audit_log', 'daily_picks', 'practice_sessions', 'session_questions', 'vocab_words']) as t(nom)
  cross join unnest(array['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE']) as p(priv)
  where to_regclass('public.' || t.nom) is not null
    and has_table_privilege('authenticated', ('public.' || t.nom)::regclass, p.priv);
  if v is not null then raise exception 'FAIL X4 authenticated server jadvaliga yoza oladi: %', v; end if;

  -- X4b. attempts: faqat flagged ustunini yangilash (is_correct, answer emas).
  if has_column_privilege('authenticated', 'public.attempts', 'is_correct', 'UPDATE')
     or has_column_privilege('authenticated', 'public.attempts', 'answer', 'UPDATE')
     or has_table_privilege('authenticated', 'public.attempts', 'INSERT') then
    raise exception 'FAIL X4b attempts: is_correct/answer yoki insert ochiq';
  end if;
  raise notice 'OK X4 authenticated: savol, tarif, to''lov, obuna, kvota, audit va sessiya jadvallariga to''g''ridan-to''g''ri yoza olmaydi';

  -- X5. questions: hech bir ustuni (correct, explanation ham) anon/authenticated uchun o'qilmaydi.
  select string_agg(a.attname, ', ') into v
  from pg_attribute a
  where a.attrelid = 'public.questions'::regclass and a.attnum > 0 and not a.attisdropped
    and (has_column_privilege('anon', a.attrelid, a.attnum, 'SELECT')
         or has_column_privilege('authenticated', a.attrelid, a.attnum, 'SELECT'));
  if v is not null then raise exception 'FAIL X5 questions ustunlari o''qiladi: %', v; end if;
  raise notice 'OK X5 questions: to''g''ridan-to''g''ri SELECT yo''q (faqat RPC orqali, javobsiz)';

  -- X6. user_id ustuni bor har jadval: RLS yoqilgan va anon/authenticated policy'lari auth.uid() ga bog'langan.
  select string_agg(distinct format('%s(%s)', c.relname, coalesce(pol.polname, 'RLS o''chiq')), ', ') into v
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid and a.attname = 'user_id' and not a.attisdropped
  left join pg_policy pol on pol.polrelid = c.oid and pol.polpermissive
  where n.nspname = 'public' and c.relkind = 'r'
    and (not c.relrowsecurity
         or (pol.oid is not null
             and coalesce(pg_get_expr(pol.polqual, pol.polrelid), '') || coalesce(pg_get_expr(pol.polwithcheck, pol.polrelid), '')
                 not like '%auth.uid()%'));
  if v is not null then raise exception 'FAIL X6 user_id jadvali auth.uid() siz policy bilan: %', v; end if;

  -- X6b. user_id siz bola jadvallar (session_questions, official_mistakes, plan_tasks): ota jadval orqali cheklangan.
  select string_agg(distinct format('%s(%s)', c.relname, pol.polname), ', ') into v
  from pg_policy pol
  join pg_class c on c.oid = pol.polrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in ('session_questions', 'official_mistakes', 'plan_tasks')
    and coalesce(pg_get_expr(pol.polqual, pol.polrelid), '') || coalesce(pg_get_expr(pol.polwithcheck, pol.polrelid), '')
        not like '%auth.uid()%';
  if v is not null then raise exception 'FAIL X6b bola jadval policy''si egaga bog''lanmagan: %', v; end if;
  raise notice 'OK X6 user_id bor hamma jadvalda RLS yoqilgan, policy''lar auth.uid() ga bog''langan';

  -- X7. private sxema API'ga chiqmaydi.
  if has_schema_privilege('anon', 'private', 'USAGE') or has_schema_privilege('authenticated', 'private', 'USAGE') then
    raise exception 'FAIL X7 private sxemada anon/authenticated USAGE bor';
  end if;
  raise notice 'OK X7 private sxema: anon va authenticated uchun USAGE yo''q';

  -- X8. public view yo'q (view RLS'ni chetlab o'tishi mumkin); bo'lsa security_invoker bo'lishi shart.
  select string_agg(c.relname, ', ') into v
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind in ('v', 'm')
    and not coalesce(c.reloptions @> array['security_invoker=true'], false);
  if v is not null then raise exception 'FAIL X8 security_invoker siz view: %', v; end if;
  raise notice 'OK X8 public sxemada RLS''ni chetlab o''tadigan view yo''q';

  -- X9. Savol rasmlari bucketi ochiq emas.
  if exists (select 1 from storage.buckets where public) then
    select string_agg(id, ', ') into v from storage.buckets where public;
    raise exception 'FAIL X9 ochiq bucket: %', v;
  end if;
  raise notice 'OK X9 storage: ochiq bucket yo''q';

  raise notice 'XAVFSIZLIK SINOVLARI O''TDI';
end
$$;
