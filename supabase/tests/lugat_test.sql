-- P15 lug'at sinovlari (20261111170000_lugat_p15): Leitner, kunlik yangi so'z kvotasi va ertasi kuni tiklanish,
-- yulduzcha, o'z so'zlarim bayrog'i, bir martalik import, RLS.
-- rls_test.sql kabi: bitta tranzaksiya, oxirida ROLLBACK. 20 so'zli sinov to'plami faqat "SINOV" matnli soxta yozuvlar.
\set ON_ERROR_STOP on
\set QUIET on

begin;

insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-4000-8000-0000000000c1', 'la@sinov.invalid', '{}'),
  ('00000000-0000-4000-8000-0000000000d1', 'lb@sinov.invalid', '{}');

-- 20 ta tasdiqlangan sinov so'zi (sinov-01 … sinov-20) va bitta qoralama.
insert into public.vocab_words (word, part_of_speech, definition, example, difficulty, topic, status, author, verified_by)
select format('sinov-%s', lpad(g::text, 2, '0')), 'noun', format('SINOV definition %s', g), format('SINOV example %s', g),
       (array['easy', 'medium', 'hard'])[1 + g % 3], case when g <= 10 then 'SINOV-a' else 'SINOV-b' end,
       'verified', 'sinov', 'sinov2'
from generate_series(1, 20) g;
insert into public.vocab_words (word, definition, status, author) values ('sinov-qoralama', 'SINOV draft', 'draft', 'sinov');

select set_config('ls.w1', (select id::text from public.vocab_words where word = 'sinov-01'), true),
       set_config('ls.w2', (select id::text from public.vocab_words where word = 'sinov-02'), true),
       set_config('ls.w3', (select id::text from public.vocab_words where word = 'sinov-03'), true),
       set_config('ls.w4', (select id::text from public.vocab_words where word = 'sinov-04'), true),
       set_config('ls.w5', (select id::text from public.vocab_words where word = 'sinov-05'), true),
       set_config('ls.wd', (select id::text from public.vocab_words where word = 'sinov-qoralama'), true)
\gset

-- Leitner (sof funksiya): takrorlash.ts bilan bir xil oraliqlar.
do $$
declare
  d date := date '2026-01-10';
  r record;
begin
  select * into r from private.leitner_next(null, true, d);
  if r.box <> 2 or r.next_due <> d + 3 then raise exception 'FAIL L01: yangi + bilaman → 2-quti, +3 kun; keldi %', r; end if;
  select * into r from private.leitner_next(2::smallint, true, d);
  if r.box <> 3 or r.next_due <> d + 7 then raise exception 'FAIL L01: 2 → 3, +7; keldi %', r; end if;
  select * into r from private.leitner_next(3::smallint, true, d);
  if r.box <> 4 or r.next_due <> d + 14 then raise exception 'FAIL L01: 3 → 4, +14; keldi %', r; end if;
  select * into r from private.leitner_next(4::smallint, true, d);
  if r.box <> 5 or r.next_due <> d then raise exception 'FAIL L01: 4 → 5 (o''zlashtirildi); keldi %', r; end if;
  select * into r from private.leitner_next(5::smallint, false, d);
  if r.box <> 1 or r.next_due <> d + 1 then raise exception 'FAIL L01: bilmayman → 1-quti, ertaga; keldi %', r; end if;
  raise notice 'OK L01 Leitner: 3/7/14 kun, 4-qutida to''g''ri = 5, xato = 1-quti ertaga';
end
$$;

-- Anonim
set local role anon;
select set_config('request.jwt.claims', '{"role": "anon"}', true) \gset
do $$
begin
  begin
    perform public.vocab_rate(current_setting('ls.w1')::uuid, true);
    raise exception 'FAIL L02: anon vocab_rate ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.vocab_status();
    raise exception 'FAIL L02: anon vocab_status ni chaqirdi';
  exception when insufficient_privilege then null;
  end;
  if (select count(*) from public.vocab_words) <> 20 then
    raise exception 'FAIL L02: anon 20 ta tasdiqlangan so''zni ko''rishi kerak (qoralama emas)';
  end if;
  raise notice 'OK L02 anon: RPC yopiq, faqat 20 ta tasdiqlangan so''z ko''rinadi';
end
$$;
reset role;

-- Free tarifga sinov uchun kvota: kuniga 3 ta yangi so'z (faqat shu tranzaksiyada).
update public.plans set limits = '{"new_words": {"max": 3, "per": "day"}}'::jsonb where code = 'free';

-- Foydalanuvchi A
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  s jsonb;
  r jsonb;
begin
  s := public.vocab_status();
  if (s -> 'new_words' ->> 'max')::int <> 3 or (s -> 'new_words' ->> 'remaining')::int <> 3 or (s ->> 'my_words')::boolean then
    raise exception 'FAIL L03: boshlang''ich holat noto''g''ri: %', s;
  end if;

  -- Yulduzcha kvota sarflamaydi
  perform public.vocab_star(current_setting('ls.w5')::uuid, true);
  if (public.vocab_status() -> 'new_words' ->> 'used')::int <> 0 then
    raise exception 'FAIL L04: yulduzcha kvota sarfladi';
  end if;
  raise notice 'OK L04 yulduzcha: kvota sarflanmaydi';

  r := public.vocab_rate(current_setting('ls.w1')::uuid, true);
  if (r ->> 'box')::int <> 2 or r ->> 'status' <> 'known' then raise exception 'FAIL L03: w1 javobi %', r; end if;
  perform public.vocab_rate(current_setting('ls.w2')::uuid, false);
  perform public.vocab_rate(current_setting('ls.w3')::uuid, true);
  s := public.vocab_status();
  if (s -> 'new_words' ->> 'remaining')::int <> 0 then raise exception 'FAIL L03: 3 ta yangidan keyin qoldiq 0 emas: %', s; end if;

  begin
    perform public.vocab_rate(current_setting('ls.w4')::uuid, true);
    raise exception 'FAIL L03: 4-yangi so''z kvotadan o''tib ketdi';
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'quota_exceeded' then raise; end if;
  end;
  -- Yulduzchali (box null) so'z ham yangi hisoblanadi
  begin
    perform public.vocab_rate(current_setting('ls.w5')::uuid, true);
    raise exception 'FAIL L03: yulduzchali yangi so''z kvotadan o''tib ketdi';
  exception when sqlstate 'P0001' then null;
  end;
  if exists (select 1 from public.vocab_progress where word_id = current_setting('ls.w4')::uuid) then
    raise exception 'FAIL L03: kvota xatosidan keyin progress yozilgan';
  end if;

  -- Takrorlash davom etadi
  r := public.vocab_rate(current_setting('ls.w1')::uuid, true);
  if (r ->> 'box')::int <> 3 then raise exception 'FAIL L03: limitdan keyin takrorlash ishlamadi: %', r; end if;
  r := public.vocab_rate(current_setting('ls.w2')::uuid, false);
  if (r ->> 'box')::int <> 1 then raise exception 'FAIL L03: takrorlash (bilmayman) %', r; end if;
  raise notice 'OK L03 kvota: 3 ta yangi so''z, 4-si quota_exceeded va yozilmaydi, takrorlash davom etadi';

  begin
    perform public.vocab_rate(current_setting('ls.wd')::uuid, true);
    raise exception 'FAIL L05: qoralama so''z baholandi';
  exception when sqlstate 'P0002' then null;
  end;
  begin
    insert into public.vocab_progress (word_id, status, box) values (current_setting('ls.w4')::uuid, 'learning', 1);
    raise exception 'FAIL L05: vocab_progress ga to''g''ridan-to''g''ri yozildi';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.vocab_progress set box = 5;
    raise exception 'FAIL L05: vocab_progress to''g''ridan-to''g''ri o''zgardi';
  exception when insufficient_privilege then null;
  end;
  raise notice 'OK L05 RLS: qoralama so''z yo''q, progressga faqat RPC orqali yoziladi';

  -- O'z so'zlarim: bayroqsiz yopiq
  begin
    perform public.user_word_add('sinov-own', 'SINOV own definition');
    raise exception 'FAIL L06: bayroqsiz o''z so''zi qo''shildi';
  exception when sqlstate 'P0001' then
    if sqlerrm <> 'feature_not_available' then raise; end if;
  end;
  begin
    insert into public.user_vocab_words (word, definition) values ('x', 'y');
    raise exception 'FAIL L06: user_vocab_words ga to''g''ridan-to''g''ri yozildi';
  exception when insufficient_privilege then null;
  end;
end
$$;
reset role;

-- Ertasi kun: bugungi hisoblagich kechagi davrga suriladi (sana o'zgarishi o'xshatmasi).
update public.usage_counters set period_start = period_start - 1
where user_id = '00000000-0000-4000-8000-0000000000c1' and key = 'new_words';
-- Bayroq: free tarifga sinov uchun vocab_my_words.
update public.plans set features = features || '[{"flag": "vocab_my_words"}]'::jsonb where code = 'free';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000c1", "role": "authenticated"}', true) \gset
do $$
declare
  s jsonb;
  o public.user_vocab_words;
  r jsonb;
begin
  s := public.vocab_status();
  if (s -> 'new_words' ->> 'remaining')::int <> 3 then raise exception 'FAIL L07: ertasi kuni kvota tiklanmadi: %', s; end if;
  perform public.vocab_rate(current_setting('ls.w4')::uuid, true);
  raise notice 'OK L07 ertasi kun: kvota 3 ga tiklandi, yangi so''z yana baholanadi';

  if not (public.vocab_status() ->> 'my_words')::boolean then raise exception 'FAIL L06: bayroq ko''rinmadi'; end if;
  o := public.user_word_add('  Sinov-Own  ', 'SINOV own   definition', 'noun', '');
  if o.word <> 'Sinov-Own' or o.definition <> 'SINOV own definition' or o.example is not null then
    raise exception 'FAIL L06: tozalash noto''g''ri: %', o;
  end if;
  begin
    perform public.user_word_add('sinov-own', 'SINOV again');
    raise exception 'FAIL L06: takror so''z qo''shildi';
  exception when unique_violation then null;
  end;
  r := public.vocab_rate(o.id, false, true);
  if (r ->> 'box')::int <> 1 then raise exception 'FAIL L06: o''z so''zini baholash %', r; end if;
  if (public.vocab_status() -> 'new_words' ->> 'used')::int <> 1 then
    raise exception 'FAIL L06: o''z so''zi kvota sarfladi';
  end if;
  perform public.vocab_star(o.id, true, true);
  raise notice 'OK L06 o''z so''zlarim: bayroqsiz yopiq, bayroq bilan qo''shiladi, tozalanadi, takror yo''q, kvota sarflamaydi';

  -- Import: A uchun bir marta
  r := public.vocab_import_local('[
    {"word": "SINOV-06", "status": "bilaman"},
    {"word": "sinov-07", "status": "organ", "box": 3, "next_due": "2999-01-01"},
    {"word": "sinov-01", "status": "organ", "box": 2, "next_due": "2026-01-01"},
    {"word": "sinov-08", "starred": true},
    {"word": "yoq-soz", "status": "bilaman"},
    {"word": "sinov-qoralama", "status": "bilaman"}
  ]'::jsonb);
  if (r ->> 'imported')::int <> 4 or (r ->> 'already')::boolean then raise exception 'FAIL L08: import natijasi %', r; end if;
  if (select box from public.vocab_progress p join public.vocab_words w on w.id = p.word_id where w.word = 'sinov-06') <> 2 then
    raise exception 'FAIL L08: "bilaman" 2-qutiga tushmadi';
  end if;
  if (select next_due from public.vocab_progress p join public.vocab_words w on w.id = p.word_id where w.word = 'sinov-07')
     <> (public.vocab_status() ->> 'today')::date then
    raise exception 'FAIL L08: uzoq kelajakdagi sana bugunga tushirilmadi';
  end if;
  if (select box from public.vocab_progress p join public.vocab_words w on w.id = p.word_id where w.word = 'sinov-01') <> 3 then
    raise exception 'FAIL L08: serverdagi kattaroq quti (3) saqlanmadi';
  end if;
  if (select box from public.vocab_progress p join public.vocab_words w on w.id = p.word_id where w.word = 'sinov-08') is not null then
    raise exception 'FAIL L08: faqat yulduzchali so''zga quti berildi';
  end if;
  if (public.vocab_status() -> 'new_words' ->> 'used')::int <> 1 then
    raise exception 'FAIL L08: import kvota sarfladi';
  end if;
  r := public.vocab_import_local('[{"word": "sinov-09", "status": "bilaman"}]'::jsonb);
  if not (r ->> 'already')::boolean
     or exists (select 1 from public.vocab_progress p join public.vocab_words w on w.id = p.word_id where w.word = 'sinov-09') then
    raise exception 'FAIL L08: ikkinchi import yozdi';
  end if;
  raise notice 'OK L08 import: nom bo''yicha moslash, kattaroq quti qoladi, kvota sarflanmaydi, faqat bir marta';
end
$$;
reset role;

-- Foydalanuvchi B: A ning ma'lumotini ko'rmaydi
set local role authenticated;
select set_config('request.jwt.claims', '{"sub": "00000000-0000-4000-8000-0000000000d1", "role": "authenticated"}', true) \gset
do $$
begin
  if exists (select 1 from public.vocab_progress) or exists (select 1 from public.user_vocab_words)
     or exists (select 1 from public.usage_counters) then
    raise exception 'FAIL L09: B A ning progressi, so''zlari yoki hisoblagichini ko''rdi';
  end if;
  begin
    perform public.vocab_star(gen_random_uuid(), true, true);
    raise exception 'FAIL L09: B begona o''z so''ziga yulduzcha qo''ydi';
  exception when sqlstate 'P0002' then null;
  end;
  delete from public.user_vocab_words;
  delete from public.vocab_progress;
  raise notice 'OK L09 B: A ning progressi, o''z so''zlari va hisoblagichi ko''rinmaydi va o''chmaydi';
end
$$;
reset role;

do $$
begin
  if (select count(*) from public.vocab_progress where user_id = '00000000-0000-4000-8000-0000000000c1') = 0
     or (select count(*) from public.user_vocab_words where user_id = '00000000-0000-4000-8000-0000000000c1') <> 1 then
    raise exception 'FAIL L09: B ning delete so''rovi A qatorlarini o''chirdi';
  end if;
  raise notice 'LUG''AT SINOVLARI O''TDI';
end
$$;

rollback;
