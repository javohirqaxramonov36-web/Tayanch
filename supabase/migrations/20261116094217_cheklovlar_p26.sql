-- P26 (xavfsizlik auditi, K6). Takror ishga tushirilsa buzilmaydi.
-- K6: bookmarks ga faqat foydalanuvchi ko'rgan savol yoziladi. "Ko'rgan" = o'z sessiyasida (session_questions:
--     mashq, kun savoli, takrorlash, kurs, mock), takrorlash navbatida (review_queue) yoki javoblarida (attempts).
--     Shunda review_preview va kurs funksiyalari (bookmarks dagi savol matnini beradi) orqali ko'rilmagan
--     savolni kvotasiz ochib bo'lmaydi. Uchala jadval ham o'z RLS policy'si bilan o'qiladi (faqat o'z qatorlari).
-- K3 (kunlik chegara) bu yerda yo'q: reports/feedback P24 da (20261112151943_xabar_cheklov), events P25 da
--     (20261112143717_metrikalar: to'g'ridan-to'g'ri yozish yopiq, soatiga 60 ta). Muallif tasdig'i 2026-11-12,
--     torayish Claude qarori (docs/xavfsizlik-hisobot.md, F03).

drop policy if exists bookmarks_insert_own on public.bookmarks;
create policy bookmarks_insert_own on public.bookmarks
  for insert to authenticated with check (
    user_id = (select auth.uid())
    and (
      exists (
        select 1
        from public.session_questions sq
        join public.practice_sessions ps on ps.id = sq.session_id
        where ps.user_id = (select auth.uid()) and sq.question_id = bookmarks.question_id
      )
      or exists (
        select 1 from public.review_queue r
        where r.user_id = (select auth.uid()) and r.question_id = bookmarks.question_id
      )
      or exists (
        select 1 from public.attempts a
        where a.user_id = (select auth.uid()) and a.question_id = bookmarks.question_id
      )
    )
  );
