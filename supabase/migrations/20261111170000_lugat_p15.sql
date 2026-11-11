-- P15. Lug'at: so'z ustunlari (qiyinlik, mavzu, o'zbekcha), Leitner takrorlash, kunlik YANGI so'z kvotasi,
-- yulduzcha, o'z so'zlarim (tarif bayrog'i bilan) va brauzerdagi tayanch:sat-lugat ni bir marta ko'chirish.
-- Takror ishga tushirilsa buzilmaydi.
--
-- Leitner oraliqlari src/lib/leitner.ts (takrorlash.ts) bilan bir xil: to'g'ri ("I know it") 1→2 3 kun, 2→3 7, 3→4 14,
-- 4-qutida to'g'ri = 5 (o'zlashtirildi); "Still learning" → 1-quti, ertaga. Yangi so'z (box null) 1-qutidan boshlanadi.
-- Kvota kaliti new_words (0008_rpc.sql ro'yxatiga qo'shimcha): so'z birinchi marta baholanganda +1.
-- Qiymat plans.limits da (P19: hozircha kalit yo'q = cheklov yo'q). Takrorlash (box bor so'z) hech qachon cheklanmaydi.
-- O'z so'zlarim: plans.features ichida {"flag": "vocab_my_words"} obyekti. Tarif sahifasi features dan faqat
-- satrlarni ko'rsatadi, shuning uchun bayroq ekranga chiqmaydi.

------------------------------------------------------------------------------
-- So'zlar
------------------------------------------------------------------------------

alter table public.vocab_words add column if not exists difficulty text;
alter table public.vocab_words add column if not exists topic text;
alter table public.vocab_words add column if not exists uzbek text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'vocab_words_difficulty_check') then
    alter table public.vocab_words add constraint vocab_words_difficulty_check
      check (difficulty in ('easy', 'medium', 'hard'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'vocab_words_topic_check') then
    alter table public.vocab_words add constraint vocab_words_topic_check
      check (char_length(topic) between 1 and 40);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'vocab_words_uzbek_check') then
    alter table public.vocab_words add constraint vocab_words_uzbek_check
      check (char_length(uzbek) between 1 and 120);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'vocab_words_matn_check') then
    alter table public.vocab_words add constraint vocab_words_matn_check
      check (char_length(definition) between 1 and 300 and (example is null or char_length(example) between 1 and 300));
  end if;
end
$$;

------------------------------------------------------------------------------
-- Progress: yozish faqat RPC orqali (kvotani chetlab o'tib bo'lmasin)
------------------------------------------------------------------------------

alter table public.vocab_progress add column if not exists starred boolean not null default false;

-- 0005 da select/insert/update/delete berilgan edi. insert/update olib tashlanadi; delete qoladi (o'z progressini
-- o'chirish: keyin so'z yana "yangi" bo'ladi va kvotaga qayta hisoblanadi, ya'ni chetlab o'tish emas).
revoke insert, update on table public.vocab_progress from authenticated;

------------------------------------------------------------------------------
-- O'z so'zlarim
------------------------------------------------------------------------------

create table if not exists public.user_vocab_words (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  word           text not null check (char_length(word) between 1 and 80),
  part_of_speech text check (char_length(part_of_speech) between 1 and 20),
  definition     text not null check (char_length(definition) between 1 and 300),
  example        text check (char_length(example) between 1 and 300),
  box            smallint check (box between 1 and 5),
  next_due       date,
  status         text not null default 'new' check (status in ('new', 'learning', 'known')),
  starred        boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create unique index if not exists user_vocab_words_word_key on public.user_vocab_words (user_id, lower(word));

create or replace trigger user_vocab_words_updated_at before update on public.user_vocab_words
  for each row execute function private.set_updated_at();

-- O'qish va o'chirish: o'ziniki. Qo'shish va o'zgartirish faqat RPC orqali (bayroq tekshiruvi serverda).
alter table public.user_vocab_words enable row level security;
revoke all on table public.user_vocab_words from anon, authenticated;
grant select, delete on table public.user_vocab_words to authenticated;

drop policy if exists user_vocab_words_select_own on public.user_vocab_words;
create policy user_vocab_words_select_own on public.user_vocab_words
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists user_vocab_words_delete_own on public.user_vocab_words;
create policy user_vocab_words_delete_own on public.user_vocab_words
  for delete to authenticated using (user_id = (select auth.uid()));

-- Brauzerdagi lug'at holati hisobga bir marta ko'chiriladi (qayta import bilan kvotani chetlab o'tib bo'lmasin).
create table if not exists private.vocab_imports (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  words       integer not null default 0,
  imported_at timestamptz not null default now()
);

------------------------------------------------------------------------------
-- Yordamchilar
------------------------------------------------------------------------------

-- Leitner: keyingi quti va sana. p_box null = yangi so'z (1-quti deb olinadi).
create or replace function private.leitner_next(p_box smallint, p_known boolean, p_today date,
                                                out box smallint, out next_due date)
language plpgsql
immutable
set search_path = ''
as $$
declare
  b smallint := coalesce(p_box, 1);
begin
  if not p_known then
    box := 1; next_due := p_today + 1;
  elsif b >= 4 then
    box := 5; next_due := p_today;
  else
    box := b + 1;
    next_due := p_today + (case b when 1 then 3 when 2 then 7 else 14 end);
  end if;
end
$$;

create or replace function private.plan_has_flag(p_user uuid, p_flag text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from jsonb_array_elements((private.current_plan(p_user, 'sat')).features) f
    where jsonb_typeof(f) = 'object' and f ->> 'flag' = p_flag
  )
$$;

-- Sof qiymat tekshiruvi: bo'sh satr null bo'ladi, chetdagi bo'shliq olinadi.
create or replace function private.toza(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(btrim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g')), '')
$$;

revoke all on all functions in schema private from public;

------------------------------------------------------------------------------
-- RPC
------------------------------------------------------------------------------

-- Lug'at holati: yangi so'z kvotasi, o'z so'zlari bayrog'i, bugungi sana (Toshkent), import qilinganmi.
create or replace function public.vocab_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_plan  public.plans := private.current_plan(v_user, 'sat');
  v_rule  jsonb := v_plan.limits -> 'new_words';
  v_max   integer;
  v_used  integer;
begin
  if jsonb_typeof(v_rule) = 'object' and jsonb_typeof(v_rule -> 'max') = 'number' then
    v_max := (v_rule ->> 'max')::integer;
  end if;
  select c.count into v_used
  from public.usage_counters c
  where c.user_id = v_user and c.key = 'new_words'
    and c.period_start = private.period_start(coalesce(v_rule ->> 'per', 'day'));
  return jsonb_build_object(
    'today', private.today_tashkent(),
    'plan', v_plan.code,
    'new_words', jsonb_build_object(
      'max', v_max,
      'used', coalesce(v_used, 0),
      'remaining', case when v_max is null then null else greatest(v_max - coalesce(v_used, 0), 0) end),
    'my_words', private.plan_has_flag(v_user, 'vocab_my_words'),
    'imported', exists (select 1 from private.vocab_imports i where i.user_id = v_user)
  );
end
$$;

-- Baholash: p_known true = "I know it", false = "Still learning". p_own: o'z so'zi (user_vocab_words.id).
-- Yangi so'z (progress yo'q yoki box null) birinchi marta baholanganda new_words kvotasi sarflanadi;
-- kvota tugasa 'quota_exceeded' (P0001) va hech narsa yozilmaydi.
create or replace function public.vocab_rate(p_word uuid, p_known boolean, p_own boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
  v_box   smallint;
  v_star  boolean;
  v_next  record;
  v_found boolean;
begin
  if p_word is null or p_known is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  if p_own then
    select w.box into v_box from public.user_vocab_words w
    where w.id = p_word and w.user_id = v_user for update;
    if not found then
      raise exception 'word_not_found' using errcode = 'P0002';
    end if;
    select * into v_next from private.leitner_next(v_box, p_known, v_today);
    update public.user_vocab_words
       set box = v_next.box, next_due = v_next.next_due,
           status = case when p_known then 'known' else 'learning' end
     where id = p_word
    returning starred into v_star;
  else
    if not exists (select 1 from public.vocab_words w where w.id = p_word and w.status = 'verified') then
      raise exception 'word_not_found' using errcode = 'P0002';
    end if;
    select p.box, true into v_box, v_found from public.vocab_progress p
    where p.user_id = v_user and p.word_id = p_word for update;
    if v_found is null or v_box is null then
      perform private.consume_quota(v_user, 'new_words', 1);
    end if;
    select * into v_next from private.leitner_next(v_box, p_known, v_today);
    insert into public.vocab_progress (user_id, word_id, status, box, next_due)
    values (v_user, p_word, case when p_known then 'known' else 'learning' end, v_next.box, v_next.next_due)
    on conflict (user_id, word_id) do update
      set status = excluded.status, box = excluded.box, next_due = excluded.next_due
    returning starred into v_star;
  end if;

  return jsonb_build_object('box', v_next.box, 'next_due', v_next.next_due,
                            'status', case when p_known then 'known' else 'learning' end, 'starred', v_star);
end
$$;

-- Yulduzcha. Kvota sarflamaydi: progress yo'q bo'lsa status 'new', box null qator yaratiladi.
create or replace function public.vocab_star(p_word uuid, p_starred boolean, p_own boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  if p_word is null or p_starred is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if p_own then
    update public.user_vocab_words set starred = p_starred where id = p_word and user_id = v_user;
    if not found then
      raise exception 'word_not_found' using errcode = 'P0002';
    end if;
  else
    if not exists (select 1 from public.vocab_words w where w.id = p_word and w.status = 'verified') then
      raise exception 'word_not_found' using errcode = 'P0002';
    end if;
    insert into public.vocab_progress (user_id, word_id, status, starred)
    values (v_user, p_word, 'new', p_starred)
    on conflict (user_id, word_id) do update set starred = excluded.starred;
  end if;
end
$$;

-- O'z so'zini qo'shish: tarifda vocab_my_words bayrog'i bo'lishi kerak. Hajm chegarasi 1000 so'z: texnik himoya, tarif emas.
create or replace function public.user_word_add(p_word text, p_definition text, p_part_of_speech text default null,
                                                p_example text default null)
returns public.user_vocab_words
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_row  public.user_vocab_words;
  v_word text := private.toza(p_word);
  v_def  text := private.toza(p_definition);
begin
  if not private.plan_has_flag(v_user, 'vocab_my_words') then
    raise exception 'feature_not_available' using errcode = 'P0001';
  end if;
  if v_word is null or v_def is null then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  if (select count(*) from public.user_vocab_words w where w.user_id = v_user) >= 1000 then
    raise exception 'too_many_words' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.user_vocab_words w where w.user_id = v_user and lower(w.word) = lower(v_word)) then
    raise exception 'duplicate_word' using errcode = '23505';
  end if;
  insert into public.user_vocab_words (user_id, word, part_of_speech, definition, example)
  values (v_user, v_word, private.toza(p_part_of_speech), v_def, private.toza(p_example))
  returning * into v_row;
  return v_row;
end
$$;

-- Brauzerdagi holatni bir marta ko'chiradi. p_items: [{word, status: "bilaman"|"organ", box?, next_due?, starred?}].
-- So'z nomi (lower) bo'yicha tasdiqlangan vocab_words ga moslanadi; topilmaganlari tashlab ketiladi.
-- Serverda shu so'z bor bo'lsa: kattaroq quti qoladi (teng bo'lsa server), yulduzcha OR. Kvota sarflanmaydi.
-- Hisob uchun ikkinchi chaqiruv hech narsa yozmaydi ({"already": true}).
create or replace function public.vocab_import_local(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
  v_n     integer := 0;
  r       record;
  v_box   smallint;
  v_due   date;
  v_stat  text;
begin
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) > 2000 then
    raise exception 'invalid_input' using errcode = '22023';
  end if;
  insert into private.vocab_imports (user_id) values (v_user) on conflict (user_id) do nothing;
  if not found then
    return jsonb_build_object('already', true, 'imported', 0);
  end if;

  for r in
    select w.id, x.value as it
    from jsonb_array_elements(p_items) x
    join public.vocab_words w on lower(w.word) = lower(x.value ->> 'word') and w.status = 'verified'
    where jsonb_typeof(x.value) = 'object'
  loop
    v_box := case when (r.it ->> 'box') ~ '^[1-5]$' then (r.it ->> 'box')::smallint end;
    v_due := case when (r.it ->> 'next_due') ~ '^\d{4}-\d{2}-\d{2}$' then (r.it ->> 'next_due')::date end;
    -- Sana chegarasi: o'tmish 1 yildan, kelajak 30 kundan oshmaydi (eng uzun oraliq 14 kun).
    if v_due is not null and (v_due < v_today - 366 or v_due > v_today + 30) then v_due := v_today; end if;
    v_stat := case r.it ->> 'status' when 'bilaman' then 'known' when 'organ' then 'learning' else null end;
    -- Faqat holat bor (eski shakl): "bilaman" 2-quti, "organ" 1-quti, ikkalasi ham bugun takrorlanadi.
    if v_box is null and v_stat is not null then
      v_box := case v_stat when 'known' then 2 else 1 end;
    end if;
    if v_box is not null and v_due is null then v_due := v_today; end if;
    if v_box is null and coalesce(r.it -> 'starred' = 'true'::jsonb, false) is false then
      continue;
    end if;

    insert into public.vocab_progress (user_id, word_id, status, box, next_due, starred)
    values (v_user, r.id, coalesce(v_stat, case when v_box is null then 'new' else 'learning' end), v_box, v_due,
            coalesce(r.it -> 'starred' = 'true'::jsonb, false))
    on conflict (user_id, word_id) do update
      set box      = case when coalesce(excluded.box, 0) > coalesce(vocab_progress.box, 0) then excluded.box else vocab_progress.box end,
          next_due = case when coalesce(excluded.box, 0) > coalesce(vocab_progress.box, 0) then excluded.next_due else vocab_progress.next_due end,
          status   = case when coalesce(excluded.box, 0) > coalesce(vocab_progress.box, 0) then excluded.status else vocab_progress.status end,
          starred  = vocab_progress.starred or excluded.starred;
    v_n := v_n + 1;
  end loop;

  update private.vocab_imports set words = v_n where user_id = v_user;
  return jsonb_build_object('already', false, 'imported', v_n);
end
$$;

revoke all on function public.vocab_status(), public.vocab_rate(uuid, boolean, boolean),
  public.vocab_star(uuid, boolean, boolean), public.user_word_add(text, text, text, text),
  public.vocab_import_local(jsonb) from public, anon;
grant execute on function public.vocab_status(), public.vocab_rate(uuid, boolean, boolean),
  public.vocab_star(uuid, boolean, boolean), public.user_word_add(text, text, text, text),
  public.vocab_import_local(jsonb) to authenticated;
