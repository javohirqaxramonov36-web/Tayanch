-- P26 (xavfsizlik auditi, K3 + K6). Takror ishga tushirilsa buzilmaydi.
-- K3: events ga foydalanuvchi boshiga kunlik chegara (Toshkent kuni, 500 ta). Oshsa 'events_rate_limited' (P0001).
--     reports va feedback chegarasi P24 da (20261112143717_xabar_cheklov.sql, PR #130: 24 soatda 10 va 5,
--     o'z xato kodlari bilan). Takror trigger qo'yilmaydi: ikki xil chegara va xato kodi mijozni chalg'itadi.
--     service_role (JWT'da sub yo'q) cheklanmaydi.
-- K6: bookmarks ga faqat foydalanuvchi o'z sessiyasida ko'rgan savol yoziladi. Shunda review_preview
--     (bookmarks yoki review_queue dagi savol matnini beradi) orqali ko'rilmagan savolni kvotasiz ochib bo'lmaydi.
--     reports ga bu shart qo'yilmaydi: report savol matnini ochmaydi, tekshiruvi P24 triggerida.
-- Chegara (Claude taklifi, muallif tasdiqladi 2026-11-12). O'zgartirish: trigger argumentini yangi migratsiyada.

-- K3. Trigger funksiyasi: TG_ARGV[0] = kunlik chegara.
create or replace function private.kunlik_chegara()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user  uuid := auth.uid();
  v_max   integer := tg_argv[0]::integer;
  v_bosh  timestamptz := private.today_tashkent()::timestamp at time zone 'Asia/Tashkent';
  v_soni  integer;
begin
  if v_user is null then
    return new; -- server (service_role): cheklov yo'q
  end if;
  -- Bir foydalanuvchi + jadval uchun parallel so'rovlar navbat bilan sanaladi (qulf tranzaksiya oxirigacha).
  perform pg_advisory_xact_lock(hashtextextended('tayanch:' || tg_table_name || ':' || v_user::text, 0));
  execute format('select count(*) from public.%I where user_id = $1 and created_at >= $2', tg_table_name)
    into v_soni using v_user, v_bosh;
  if v_soni >= v_max then
    raise exception '%_rate_limited', tg_table_name using errcode = 'P0001';
  end if;
  return new;
end
$$;
revoke all on function private.kunlik_chegara() from public, anon, authenticated;

-- events_user_idx (user_id, created_at desc) oldindan bor (0007).
drop trigger if exists events_kunlik_chegara on public.events;
create trigger events_kunlik_chegara before insert on public.events
  for each row execute function private.kunlik_chegara('500');

-- K6. Savol foydalanuvchining biror sessiyasida bo'lgan bo'lishi shart (session_questions va practice_sessions
-- o'z RLS policy'lari bilan o'qiladi: faqat o'z sessiyalari).
drop policy if exists bookmarks_insert_own on public.bookmarks;
create policy bookmarks_insert_own on public.bookmarks
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and exists (
      select 1
      from public.session_questions sq
      join public.practice_sessions ps on ps.id = sq.session_id
      where ps.user_id = (select auth.uid()) and sq.question_id = bookmarks.question_id
    )
  );
