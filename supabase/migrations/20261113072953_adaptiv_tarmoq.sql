-- P31. Mock imtihon (adaptive-style): 2-modul tarmog'ini server tomonda tanlash.
-- src/lib/sat/adaptiv.ts dagi tarmoqTanla / tarmoqQiyinliklari qoidasining SQL nusxasi. Rasmiy SAT algoritmi (IRT) emas.
-- Hujjat: docs/sat-adaptiv.md ("P30 ga ulash rejasi"). Qiymatlar src/data/satAdaptiv.ts bilan bir xil
-- (src/lib/testlar/adaptiv.test.ts tekshiradi): Claude qarori, muallif topshirig'i bilan (2026-11-12).
--
-- Tarmoq brauzerda emas, shu yerda tanlanadi: P30 (mock imtihon) 1-modul (R&W) yoki 3-modul (Math) yopilganda chaqiradi.
-- Bu migratsiya P30 jadvallariga tegmaydi, faqat sof funksiyalar. Hammasi faqat egasi va security definer
-- funksiyalar uchun: anon, authenticated va service_role chaqira olmaydi.

-- Sozlama. Kalitlar: threshold (0–100 yoki null = adaptivlik o'chiq), easy / hard (questions.difficulty), min_rw / min_math.
create or replace function private.adaptive_config()
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object(
    'threshold', 60,
    'easy', jsonb_build_array(1, 2, 3),
    'hard', jsonb_build_array(3, 4, 5),
    'min_rw', 27,
    'min_math', 22
  )
$$;

-- Tarmoq: branch ('standart' | 'oson' | 'qiyin'), reason (JS dagi TarmoqSabab bilan bir xil), accuracy (%, yaxlitlanmagan).
-- Tartib JS bilan bir xil: chegara → savol soni → natija → taqqoslash. Taqqoslash butun sonlarda: correct * 100 > threshold * total.
create or replace function private.adaptive_branch(
  p_section text,
  p_correct integer,
  p_total integer,
  p_easy_count integer,
  p_hard_count integer,
  p_config jsonb default private.adaptive_config()
)
returns table (branch text, reason text, accuracy numeric)
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_threshold numeric;
  v_min integer;
  v_acc numeric;
begin
  if p_section is null or p_section not in ('rw', 'math') then
    raise exception 'adaptive_bad_section' using errcode = '22023';
  end if;

  v_acc := case
    when p_correct is null or p_total is null or p_total <= 0 or p_correct < 0 or p_correct > p_total then null
    else p_correct * 100.0 / p_total
  end;

  if jsonb_typeof(p_config -> 'threshold') = 'number' then
    v_threshold := (p_config ->> 'threshold')::numeric;
  end if;
  if v_threshold is null or v_threshold < 0 or v_threshold > 100 then
    return query select 'standart'::text, 'chegara-yoq'::text, v_acc;
    return;
  end if;

  v_min := (p_config ->> ('min_' || p_section))::integer;
  if v_min is null or p_easy_count is null or p_hard_count is null
     or p_easy_count < v_min or p_hard_count < v_min then
    return query select 'standart'::text, 'savol-kam'::text, v_acc;
    return;
  end if;

  if v_acc is null then
    return query select 'standart'::text, 'natija-yoq'::text, null::numeric;
    return;
  end if;

  if p_correct * 100 > v_threshold * p_total then
    return query select 'qiyin'::text, 'ustida'::text, v_acc;
  else
    return query select 'oson'::text, 'ostida'::text, v_acc;
  end if;
end
$$;

-- Tarmoq qiyinliklari: 'oson' / 'qiyin' → questions.difficulty ro'yxati, 'standart' → null (filtr yo'q, P30 ning oddiy tartibi).
create or replace function private.adaptive_difficulties(
  p_branch text,
  p_config jsonb default private.adaptive_config()
)
returns smallint[]
language sql
immutable
set search_path = ''
as $$
  select case p_branch
    when 'oson' then array(select jsonb_array_elements_text(p_config -> 'easy')::smallint)
    when 'qiyin' then array(select jsonb_array_elements_text(p_config -> 'hard')::smallint)
    else null
  end
$$;

revoke all on function private.adaptive_config() from public, anon, authenticated, service_role;
revoke all on function private.adaptive_branch(text, integer, integer, integer, integer, jsonb) from public, anon, authenticated, service_role;
revoke all on function private.adaptive_difficulties(text, jsonb) from public, anon, authenticated, service_role;
