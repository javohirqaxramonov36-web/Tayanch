-- 0010. public.questions ni P05 savol formatiga moslash (P02 davomi).
-- P05 importi (scripts/savol-import.mjs) yozadigan, lekin 0003 da yo'q maydonlar va tasdiqlash qoidasi.
-- Qarorlar va sabab: docs/qarorlar/002-sat-savol-baza.md. Takror ishga tushirilsa buzilmaydi.
-- Savol mazmuni bu yerga yozilmaydi.

-- ---------- 1. Yangi ustunlar ----------
-- Eski qatorlar va qo'lda kiritilgan yozuvlar uchun drafted_by va content_hash bo'sh bo'lishi mumkin; import har doim yozadi.
alter table public.questions add column if not exists drafted_by   text;
alter table public.questions add column if not exists verified_at  timestamptz;
alter table public.questions add column if not exists tags         text[] not null default '{}';
alter table public.questions add column if not exists content_hash text;

comment on column public.questions.drafted_by   is 'ai | human: kim qoralama yozgan (P05)';
comment on column public.questions.verified_at  is 'Inson tasdiqlagan vaqt (savol:tasdiqla yozadi)';
comment on column public.questions.tags         is 'Erkin teglar (P05)';
comment on column public.questions.content_hash is 'P05 mazmun hash''i: import o''zgargan mazmunni shu bilan aniqlaydi';

-- ---------- 2. Tekshiruvlar ----------
alter table public.questions drop constraint if exists questions_drafted_by;
alter table public.questions add constraint questions_drafted_by
  check (drafted_by is null or drafted_by in ('ai', 'human'));

alter table public.questions drop constraint if exists questions_source_original;
alter table public.questions add constraint questions_source_original
  check (source = 'original');

-- verified faqat inson tasdig'i bilan: verified_by bor, author dan farqli (katta-kichik harf va
-- chetdagi bo'shliq hisobga olinmaydi), tasdiqlash vaqti bor. 0003 dagi questions_verified_by shu qoidaning bir qismi.
alter table public.questions drop constraint if exists questions_verified_rule;
alter table public.questions add constraint questions_verified_rule check (
  status <> 'verified'
  or (
    verified_by is not null
    and btrim(verified_by) <> ''
    and lower(btrim(verified_by)) <> lower(btrim(coalesce(author, '')))
    and verified_at is not null
  )
);

-- draft savolda tasdiq izi qolmaydi (import ham shunday yozadi). hidden savolda iz saqlanadi.
alter table public.questions drop constraint if exists questions_draft_rule;
alter table public.questions add constraint questions_draft_rule check (
  status <> 'draft' or (verified_by is null and verified_at is null)
);

-- Rasm bo'lsa, ekran o'quvchi uchun alt majburiy (P05).
-- coalesce: CHECK null natijani "o'tdi" deb hisoblaydi.
alter table public.questions drop constraint if exists questions_figure_alt;
alter table public.questions add constraint questions_figure_alt check (coalesce(
  figure is null or btrim(coalesce(figure ->> 'alt', '')) <> '',
  false
));

-- ---------- 3. Versiya ----------
-- 0003 dagi trigger mazmun o'zgarsa versiyani +1 qiladi. P05 importi versiyani o'zi oshirib yuboradi
-- (masalan 1 -> 3): kattasi olinadi, aks holda bazadagi versiya fayldagidan orqada qolardi.
create or replace function private.questions_bump_version()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.passage, new.stem, new.options, new.correct, new.explanation, new.figure)
     is distinct from (old.passage, old.stem, old.options, old.correct, old.explanation, old.figure) then
    new.version := greatest(new.version, old.version + 1);
  end if;
  return new;
end
$$;

revoke all on function private.questions_bump_version() from public;
