-- Hisobni o'chirish (P23, 2026-11-09). Foydalanuvchi o'z hisobini profil sahifasidan o'chiradi.
-- Asos: "Shaxsga doir ma'lumotlar to'g'risida"gi Qonun 17, 21, 30-moddalar (LX02): rozilik chaqirib olinganda ma'lumot yo'q qilinadi.
-- auth.users qatori o'chadi; unga "on delete cascade" bilan bog'langan jadvallar (profiles, progress va boshqalar) ham o'chadi.
-- "on delete restrict" bilan bog'langan yozuv (masalan to'lov tarixi) bo'lsa, o'chirish 23503 xatosi bilan to'xtaydi:
-- brauzer buni alohida matn bilan ko'rsatadi.

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := (select auth.uid());
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  delete from auth.users where id = uid;
end
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
