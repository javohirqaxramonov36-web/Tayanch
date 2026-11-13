# Tarif qoidalari (SAT, P19)

Holat: 2026-11-11. Manba: jonli `plans` jadvali va migratsiyalar `20261111090000_tariflar_p19.sql`, `20261111120000_analitika.sql`, `20261111210000_kvota_p19.sql`.
Raqamlarni faqat muallif beradi. Ular kodga emas, `public.plans` qatoriga yoziladi (pastdagi "Qiymatni o'zgartirish" bo'limi).

## Tariflar

Tariflar: Free, Pro, Max (muallif qarori, 2026-11-11). 2026-11-11 gacha nomi Elite edi; nom va kod `elite` → `max` PR #101 da (`20261111200000_tarif_max.sql`).

| | Free (`free`) | Pro (`pro`) | Max (`max`) |
| --- | --- | --- | --- |
| Holat | faol | faol | faol emas ("Coming soon") |
| Narx | to'lovsiz | 59 000 so'm | belgilanmagan |
| Davr | — | 30 kun, bir martalik to'lov, avtomatik yangilanmaydi | belgilanmagan |
| 90 kunlik davr, chegirma | — | yo'q (muallif, 2026-11-11) | yo'q |
| Sinov muddati | — | yo'q (muallif, 2026-11-11) | yo'q |
| Kuniga savol (`questions`) | cheklovsiz | cheklovsiz | belgilanmagan |
| Kuniga sessiya (`sessions`) | cheklovsiz | cheklovsiz | belgilanmagan |
| Kuniga javob (`answers`) | cheklovsiz | cheklovsiz | belgilanmagan |
| Kuniga yangi so'z (`new_words`, P15) | cheklovsiz | cheklovsiz | belgilanmagan |
| Reja qayta tuzish (`plan_rebuilds`, P13) | cheklovsiz | cheklovsiz | belgilanmagan |
| Yangi mock imtihon (`mock_first`, P30) | cheklovsiz | cheklovsiz | belgilanmagan |
| Mock retake (`mock_retake`, P30) | cheklovsiz | cheklovsiz | belgilanmagan |
| Kengaytirilgan analitika (`analytics_extended`) | yo'q | bor | bor |
| O'z so'zlarim (`vocab_my_words`, P15) | belgilanmagan | belgilanmagan | belgilanmagan |
| Rasmiy test yozuvlari | cheklovsiz (kvota kaliti yo'q) | cheklovsiz | cheklovsiz |
| AI Tutor (`ai_messages` kunlik, `ai_messages_month` oylik, P33) | yopiq (limit yo'q) | yopiq (limit yo'q) | yopiq |
| Pro va Max farqi | — | — | belgilanmagan |

"Cheklovsiz" degani `plans.limits` da shu kalit yo'q (muallif qarori, 2026-11-11: "hozircha cheklovsiz"). Hisoblagich baribir yuritiladi, `UsageBar` sarfni ko'rsatadi.

**Istisno: AI Tutor (P33).** `ai_messages` va `ai_messages_month` uchun kalit yo'qligi "cheklovsiz" emas, **"yopiq"** degani: cheksiz bepul foydalanish yo'q. AI faqat ikkala kalit ham `max > 0` bilan yozilganda ochiladi (umumiy byudjet va kalit ham kerak). Taklif (muallif qarori kerak): Free kuniga 3 / oyiga 30, Pro kuniga 30 / oyiga 300. Batafsil: `docs/ai-tutor.md`.

## Hisoblash qoidalari

1. **Amaldagi tarif.** `private.current_plan(user, bolim)` quyidagi shartlarning hammasiga mos obunani oladi: `status = 'active'`, `starts_at <= now()`, `ends_at` bo'sh yoki kelajakda. Bir nechta bo'lsa, `plans.sort` eng kattasi olinadi. Hech biri bo'lmasa, tarif `free`. Obuna tugaganda yoki bekor qilinganda hech narsa o'chirilmaydi: javoblar, xato daftari, reja va hisoblagichlar joyida qoladi, faqat yangi sarf Free limitiga bo'ysunadi. Kundalik ish (P22, `private.expire_subscriptions`, Cron `obuna-muddati`, 00:05 Toshkent) muddati o'tgan `active` obunani `expired` qiladi va `audit_log` ga yozadi; bu faqat bazadagi holatni moslaydi, tarifni o'zgartirmaydi.
2. **Limit yozuvi.** `plans.limits` shakli: `{"<kalit>": {"max": <butun son>, "per": "day" | "month"}}`. Kalit yo'q bo'lsa cheklov ham yo'q. `per` berilmasa `day`.
3. **Davr.** Davr boshi Asia/Tashkent sanasi bo'yicha olinadi (`private.today_tashkent()`): kunlik davr yarim tundan, oylik davr oyning 1-kunidan boshlanadi. Hisoblagich kaliti `(user_id, key, period_start)`. Yangi davr yangi qatordan, 0 dan boshlanadi; eski qator o'chirilmaydi. Tiklanish vaqti `private.period_end(per)`, `usage_status()` da `resets_at`.
4. **Sarflash.** Hamma RPC bitta funksiyani chaqiradi: `private.consume_quota(user, key, n)`. U hisoblagich qatorini yaratadi (`on conflict do nothing`), keyin bitta shartli `update ... where count + n <= max` qiladi. Shart bajarilmasa, `quota_exceeded` (P0001) xatosi chiqadi va butun RPC tranzaksiyasi qaytariladi. "Hammasi yoki hech narsa": 3 ta qolganida 5 ta so'ralsa, birortasi ham sarflanmaydi. Parallel so'rovlarda qator qulfi tufayli limitdan oshib bo'lmaydi (K06 sinovi).
5. **Kim chaqiradi.** P07/P08: `start_session` (`sessions`, `questions`), `submit_answer` (`answers`), `daily_question` (P10 dan beri hech qanday kalitni sarflamaydi: `20261111220000_kun_savoli.sql`), `start_review_session` (`review_sessions`, `questions`). P15: yangi so'z berilganda `new_words`. P13: reja qayta tuzilganda `plan_rebuilds`. P30: `start_mock` yangi formada `mock_first`, retake'da `mock_retake` (mock ichida `sessions`/`questions`/`answers` sarflanmaydi; `docs/mock-imtihon.md`). Yangi kalit uchun migratsiya kerak emas.
6. **Mijoz.** Brauzer limitni majburlay olmaydi va hisoblagichni o'zgartira olmaydi: `usage_counters` uchun faqat SELECT (o'z qatori) bor, `private` sxemasi yopiq. Mijozdagi tekshiruv (Savol banki hajmi, `UsageBar`) faqat ko'rsatish uchun.
7. **Funksiya bayrog'i.** `plans.features` massividagi snake_case satr mashina bayrog'i hisoblanadi (`private.has_feature`). Boshqa satrlar Obuna sahifasida ko'rsatiladigan matn. Ochiq masala: P15 branch'i `{"flag": "vocab_my_words"}` obyekt shaklini ishlatadi; merge'da bitta shaklga keltiriladi.
8. **Qo'lda tarif berish** (promo, stipendiya): `public.admin_grant_plan(user, plan_code, days, reason, actor)`, faqat service role orqali (SQL Editor yoki Edge Function). `days = null` muddatsiz tarif beradi. `actor` majburiy. Har chaqiruv `audit_log` ga yoziladi (`action = 'grant_plan'`, `reason`).

## Qiymatni o'zgartirish

Muallif raqam bergach, migratsiya yoki SQL Editor orqali faqat ma'lumot o'zgartiriladi, masalan:

```sql
update public.plans
   set limits = '{"questions": {"max": <son>, "per": "day"}, "new_words": {"max": <son>, "per": "day"}}'
 where code = 'free';
```

Keyin shu jadval yangilanadi. Kod o'zgarmaydi; `UsageBar` va Savol banki yangi limitni `usage_status()` dan o'zi oladi.

## UsageBar

`src/components/sat/UsageBar.astro` + `src/lib/sat/usageBar.ts` (`usageBarniChiz`). Hozir Obuna sahifasida (`/uz/sat/hisob/obuna/`) ishlatiladi.

- Limitli kalit: "12 of 20", "8 left today · Resets at midnight (Tashkent time)" va shkala. Shkala `aria-hidden`, chunki ma'lumot matnda bor.
- Cheklovsiz kalit: bugungi soni va "No limit on your plan", shkalasiz.
- `max: 0`: "Not included" va "Not part of your plan", shkalasiz ("0 of 0" emas, tugagan limit ham hisoblanmaydi).

## Subscription sahifasi (2026-11-13)

`/uz/sat/hisob/obuna/` (sahifa nomi "Subscription"): joriy tarif va sarf metrlari, tariflar (Monthly / 3 months; server qabul qilmaydigan davr o'chiq, "Coming soon"), Pro va Max kartalari "What's included" bilan, Free | Pro | Max taqqoslash jadvali, FAQ, to'lov tarixi. Jadval va karta ro'yxati `src/lib/sat/tarifJadval.ts` da faqat `plans.limits` va `plans.features` dan quriladi (qatorlar tartibi va nomi `satTarif.jadvalQatorlari`): kalit yo'q "No limit", `max 0` "Not included", AI kalitlari yo'q "Not included", bazada yo'q (faol emas) tarif "Coming soon". Raqam qo'yilsa sahifa o'zi yangilanadi.

**TarifDialog** (`src/components/sat/TarifDialog.astro`, `src/lib/sat/tarifDialog.ts`): server `quota_exceeded` qaytarganda tavsiya tarif (Pro) nima berishini ko'rsatadi, "Maybe later" / "See plans". Hozir faqat Savol bankida (Start bosilganda); limit oldindan ma'lum bo'lsa Start o'chiq turadi, oyna chiqmaydi. Tavsiya tarifdagi foydalanuvchiga chiqmaydi. Dev: `/uz/sat/mashq/bank/?mock=kvota2`, obuna sahifasi `?sinov=kvota`.
- Limit tugaganda halol xabar chiqadi: qachon tiklanishi, saqlangan ma'lumot joyida qolishi va "See plans" havolasi. Ogohlantiruvchi rang, taymer, "oxirgi imkoniyat" kabi bosim yo'q.

## Sinovlar

- `supabase/tests/kvota_test.sql` (`npm run db:tekshir`):
  - K00: nom va effective plan.
  - K01: limit tugashi (kunlik va oylik, "hammasi yoki hech narsa").
  - K02: kun almashishi va `resets_at`.
  - K03: tarif tugashi va bekor qilinishi.
  - K04: `admin_grant_plan` va audit.
  - K05: `usage_status` shakli va mijoz huquqlari.
- K06, parallel: `scripts/rls-tekshir.sh` oxirida 10 ta alohida ulanish ishga tushadi, limit 3, natija aynan 3. Atomik bo'lmagan versiya bilan sinab ko'rilgan: test xatoni ushlaydi.
- `src/lib/testlar/usageBar.test.ts`: qatorlar, tugash holati, Toshkent bo'yicha tiklanish sanasi.
