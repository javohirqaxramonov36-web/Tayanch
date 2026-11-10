-- 0001. Asos: private sxema va umumiy yordamchi funksiyalar.
-- Takror ishga tushirilsa buzilmaydi (if not exists / create or replace).
-- private sxemasi PostgREST API'ga chiqarilmaydi: ichki funksiyalar va sinov jadvallari shu yerda.

create schema if not exists private;
revoke all on schema private from public;

-- updated_at ustunini har UPDATE da yangilaydi.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end
$$;

-- Toshkent bo'yicha bugungi sana (takrorlash va kvota davrlari shu sana bilan).
create or replace function private.today_tashkent()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Asia/Tashkent')::date
$$;

revoke all on all functions in schema private from public;
