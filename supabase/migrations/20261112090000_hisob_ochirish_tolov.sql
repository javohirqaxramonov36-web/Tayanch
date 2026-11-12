-- P23 davomi (2026-11-11): hisobni o'chirish endi Edge Function `hisob-malumot` orqali, qayta autentifikatsiya bilan.
--
-- 1) payments.user_id: avval "on delete restrict" edi, shuning uchun to'lov qilgan foydalanuvchi hisobini o'chira olmasdi
--    (23503). Endi hisob o'chganda to'lov yozuvi qoladi (summa, sana, inPAY raqami: buxgalteriya uchun), lekin
--    foydalanuvchiga bog'lanishi uziladi (user_id null). Saqlash muddati: muallif/yurist javobi (Maxfiylik siyosati).
--    Tugallanmagan (created/pending) to'lovi bor hisob o'chirilmaydi: buni Edge Function tekshiradi, chunki
--    payment_apply_event user_id null bo'lsa obuna yozolmaydi.
-- 2) Eski RPC delete_own_account (20261110210000, qayta autentifikatsiyasiz) olib tashlanadi.
--
-- Qo'llash tartibi: avval `hisob-malumot` deploy, keyin sayt (profil sahifasi), so'ng shu migratsiya.
-- Takror ishga tushirilsa buzilmaydi.

alter table public.payments alter column user_id drop not null;

alter table public.payments drop constraint if exists payments_user_id_fkey;
alter table public.payments
  add constraint payments_user_id_fkey foreign key (user_id) references auth.users (id) on delete set null;

drop function if exists public.delete_own_account();
