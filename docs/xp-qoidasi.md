# XP va reyting qoidasi (P32, 1-PR)

- **Holat**: qoralama, 2026-11-12. Qarorlarni muallif boshqaruvchi sessiyaga topshirgan (2026-11-12): 18 yoshgacha reytingga qo'shilmaydi, mukofot yo'q, musobaqa 2-PR da.
- **Muallif tasdig'i kerak**: pastdagi hamma raqam (2/3/4/5/5 XP, kuniga 300, 3 soniya) **boshlang'ich qiymat**. O'zgarsa, ikki joy birga yangilanadi: `private.xp_rule` (yangi migratsiyada `create or replace`) va `src/data/satReyting.ts` (`xpQoida`).
- **Kod**: migratsiya `supabase/migrations/20261112184613_reyting.sql`, sinov `supabase/tests/reyting_test.sql` (R01–R18, `npm run db:tekshir`), sahifa `/uz/sat/vosita/reyting/`, mantiq `src/lib/sat/reyting.ts`.

## XP qanday yoziladi

XP ni faqat server yozadi. `public.attempts` ga yangi qator tushganda trigger (`attempts_award_xp` → `private.award_xp`) `public.xp_events` ga yozadi. `attempts` ga faqat `submit_answer` RPC yozadi va `is_correct` ni server hisoblaydi, shuning uchun mijoz XP ni soxtalashtira olmaydi. `submit_answer` o'zgarmagan.

| Hodisa | XP | Kalit (`kind`, `ref`) | Shart |
| --- | --- | --- | --- |
| Savolga birinchi javob (mashq, taymerli) | 2 | `answer`, savol ID | umrida bir marta |
| Birinchi urinishda to'g'ri | +3 | `correct`, savol ID | avval bu savolga hech qayerda (kun savoli ham) javob berilmagan |
| Takrorlashda to'g'ri | 4 | `review`, `savol:kun` | savol `review_queue` da; bir savolga kuniga bir marta |
| Kun savoliga javob | 5 | `daily`, kun | kuniga bir marta |
| Kun savoliga to'g'ri javob | +5 | `daily_correct`, kun | kuniga bir marta |

Kun Toshkent vaqti bo'yicha (`private.today_tashkent()`, kun savoli bilan bir xil).

## Aldovdan himoya

- **Takror yuborish**: `(user_id, kind, ref)` noyob. Bir savolni yangi sessiyada qayta yechish yangi XP bermaydi. `submit_answer` o'zi ham bir sessiyada bir savolga bitta urinish yozadi.
- **Tezlik**: mashq, taymerli va takrorlash javobi `time_ms < 3000` yoki `time_ms` siz bo'lsa XP yo'q. Kun savoli bundan mustasno (mijoz vaqt yubormaydi, kuniga bitta). Cheklov: `time_ms` ni mijoz yuboradi, shuning uchun bu faqat qo'shimcha filtr. Asosiy himoya noyob kalit va kunlik chegara.
- **Kunlik chegara**: kuniga ko'pi bilan 300 XP. Ortig'i kesiladi. Chegara to'lgan bo'lsa yozuv qo'shilmaydi (kalit band bo'lmaydi), ertasi kuni shu savol XP beradi. Bir foydalanuvchining parallel javoblari advisory lock bilan navbatga turadi (parallel holat lokal sinovda alohida tekshirilmagan).
- **Bot**: Free tarif kvotasi (P19) ham javoblar sonini cheklaydi, agar muallif limit qo'ysa.
- **Eski javoblar**: XP migratsiya qo'llangan kundan boshlab hisoblanadi, oldingi urinishlar uchun berilmaydi.

## Reyting

- **Opt-in**: `public.leaderboard_members` da qatori bor foydalanuvchi ko'rinadi. Standart holatda qator yo'q. Qo'shilish `leaderboard_join(laqab, mamlakat, ko'rsatish)`, chiqish `leaderboard_leave()` (qator o'chadi, XP qoladi). Rozilik vaqti `joined_at`.
- **Ko'rinadigan ma'lumot**: o'rin, laqab, XP va (faqat `show_country = true` bo'lsa) mamlakat kodi. `user_id`, ism, email, surat RPC javobida yo'q (R10 sinovi).
- **Kim ko'radi**: faqat hisobga kirgan kattalar (qatnashmasa ham). Mehmon uchun RPC yopiq.
- **Davr**: `week` dushanba 00:00 dan, `month` oyning 1-kunidan (Toshkent). Teng XP = teng o'rin (`rank()`), bir xil o'rinlar laqab bo'yicha tartiblanadi.
- **Doira**: `all` yoki `country` (chaqiruvchining profil mamlakati; chaqiruvchi ham mamlakatini ko'rsatgan bo'lishi kerak).
- **Hajm**: eng ko'pi 50 qator va o'z qatori (50 dan pastda bo'lsa).

## 18 yoshgacha (P03/P23 qarori)

Reytingga faqat `auth.users.raw_user_meta_data ->> 'age_group' = 'adult'` bo'lgan hisob qo'shiladi va jadvalni ko'radi. `minor` (12–17) va yosh guruhi yo'q hisoblar faqat o'z XP'sini ko'radi (`leaderboard_me`).

**Ochiq cheklov**: `age_group` foydalanuvchi o'zi e'lon qilgan qiymat. U `user_metadata` da, foydalanuvchi uni `auth.updateUser` bilan o'zgartira oladi. Server buni tekshira olmaydi. Ro'yxatdagi yosh belgisi ham shu ishonch modelida. Kuchliroq yechim (masalan, yosh guruhini faqat server yozadigan ustunga ko'chirish) alohida vazifa.

## Laqab moderatsiyasi

- Shakl: `^[A-Za-z0-9_]{3,20}$` (server va brauzer bir xil). Noyob, katta-kichik harf farqsiz (`profiles_nickname_key`).
- Taqiqlangan so'zlar: `private.blocked_words` (zaxira so'zlar `admin`, `tayanch`, `moderator` va boshqalar, inglizcha, ruscha lotin yozuvida, o'zbekcha qisqa ro'yxat). Laqab normallashtiriladi (kichik harf, `0→o 1→i 3→e 4→a 5→s 7→t 8→b @→a $→s`, harf bo'lmagan belgi olib tashlanadi; `1` alohida `l` deb ham tekshiriladi) va so'z substring sifatida qidiriladi. Shunda `F_u_c_k1`, `B1yat99` ham ushlanadi. Kamchilik: qisqa so'zlar boshqa so'z ichida ham topilishi mumkin (masalan `dick` → `Dickens`).
- Qayerda tekshiriladi: `leaderboard_join`, `profiles` triggeri (`/uz/hisob/profil/` da ham) va jadvalni o'qishda (eski nomaqbul laqab ko'rinmaydi).
- So'z qo'shish (muallif, SQL editor):
  ```sql
  insert into private.blocked_words (word, note) values ('soz', 'uz') on conflict do nothing;
  ```
- Laqabni yashirish (moderator):
  ```sql
  update public.leaderboard_members set hidden_at = now(), hidden_reason = '<sabab>'
   where user_id = (select id from public.profiles where lower(nickname) = lower('<laqab>'));
  ```
  Qaytarish: `hidden_at = null`. Yashirilgan foydalanuvchi sahifada xabar ko'radi, XP'si o'zgarmaydi.

## Brauzer

Faqat `tayanch:sat-reyting` (tanlangan davr va doira). XP va jadval brauzerda saqlanmaydi.

## Musobaqa (2-PR, hali qurilmagan)

Vaqt oynasi, savollar to'plami, natija jadvali. `practice_sessions.mode` ga `contest` qo'shiladi. Mukofot yo'q (2026-11-12 qarori). Mukofot bo'lsa, muallif qoidalari va huquqiy matni kerak.
