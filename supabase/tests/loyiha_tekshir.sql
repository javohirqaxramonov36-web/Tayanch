-- Supabase loyihasi holatini tekshirish: `supabase db push --remote` dan keyin.
-- FAQAT O'QIYDI: hech narsa yozmaydi, o'chirmaydi. Bitta SELECT, shuning uchun Dashboard → SQL Editor'da ham,
-- psql'da ham ishlaydi (psql meta-buyruqlari yo'q). Lokal sinovda ham ishlaydi (lokal-shim.sql bilan).
--
-- Natija: jadval (tartib, tekshiruv, holat, tafsilot). holat = 'ok' | 'XATO' | 'info'.
-- Hamma qator 'ok' yoki 'info' bo'lishi kerak. 'XATO' qatorining tafsilotida nima farq qilgani yozilgan.
--
-- "huquq: ..." qatorlari anon va authenticated rollarining jadval va ustun huquqlarini lokal sinovdagi
-- (supabase/tests/lokal-shim.sql + migratsiyalar, Postgres 17, 2026-11-09) natija bilan solishtiradi.
-- Migratsiya huquqlarni o'zgartirsa, pastdagi `kutilgan_huquq` ro'yxati ham yangilanadi.

with
jadvallar as (
  select c.oid, c.relname, c.relrowsecurity
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind in ('r', 'p')
),
kutilgan_huquq (jadval, rol, huquqlar) as (values
  ('attempts', 'anon', ''),
  ('attempts', 'authenticated', 'SELECT UPDATE(flagged)'),
  ('audit_log', 'anon', ''),
  ('audit_log', 'authenticated', ''),
  ('bookmarks', 'anon', ''),
  ('bookmarks', 'authenticated', 'DELETE,INSERT,SELECT'),
  ('events', 'anon', ''),
  ('events', 'authenticated', 'INSERT(name),INSERT(page),INSERT(props)'),
  ('feedback', 'anon', ''),
  ('feedback', 'authenticated', 'SELECT INSERT(message),INSERT(page),INSERT(rating)'),
  ('official_mistakes', 'anon', ''),
  ('official_mistakes', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('official_tests', 'anon', ''),
  ('official_tests', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('payment_events', 'anon', ''),
  ('payment_events', 'authenticated', ''),
  ('payments', 'anon', ''),
  ('payments', 'authenticated', 'SELECT(amount_uzs),SELECT(bolim),SELECT(created_at),SELECT(id),SELECT(paid_at),SELECT(plan_code),SELECT(provider),SELECT(provider_order_id),SELECT(status),SELECT(user_id)'),
  ('plan_tasks', 'anon', ''),
  ('plan_tasks', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('plans', 'anon', 'SELECT'),
  ('plans', 'authenticated', 'SELECT'),
  ('practice_sessions', 'anon', ''),
  ('practice_sessions', 'authenticated', 'SELECT'),
  ('profiles', 'anon', ''),
  ('profiles', 'authenticated', 'SELECT UPDATE(consent_version),UPDATE(country),UPDATE(display_name),UPDATE(exam_date),UPDATE(locale),UPDATE(nickname),UPDATE(target_score)'),
  ('questions', 'anon', ''),
  ('questions', 'authenticated', ''),
  ('reports', 'anon', ''),
  ('reports', 'authenticated', 'SELECT INSERT(message),INSERT(question_id),INSERT(reason),INSERT(session_id)'),
  ('review_queue', 'anon', ''),
  ('review_queue', 'authenticated', 'DELETE,SELECT UPDATE(note),UPDATE(reason_tag)'),
  ('session_questions', 'anon', ''),
  ('session_questions', 'authenticated', 'SELECT'),
  ('study_plans', 'anon', ''),
  ('study_plans', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('subscriptions', 'anon', ''),
  ('subscriptions', 'authenticated', 'SELECT'),
  ('usage_counters', 'anon', ''),
  ('usage_counters', 'authenticated', 'SELECT'),
  ('user_state', 'anon', ''),
  ('user_state', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('vocab_progress', 'anon', ''),
  ('vocab_progress', 'authenticated', 'DELETE,INSERT,SELECT,UPDATE'),
  ('vocab_words', 'anon', 'SELECT'),
  ('vocab_words', 'authenticated', 'SELECT')
),
haqiqiy_huquq as (
  select j.relname as jadval, r.rol,
         concat_ws(' ',
           (select string_agg(x.privilege_type, ',' order by x.privilege_type)
              from pg_class c, aclexplode(c.relacl) x
             where c.oid = j.oid and x.grantee = r.rol::regrole::oid),
           (select string_agg(x.privilege_type || '(' || a.attname || ')', ',' order by x.privilege_type, a.attname)
              from pg_attribute a, aclexplode(a.attacl) x
             where a.attrelid = j.oid and a.attnum > 0 and not a.attisdropped
               and x.grantee = r.rol::regrole::oid)) as huquqlar
    from jadvallar j
   cross join (values ('anon'), ('authenticated')) r (rol)
),
huquq_farqi as (
  select coalesce(k.jadval, h.jadval) as jadval, coalesce(k.rol, h.rol) as rol,
         k.huquqlar as kutilgan, h.huquqlar as haqiqiy
    from kutilgan_huquq k
    full join haqiqiy_huquq h on h.jadval = k.jadval and h.rol = k.rol
   where k.huquqlar is distinct from h.huquqlar
),
kutilgan_rpc (imzo, anon, authenticated, service_role) as (values
  ('public.question_counts(jsonb)', false, true, true),
  ('public.start_session(jsonb,integer,text)', false, true, true),
  ('public.submit_answer(uuid,uuid,text,integer)', false, true, true),
  ('public.daily_question()', false, true, true),
  ('public.start_review_session(integer)', false, true, true),
  ('public.usage_status()', false, true, true),
  ('public.can_read_question_figure(text)', false, true, true),
  ('public.admin_grant_plan(uuid,text,integer,text,text)', false, false, true),
  ('public.admin_hide_question(text,text,text)', false, false, true),
  ('public.payment_create(uuid,text)', false, false, true),
  ('public.payment_set_invoice(uuid,text,jsonb)', false, false, true),
  ('public.payment_apply_event(jsonb)', false, false, true),
  ('public.payment_pending_stale(integer,integer,integer)', false, false, true),
  ('public.get_session(uuid)', false, true, true),
  ('public.finish_session(uuid)', false, true, true),
  ('public.add_to_review(uuid)', false, true, true)
),
rpc as (
  select k.*, to_regprocedure(k.imzo) as oid from kutilgan_rpc k
),
natija (tartib, tekshiruv, holat, tafsilot) as (
  -- 1. RLS hamma public jadvalda
  select 10, 'rls: public jadvallar',
         case when count(*) filter (where not relrowsecurity) = 0 and count(*) = 23 then 'ok' else 'XATO' end,
         count(*) || ' jadval (kutilgan 23); RLS o''chiq: '
           || coalesce(string_agg(relname, ', ' order by relname) filter (where not relrowsecurity), 'yo''q')
    from jadvallar

  -- 2. RPC'lar bor va EXECUTE huquqi to'g'ri
  union all
  select 20, 'rpc: funksiyalar bor',
         case when count(*) filter (where oid is null) = 0 then 'ok' else 'XATO' end,
         count(*) filter (where oid is not null) || ' / ' || count(*)
           || coalesce('; yo''q: ' || string_agg(imzo, ', ') filter (where oid is null), '')
    from rpc
  union all
  select 21, 'rpc: execute huquqi (anon / authenticated / service_role)',
         case when count(*) filter (where oid is not null and (
                     has_function_privilege('anon', oid, 'execute') <> anon
                  or has_function_privilege('authenticated', oid, 'execute') <> authenticated
                  or has_function_privilege('service_role', oid, 'execute') <> service_role)) = 0
              then 'ok' else 'XATO' end,
         coalesce('farq: ' || string_agg(imzo, ', ') filter (where oid is not null and (
                     has_function_privilege('anon', oid, 'execute') <> anon
                  or has_function_privilege('authenticated', oid, 'execute') <> authenticated
                  or has_function_privilege('service_role', oid, 'execute') <> service_role)),
                  'anon hech birini, authenticated 7 tasini, admin_* va payment_* ni faqat service_role chaqiradi')
    from rpc
  union all
  select 22, 'rpc: anon chaqira oladigan boshqa public funksiyalar',
         case when count(*) = 0 then 'ok' else 'XATO' end,
         coalesce(string_agg(p.oid::regprocedure::text, ', '), 'yo''q')
    from pg_proc p
   where p.pronamespace = 'public'::regnamespace
     and has_function_privilege('anon', p.oid, 'execute')
     and p.prorettype not in ('trigger'::regtype, 'event_trigger'::regtype)
  -- Trigger funksiyalarini to'g'ridan-to'g'ri (RPC) chaqirib bo'lmaydi, shuning uchun 22 ga kirmaydi.
  -- Haqiqiy loyihada Supabase o'zi qo'shgan public.rls_auto_enable() (event trigger ensure_rls) shu yerda ko'rinadi.
  union all
  select 23, 'info: public sxemadagi trigger funksiyalari (RPC orqali chaqirilmaydi)', 'info',
         coalesce(string_agg(p.oid::regprocedure::text || ' ' || p.prorettype::regtype::text
                             || ' anon=' || has_function_privilege('anon', p.oid, 'execute')::text
                             || coalesce(' event trigger: ' || (select string_agg(e.evtname || ' ' || e.evtevent, ', ')
                                                                 from pg_event_trigger e where e.evtfoid = p.oid), ''),
                             '; '), 'yo''q')
    from pg_proc p
   where p.pronamespace = 'public'::regnamespace
     and p.prorettype in ('trigger'::regtype, 'event_trigger'::regtype)

  -- 3. security definer funksiyalarda search_path belgilangan
  union all
  select 30, 'security definer: search_path',
         case when count(*) = 0 then 'ok' else 'XATO' end,
         coalesce('belgilanmagan: ' || string_agg(n.nspname || '.' || p.proname, ', '), 'hammasida belgilangan')
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
   where n.nspname in ('public', 'private') and p.prosecdef
     and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%')

  -- 4. private sxema API rollariga yopiq
  union all
  select 40, 'private sxema: anon/authenticated uchun yopiq',
         case when not has_schema_privilege('anon', 'private', 'usage')
               and not has_schema_privilege('authenticated', 'private', 'usage') then 'ok' else 'XATO' end,
         'usage: anon=' || has_schema_privilege('anon', 'private', 'usage')
           || ', authenticated=' || has_schema_privilege('authenticated', 'private', 'usage')

  -- 5. Jadval va ustun huquqlari lokal sinov bilan bir xil
  union all
  select 50, 'huquq: anon/authenticated jadval va ustun huquqlari lokal sinov bilan bir xil',
         case when (select count(*) from huquq_farqi) = 0 then 'ok' else 'XATO' end,
         (select count(*) from haqiqiy_huquq) || ' qator (kutilgan ' || (select count(*) from kutilgan_huquq) || '); farqlar: '
           || (select count(*) from huquq_farqi)
  union all
  select 51, 'huquq farqi: ' || jadval || ' / ' || rol, 'XATO',
         'kutilgan: ' || coalesce(nullif(kutilgan, ''), '(yo''q)') || ' | haqiqiy: ' || coalesce(nullif(haqiqiy, ''), '(yo''q)')
    from huquq_farqi

  -- 6. Storage: yopiq bucket va o'qish siyosati
  union all
  select 60, 'storage: question-figures bucket, Public = off',
         case when count(*) = 1 and bool_and(not public) then 'ok' else 'XATO' end,
         case when count(*) = 0 then 'bucket yo''q' else 'public = ' || bool_or(public) end
    from storage.buckets
   where id = 'question-figures'
  union all
  select 61, 'storage: question_figures_served_read siyosati',
         case when count(*) = 1 then 'ok' else 'XATO' end,
         count(*) || ' ta (kutilgan 1)'
    from pg_policies
   where schemaname = 'storage' and tablename = 'objects' and policyname = 'question_figures_served_read'

  -- 7. Yangi foydalanuvchi uchun profil trigger'i
  union all
  select 70, 'auth.users: on_auth_user_created trigger',
         case when count(*) = 1 and bool_and(t.tgenabled <> 'D') then 'ok' else 'XATO' end,
         count(*) || ' ta (kutilgan 1, yoqilgan)'
    from pg_trigger t
   where t.tgrelid = 'auth.users'::regclass and t.tgname = 'on_auth_user_created'

  -- 8. SPR normallash sinovlari
  union all
  select 80, 'spr: private.run_spr_tests() bo''sh',
         case when (select count(*) from private.run_spr_tests()) = 0 then 'ok' else 'XATO' end,
         (select count(*) from private.run_spr_tests()) || ' ta o''tmagan holat, jami '
           || (select count(*) from private.spr_test_cases) || ' holat'

  -- 9. Ma'lumot holati: tariflar bo'sh, savol yo'q, sinov qoldig'i yo'q
  union all
  select 90, 'plans: free, pro, elite; limits = {}, price_uzs = null (P19 gacha)',
         case when count(*) = 3 and bool_and(limits = '{}'::jsonb and price_uzs is null) then 'ok' else 'XATO' end,
         string_agg(code || ' limits=' || limits::text || ' narx=' || coalesce(price_uzs::text, 'null'), '; ' order by code)
    from public.plans
   where code in ('free', 'pro', 'elite')
  union all
  select 91, 'questions: bo''sh (savol mazmuni yuklanmagan)',
         case when count(*) = 0 then 'ok' else 'info' end,
         count(*) || ' ta savol'
    from public.questions
  union all
  select 92, 'sinov qoldig''i yo''q (rls_test.sql ROLLBACK qildi)',
         case when (select count(*) from auth.users where email like '%@sinov.invalid') = 0
               and (select count(*) from public.questions where external_id like 'sinov-%') = 0
               and (select count(*) from storage.objects where bucket_id = 'question-figures' and name like 'sinov/%') = 0
              then 'ok' else 'XATO' end,
         'auth.users: ' || (select count(*) from auth.users where email like '%@sinov.invalid')
           || ', questions: ' || (select count(*) from public.questions where external_id like 'sinov-%')
           || ', storage: ' || (select count(*) from storage.objects where bucket_id = 'question-figures' and name like 'sinov/%')

  -- 10. Realtime: public jadvallar efirga chiqmaydi
  union all
  select 100, 'realtime: public jadvallar publikatsiyada emas',
         case when count(*) = 0 then 'ok' else 'XATO' end,
         coalesce(string_agg(pubname || ':' || tablename, ', '), 'yo''q')
    from pg_publication_tables
   where schemaname = 'public'

  -- 11. Ma'lumot uchun: standart huquqlar (lokal shim bilan solishtirish uchun)
  union all
  select 110, 'info: public sxemadagi standart huquqlar (pg_default_acl)', 'info',
         coalesce(string_agg(d.defaclrole::regrole::text || ' ' || d.defaclobjtype::text || ' '
                             || array_to_string(d.defaclacl, ' '), '; '
                             order by d.defaclrole::regrole::text, d.defaclobjtype::text), 'yo''q')
    from pg_default_acl d
   where d.defaclnamespace = 'public'::regnamespace
  union all
  select 111, 'info: Postgres versiyasi', 'info', current_setting('server_version')
)
select tartib, tekshiruv, holat, tafsilot
  from natija
 order by tartib, tekshiruv;
