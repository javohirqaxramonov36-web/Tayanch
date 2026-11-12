-- 20261112184613. P32 1-PR: XP va reyting (laqab bilan, ixtiyoriy). Musobaqa 2-PR da.
-- Qoidalar hujjati: docs/xp-qoidasi.md (raqamlar boshlang'ich, muallif tasdig'i kerak).
-- Takror ishga tushirish xavfsiz (if not exists / create or replace / drop ... if exists).
--
-- Asosiy fikrlar:
--   * XP ni faqat server yozadi: public.attempts ga yangi qator tushganda trigger (submit_answer RPC yozadi,
--     is_correct ni server hisoblaydi). Mijoz xp_events ga yoza olmaydi va submit_answer o'zgarmaydi.
--   * Har XP turining noyob kaliti bor (user_id, kind, ref): bir savol uchun javob XP'si umrida bir marta,
--     takrorlash XP'si bir savolga kuniga bir marta, kun savoli kuniga bir marta.
--   * Aldovdan himoya: 3 soniyadan tez (yoki vaqtsiz) mashq javobi XP bermaydi; kuniga ko'pi bilan 300 XP;
--     parallel yuborishda kunlik chegara advisory lock bilan saqlanadi.
--   * Reyting ixtiyoriy (opt-in): leaderboard_members da qatori bor foydalanuvchi ko'rinadi. Faqat laqab, XP va
--     (ruxsat bergan bo'lsa) mamlakat. user_id, ism, email, surat hech qachon qaytmaydi.
--   * 18 yoshgacha (user_metadata.age_group = 'minor') va yosh guruhi yo'q hisoblar reytingga qo'shilmaydi va
--     jadvalni ko'rmaydi, faqat o'z XP'sini ko'radi (P03/P23 qarori). Cheklov: age_group foydalanuvchi o'zi
--     e'lon qilgan qiymat (auth.updateUser bilan o'zgartirish mumkin); server buni tekshira olmaydi.
--   * Davrlar Toshkent vaqti bo'yicha (private.today_tashkent): hafta dushanbadan (ISO), oy kalendar oyi.

------------------------------------------------------------------------------
-- 1. Sozlama (bitta joyda; hujjat bilan bir xil bo'lishi kerak)
------------------------------------------------------------------------------

create or replace function private.xp_rule(p_key text)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case p_key
    when 'answer'        then 2     -- savolga birinchi javob (mashq / taymerli)
    when 'correct'       then 3     -- shu savolga birinchi urinishda to'g'ri javob (qo'shimcha)
    when 'review'        then 4     -- takrorlashda to'g'ri javob (savolga kuniga bir marta)
    when 'daily'         then 5     -- kun savoliga javob
    when 'daily_correct' then 5     -- kun savoliga to'g'ri javob (qo'shimcha)
    when 'daily_cap'     then 300   -- kuniga ko'pi bilan
    when 'min_time_ms'   then 3000  -- mashq javobi bundan tez bo'lsa XP yo'q
  end
$$;

------------------------------------------------------------------------------
-- 2. Jadvallar
------------------------------------------------------------------------------

create table if not exists public.xp_events (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('answer', 'correct', 'review', 'daily', 'daily_correct')),
  ref        text not null check (char_length(ref) between 1 and 80),
  xp         smallint not null check (xp between 1 and 50),
  day        date not null,
  created_at timestamptz not null default now(),
  unique (user_id, kind, ref)
);

create index if not exists xp_events_day_idx on public.xp_events (day, user_id) include (xp);
create index if not exists xp_events_user_day_idx on public.xp_events (user_id, day);

alter table public.xp_events enable row level security;
revoke all on table public.xp_events from anon, authenticated;
grant select on table public.xp_events to authenticated;

drop policy if exists xp_events_select_own on public.xp_events;
create policy xp_events_select_own on public.xp_events
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Reytingda qatnashish. Qator bor = qatnashadi. Laqab va mamlakat profiles da (nickname, country).
create table if not exists public.leaderboard_members (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  show_country  boolean not null default false,
  joined_at     timestamptz not null default now(),
  hidden_at     timestamptz,                       -- moderator yashirgan (SQL orqali, docs/xp-qoidasi.md)
  hidden_reason text check (char_length(hidden_reason) <= 200),
  updated_at    timestamptz not null default now()
);

create or replace trigger leaderboard_members_updated_at
  before update on public.leaderboard_members
  for each row execute function private.set_updated_at();

alter table public.leaderboard_members enable row level security;
revoke all on table public.leaderboard_members from anon, authenticated;
grant select on table public.leaderboard_members to authenticated;

drop policy if exists leaderboard_members_select_own on public.leaderboard_members;
create policy leaderboard_members_select_own on public.leaderboard_members
  for select to authenticated
  using (user_id = (select auth.uid()));

-- Laqab uchun taqiqlangan so'zlar (normallashtirilgan ko'rinishda, substring sifatida). Muallif SQL bilan qo'shadi:
--   insert into private.blocked_words (word, note) values ('...', '...') on conflict do nothing;
create table if not exists private.blocked_words (
  word text primary key check (word ~ '^[a-z]{3,30}$'),
  note text
);
revoke all on table private.blocked_words from public, anon, authenticated;

insert into private.blocked_words (word, note) values
  -- zaxira: rasmiy yoki xodim deb o'ylatadigan laqablar
  ('admin', 'zaxira'), ('moderator', 'zaxira'), ('tayanch', 'zaxira'), ('support', 'zaxira'),
  ('official', 'zaxira'), ('collegeboard', 'zaxira'), ('staff', 'zaxira'), ('system', 'zaxira'),
  -- inglizcha
  ('fuck', 'en'), ('shit', 'en'), ('bitch', 'en'), ('cunt', 'en'), ('dick', 'en'), ('cock', 'en'),
  ('pussy', 'en'), ('porn', 'en'), ('whore', 'en'), ('slut', 'en'), ('nigg', 'en'), ('fag', 'en'),
  ('rape', 'en'), ('nazi', 'en'), ('hitler', 'en'), ('bastard', 'en'), ('asshole', 'en'),
  -- ruscha (lotin yozuvida)
  ('blyat', 'ru'), ('blya', 'ru'), ('suka', 'ru'), ('pizd', 'ru'), ('huy', 'ru'), ('xuy', 'ru'),
  ('hui', 'ru'), ('ebat', 'ru'), ('yebat', 'ru'), ('pidor', 'ru'), ('pidar', 'ru'), ('mudak', 'ru'),
  ('gandon', 'ru'), ('zalup', 'ru'),
  -- o'zbekcha
  ('jalab', 'uz'), ('qanjiq', 'uz'), ('qotoq', 'uz'), ('sikay', 'uz'), ('sikish', 'uz'), ('skay', 'uz'),
  ('haromi', 'uz'), ('xaromi', 'uz'), ('itvachcha', 'uz'), ('onangni', 'uz')
on conflict (word) do nothing;

------------------------------------------------------------------------------
-- 3. Laqab moderatsiyasi
------------------------------------------------------------------------------

-- Normallashtirish: kichik harf, raqam/belgi o'xshash harfga (0→o, 1→i, 3→e, 4→a, 5→s, 7→t, 8→b, @→a, $→s),
-- harf bo'lmagan hamma narsa olib tashlanadi ("F_u_c_k", "fu.ck" ham ushlanadi).
create or replace function private.nickname_normal(p text)
returns text
language sql
immutable
set search_path = ''
as $$
  select regexp_replace(translate(lower(coalesce(p, '')), '0134578@$', 'oieastbas'), '[^a-z]', '', 'g')
$$;

create or replace function private.nickname_allowed(p text)
returns boolean
language sql
stable
set search_path = ''
as $$
  select p is not null
     and p ~ '^[A-Za-z0-9_]{3,20}$'
     -- "1" ham "i", ham "l" bo'lishi mumkin ("B1yat", "sh1t"): ikkala o'qish tekshiriladi.
     and not exists (select 1 from private.blocked_words b
                     where position(b.word in private.nickname_normal(p)) > 0
                        or position(b.word in private.nickname_normal(replace(p, '1', 'l'))) > 0)
$$;

-- Profil sahifasida ham (1-qavat, /uz/hisob/profil/) laqab shu qoidadan o'tadi. Faqat yangi yoki o'zgargan laqab
-- tekshiriladi: eski laqabli foydalanuvchi boshqa maydonni saqlay oladi (reytingda u baribir ko'rinmaydi).
create or replace function private.profiles_nickname_check()
returns trigger
language plpgsql
security definer   -- profil sahifasi (authenticated) private.blocked_words ni o'qiy olmaydi
set search_path = ''
as $$
begin
  if new.nickname is not null
     and (tg_op = 'INSERT' or new.nickname is distinct from old.nickname)
     and not private.nickname_allowed(new.nickname) then
    raise exception 'nickname_not_allowed' using errcode = '22023';
  end if;
  return new;
end
$$;

drop trigger if exists profiles_nickname_check on public.profiles;
create trigger profiles_nickname_check
  before insert or update of nickname on public.profiles
  for each row execute function private.profiles_nickname_check();

------------------------------------------------------------------------------
-- 4. XP yozish (attempts trigger)
------------------------------------------------------------------------------

-- Bitta XP yozuvi: kunlik chegaradan oshgan qismi kesiladi. Chegara to'lgan bo'lsa yozuv QO'SHILMAYDI
-- (kalit band bo'lmaydi), shuning uchun ertasi kuni shu savolni yechsa XP oladi.
create or replace function private.xp_add(p_user uuid, p_kind text, p_ref text, p_xp integer, p_day date)
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_today integer;
  v_give  integer;
begin
  select coalesce(sum(e.xp), 0) into v_today from public.xp_events e where e.user_id = p_user and e.day = p_day;
  v_give := least(p_xp, private.xp_rule('daily_cap') - v_today);
  if v_give <= 0 then
    return 0;
  end if;
  insert into public.xp_events (user_id, kind, ref, xp, day)
  values (p_user, p_kind, p_ref, v_give, p_day)
  on conflict (user_id, kind, ref) do nothing;
  return case when found then v_give else 0 end;
end
$$;

create or replace function private.award_xp_apply(p_a public.attempts)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_mode  text;
  v_day   date := private.today_tashkent();
  v_first boolean;
begin
  select s.mode into v_mode from public.practice_sessions s where s.id = p_a.session_id;
  if v_mode is null then
    return;
  end if;

  -- Bir foydalanuvchining parallel javoblari navbat bilan: kunlik chegara oshib ketmaydi.
  perform pg_advisory_xact_lock(hashtextextended('xp:' || p_a.user_id::text, 0));

  if v_mode = 'daily' then
    -- Kun savoli kuniga bitta (practice_sessions_daily_key). Vaqt cheklovi yo'q: mijoz time_ms yubormaydi.
    perform private.xp_add(p_a.user_id, 'daily', v_day::text, private.xp_rule('daily'), v_day);
    if p_a.is_correct then
      perform private.xp_add(p_a.user_id, 'daily_correct', v_day::text, private.xp_rule('daily_correct'), v_day);
    end if;
    return;
  end if;

  -- Mashq, taymerli, takrorlash: juda tez yoki vaqtsiz javob XP bermaydi (taxmin yoki bot).
  if p_a.time_ms is null or p_a.time_ms < private.xp_rule('min_time_ms') then
    return;
  end if;

  if v_mode = 'review' then
    if p_a.is_correct and exists (select 1 from public.review_queue r
                                  where r.user_id = p_a.user_id and r.question_id = p_a.question_id) then
      perform private.xp_add(p_a.user_id, 'review', p_a.question_id::text || ':' || v_day::text,
                             private.xp_rule('review'), v_day);
    end if;
    return;
  end if;

  if v_mode in ('practice', 'timed') then
    perform private.xp_add(p_a.user_id, 'answer', p_a.question_id::text, private.xp_rule('answer'), v_day);
    -- "Birinchi urinishda": foydalanuvchi bu savolga avval hech qayerda (kun savoli ham) javob bermagan.
    select not exists (select 1 from public.attempts a
                       where a.user_id = p_a.user_id and a.question_id = p_a.question_id and a.id <> p_a.id)
      into v_first;
    if p_a.is_correct and v_first then
      perform private.xp_add(p_a.user_id, 'correct', p_a.question_id::text, private.xp_rule('correct'), v_day);
    end if;
  end if;
  return;
end
$$;

-- Trigger: XP xatosi javobni hech qachon to'xtatmaydi (submit_answer tranzaksiyasi buzilmaydi). Ichki xato bo'lsa
-- XP yozilmaydi va jurnalga WARNING tushadi.
create or replace function private.award_xp()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    perform private.award_xp_apply(new);
  exception when others then
    raise warning 'award_xp: attempt %, %', new.id, sqlerrm;
  end;
  return null;
end
$$;

drop trigger if exists attempts_award_xp on public.attempts;
create trigger attempts_award_xp
  after insert on public.attempts
  for each row execute function private.award_xp();

------------------------------------------------------------------------------
-- 5. Yordamchilar
------------------------------------------------------------------------------

-- Reytingga ruxsat: faqat o'zini "18 yosh yoki katta" deb belgilagan hisob (age_group = 'adult').
create or replace function private.leaderboard_eligible(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select u.raw_user_meta_data ->> 'age_group' = 'adult' from auth.users u where u.id = p_user), false)
$$;

create or replace function private.period_start(p_period text, p_today date)
returns date
language sql
immutable
set search_path = ''
as $$
  select case p_period
    when 'week'  then date_trunc('week', p_today::timestamp)::date
    when 'month' then date_trunc('month', p_today::timestamp)::date
  end
$$;

create or replace function private.period_next(p_period text, p_today date)
returns date
language sql
immutable
set search_path = ''
as $$
  select case p_period
    when 'week'  then (date_trunc('week', p_today::timestamp) + interval '1 week')::date
    when 'month' then (date_trunc('month', p_today::timestamp) + interval '1 month')::date
  end
$$;

------------------------------------------------------------------------------
-- 6. RPC (mijoz faqat shular orqali)
------------------------------------------------------------------------------

-- O'z holati: XP (bugun, hafta, oy), ruxsat, qatnashish. Boshqa foydalanuvchi haqida hech narsa yo'q.
create or replace function public.leaderboard_me()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user  uuid := private.require_user();
  v_today date := private.today_tashkent();
  v_m     public.leaderboard_members;
  v_p     public.profiles;
begin
  select * into v_m from public.leaderboard_members m where m.user_id = v_user;
  select * into v_p from public.profiles p where p.id = v_user;
  return jsonb_build_object(
    'today', v_today,
    'eligible', private.leaderboard_eligible(v_user),
    'joined', v_m.user_id is not null,
    'hidden', v_m.hidden_at is not null,
    'nickname', v_p.nickname,
    'nickname_ok', private.nickname_allowed(v_p.nickname),
    'country', v_p.country,
    'show_country', coalesce(v_m.show_country, false),
    'xp', jsonb_build_object(
      'today', (select coalesce(sum(e.xp), 0) from public.xp_events e where e.user_id = v_user and e.day = v_today),
      'week',  (select coalesce(sum(e.xp), 0) from public.xp_events e
                 where e.user_id = v_user and e.day >= private.period_start('week', v_today)),
      'month', (select coalesce(sum(e.xp), 0) from public.xp_events e
                 where e.user_id = v_user and e.day >= private.period_start('month', v_today))),
    'daily_cap', private.xp_rule('daily_cap'));
end
$$;

-- Qo'shilish (yoki laqab/mamlakatni yangilash). Rozilik vaqti joined_at (birinchi qo'shilganda).
create or replace function public.leaderboard_join(p_nickname text, p_country text default null, p_show_country boolean default false)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
  v_nick text := btrim(coalesce(p_nickname, ''));
  v_cc   text := nullif(upper(btrim(coalesce(p_country, ''))), '');
begin
  if not private.leaderboard_eligible(v_user) then
    raise exception 'leaderboard_not_eligible' using errcode = '42501';
  end if;
  if v_nick !~ '^[A-Za-z0-9_]{3,20}$' then
    raise exception 'nickname_invalid' using errcode = '22023';
  end if;
  if not private.nickname_allowed(v_nick) then
    raise exception 'nickname_not_allowed' using errcode = '22023';
  end if;
  if v_cc is not null and v_cc !~ '^[A-Z]{2}$' then
    raise exception 'country_invalid' using errcode = '22023';
  end if;

  begin
    update public.profiles set nickname = v_nick, country = v_cc where id = v_user;
  exception when unique_violation then
    raise exception 'nickname_taken' using errcode = '23505';
  end;
  if not found then
    raise exception 'profile_missing' using errcode = 'P0002';
  end if;

  insert into public.leaderboard_members (user_id, show_country)
  values (v_user, coalesce(p_show_country, false) and v_cc is not null)
  on conflict (user_id) do update set show_country = excluded.show_country;

  return public.leaderboard_me();
end
$$;

-- Chiqish: reytingdan darhol yo'qoladi. XP va laqab o'zida qoladi (laqabni profil sahifasida o'chirish mumkin).
create or replace function public.leaderboard_leave()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := private.require_user();
begin
  delete from public.leaderboard_members m where m.user_id = v_user;
  return public.leaderboard_me();
end
$$;

-- Jadval: p_period 'week' | 'month', p_scope 'all' | 'country'. Eng ko'pi 50 qator + o'z qatori (50 dan pastda bo'lsa).
-- Faqat qatnashuvchi, yashirilmagan, ruxsat etilgan laqabli va shu davrda XP > 0 bo'lganlar.
-- 'country': chaqiruvchining profil mamlakati va show_country = true bo'lganlar (chaqiruvchi ham shu shartda).
create or replace function public.leaderboard(p_period text default 'week', p_scope text default 'all')
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_user    uuid := private.require_user();
  v_today   date := private.today_tashkent();
  v_start   date;
  v_country text;
  v_rows    jsonb;
  v_me      jsonb;
begin
  if p_period not in ('week', 'month') or p_scope not in ('all', 'country') then
    raise exception 'invalid_argument' using errcode = '22023';
  end if;
  if not private.leaderboard_eligible(v_user) then
    raise exception 'leaderboard_not_eligible' using errcode = '42501';
  end if;
  v_start := private.period_start(p_period, v_today);

  if p_scope = 'country' then
    select p.country into v_country
      from public.profiles p join public.leaderboard_members m on m.user_id = p.id
     where p.id = v_user and m.show_country;
    if v_country is null then
      raise exception 'no_country' using errcode = '22023';
    end if;
  end if;

  with ochko as (
    select e.user_id, sum(e.xp)::integer as xp
      from public.xp_events e
     where e.day >= v_start and e.day <= v_today
     group by e.user_id
  ), jadval as (
    select o.user_id, o.xp, p.nickname,
           case when m.show_country then p.country end as country,
           rank() over (order by o.xp desc) as orin,
           row_number() over (order by o.xp desc, lower(p.nickname)) as tartib
      from ochko o
      join public.leaderboard_members m on m.user_id = o.user_id and m.hidden_at is null
      join public.profiles p on p.id = o.user_id
     where o.xp > 0
       and private.nickname_allowed(p.nickname)
       and private.leaderboard_eligible(o.user_id)
       and (v_country is null or (m.show_country and p.country = v_country))
  )
  select coalesce(jsonb_agg(jsonb_build_object(
           'rank', j.orin, 'nickname', j.nickname, 'country', j.country, 'xp', j.xp, 'me', j.user_id = v_user)
           order by j.tartib) filter (where j.tartib <= 50), '[]'::jsonb),
         (array_agg(jsonb_build_object(
           'rank', j.orin, 'nickname', j.nickname, 'country', j.country, 'xp', j.xp, 'me', true))
           filter (where j.user_id = v_user and j.tartib > 50))[1]
    into v_rows, v_me
    from jadval j;

  return jsonb_build_object(
    'period', p_period,
    'scope', p_scope,
    'country', v_country,
    'from', v_start,
    'to', v_today,
    'resets_at', private.period_next(p_period, v_today)::timestamp at time zone 'Asia/Tashkent',
    'rows', v_rows,
    'me', v_me);
end
$$;

revoke all on function private.xp_rule(text) from public, anon, authenticated;
revoke all on function private.nickname_normal(text) from public, anon, authenticated;
revoke all on function private.nickname_allowed(text) from public, anon, authenticated;
revoke all on function private.profiles_nickname_check() from public, anon, authenticated;
revoke all on function private.xp_add(uuid, text, text, integer, date) from public, anon, authenticated;
revoke all on function private.award_xp_apply(public.attempts) from public, anon, authenticated;
revoke all on function private.award_xp() from public, anon, authenticated;
revoke all on function private.leaderboard_eligible(uuid) from public, anon, authenticated;
revoke all on function private.period_start(text, date) from public, anon, authenticated;
revoke all on function private.period_next(text, date) from public, anon, authenticated;

revoke all on function public.leaderboard_me() from public, anon;
revoke all on function public.leaderboard_join(text, text, boolean) from public, anon;
revoke all on function public.leaderboard_leave() from public, anon;
revoke all on function public.leaderboard(text, text) from public, anon;
grant execute on function public.leaderboard_me() to authenticated;
grant execute on function public.leaderboard_join(text, text, boolean) to authenticated;
grant execute on function public.leaderboard_leave() to authenticated;
grant execute on function public.leaderboard(text, text) to authenticated;
