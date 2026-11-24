# Tarif qoidalari (SAT, P19)

Holat: 2026-11-24. Manba: jonli `plans` jadvali va migratsiyalar `20261111090000_tariflar_p19.sql`, `20261111120000_analitika.sql`, `20261111210000_kvota_p19.sql`, `20261124120000_tarif_max_narx.sql` (Max narxi; qo'llash muallifda).
Raqamlarni faqat muallif beradi. Ular kodga emas, `public.plans` qatoriga yoziladi (pastdagi "Qiymatni o'zgartirish" bo'limi).

## Tariflar

Tariflar: Free, Pro, Max (muallif qarori, 2026-11-11). 2026-11-11 gacha nomi Elite edi; nom va kod `elite` → `max` PR #101 da (`20261111200000_tarif_max.sql`).

| | Free (`free`) | Pro (`pro`) | Max (`max`) |
| --- | --- | --- | --- |
| Holat | faol | faol | faol emas ("Coming soon"), AI tutor tayyor bo'lgach sotuvga |
| Narx | to'lovsiz | 59 000 so'm | 119 000 so'm (muallif, 2026-11-24) |
| Davr | — | 30 kun, bir martalik to'lov, avtomatik yangilanmaydi | 30 kun, bir martalik, avtomatik yangilanmaydi |
| 90 kunlik davr, chegirma | — | yo'q (muallif, 2026-11-11) | yo'q |
| Sinov muddati | — | yo'q (muallif, 2026-11-11) | yo'q |
| Kuniga savol (`questions`) | cheklovsiz | cheklovsiz | cheklovsiz |
| Kuniga sessiya (`sessions`) | cheklovsiz | cheklovsiz | cheklovsiz |
| Kuniga javob (`answers`) | cheklovsiz | cheklovsiz | cheklovsiz |
| Kuniga yangi so'z (`new_words`, P15) | cheklovsiz | cheklovsiz | cheklovsiz |
| Reja qayta tuzish (`plan_rebuilds`, P13) | cheklovsiz | cheklovsiz | cheklovsiz |
| Yangi mock imtihon (`mock_first`, P30) | cheklovsiz; Max sotuvida oyiga 1 | cheklovsiz; Max sotuvida oyiga 2 | cheklovsiz |
| Mock retake (`mock_retake`, P30) | cheklovsiz; Max sotuvida oyiga 1 | cheklovsiz; Max sotuvida oyiga 2 | cheklovsiz |
| Kengaytirilgan analitika (`analytics_extended`) | yo'q | bor | bor |
| O'z so'zlarim (`vocab_my_words`, P15) | belgilanmagan | belgilanmagan | belgilanmagan |
| Rasmiy test yozuvlari | cheklovsiz (kvota kaliti yo'q) | cheklovsiz | cheklovsiz |
| AI Tutor (`ai_messages` kunlik, `ai_messages_month` oylik, P33) | yopiq (faqat Max'da bo'ladi) | yopiq (faqat Max'da bo'ladi) | yopiq; ochiladi, limit raqami belgilanmagan |
| Pro va Max farqi | — | — | AI tutor va cheklovsiz mock (muallif, 2026-11-24) |

"Cheklovsiz" degani `plans.limits` da shu kalit yo'q (muallif qarori, 2026-11-11: "hozircha cheklovsiz"). Hisoblagich baribir yuritiladi, `UsageBar` sarfni ko'rsatadi.

**Istisno: AI Tutor (P33).** `ai_messages` va `ai_messages_month` uchun kalit yo'qligi "cheklovsiz" emas, **"yopiq"** degani: cheksiz bepul foydalanish yo'q. AI faqat ikkala kalit ham `max > 0` bilan yozilganda ochiladi (umumiy byudjet va kalit ham kerak). 2026-11-24 dan qaror: AI Tutor faqat Max'da, Free va Pro'da yopiq qoladi. Max limiti raqami AI tutor qurilgach belgilanadi (muallif). Batafsil: `docs/ai-tutor.md`.

## Max sotuvga chiqishi (muallif qarori, 2026-11-24)

- Narx 119 000 so'm, 30 kun, bir martalik (`20261124120000_tarif_max_narx.sql`, `is_active = false` qoladi). O'sha migratsiya Pro'ning eskirgan ko'rinadigan matnlarini olib tashlaydi (`features = ["analytics_extended"]`).
- Pro'dan farqi: AI tutor (faqat Max'da) va cheklovsiz mock imtihon.
- Sotuv AI tutor tayyor bo'lgach ochiladi (kalit, byudjet, `ai-tutor` deploy: `docs/ai-tutor.md`). Shungacha bosh sahifa (`src/data/tariflar.ts`) va `/uz/sat/hisob/obuna/` (`satTarif.kutilayotgan`) Max narxini "Tez orada" / "Coming soon" bilan ko'rsatadi; to'lov tugmasi yo'q.
- Mock limitlari sotuv bilan birga kuchga kiradi (sotib olib bo'lmaydigan tarifga yo'naltirmaslik uchun).
- Sotuvga chiqarish migratsiyasi (keyin, alohida PR; `<kun>` va `<oy>` muallifdan):

```sql
update public.plans set limits = limits
  || '{"mock_first": {"max": 1, "per": "month"}, "mock_retake": {"max": 1, "per": "month"}}'::jsonb
 where code = 'free' and bolim = 'sat';
update public.plans set limits = limits
  || '{"mock_first": {"max": 2, "per": "month"}, "mock_retake": {"max": 2, "per": "month"}}'::jsonb
 where code = 'pro' and bolim = 'sat';
update public.plans set is_active = true, limits = limits
  || '{"ai_messages": {"max": <kun>, "per": "day"}, "ai_messages_month": {"max": <oy>, "per": "month"}}'::jsonb
 where code = 'max' and bolim = 'sat';
```

  Shu bilan birga: `satTarif.kutilayotgan.max` o'chiriladi, `tariflar.ts` da Max `cta` qo'yiladi, AI Tutor va mock qatorlari yangilanadi, `satTarif.tavsiya` qayta ko'riladi.

## Hisoblash qoidalari

1. **Amaldagi tarif.** `private.current_plan(user, bolim)` quyidagi shartlarning hammasiga mos obunani oladi: `status = 'active'`, `starts_at <= now()`, `ends_at` bo'sh yoki kelajakda. Bir nechta bo'lsa, `plans.sort` eng kattasi olinadi. Hech biri bo'lmasa, tarif `free`. Obuna tugaganda yoki bekor qilinganda hech narsa o'chirilmaydi: javoblar, xato daftari, reja va hisoblagichlar joyida qoladi, faqat yangi sarf Free limitiga bo'ysunadi. Kundalik ish (P22, `private.expire_subscriptions`, Cron `obuna-muddati`, 00:05 Toshkent) muddati o'tgan `active` obunani `expired` qiladi va `audit_log` ga yozadi; bu faqat bazadagi holatni moslaydi, tarifni o'zgartirmaydi.
2. **Limit yozuvi.** `plans.limits` shakli: `{"<kalit>": {"max": <butun son>, "per": "day" | "month"}}`. Kalit yo'q bo'lsa cheklov ham yo'q. `per` berilmasa `day`.
3. **Davr.** Davr boshi Asia/Tashkent sanasi bo'yicha olinadi (`private.today_tashkent()`): kunlik davr yarim tundan, oylik davr oyning 1-kunidan boshlanadi. Hisoblagich kaliti `(user_id, key, period_start)`. Yangi davr yangi qatordan, 0 dan boshlanadi; eski qator o'chirilmaydi. Tiklanish vaqti `private.period_end(per)`, `usage_status()` da `resets_at`.
4. **Sarflash.** Hamma RPC bitta funksiyani chaqiradi: `private.consume_quota(user, key, n)`. U hisoblagich qatorini yaratadi (`on conflict do nothing`), keyin bitta shartli `update ... where count + n <= max` qiladi. Shart bajarilmasa, `quota_exceeded` (P0001) xatosi chiqadi va butun RPC tranzaksiyasi qaytariladi. "Hammasi yoki hech narsa": 3 ta qolganida 5 ta so'ralsa, birortasi ham sarflanmaydi. Parallel so'rovlarda qator qulfi tufayli limitdan oshib bo'lmaydi (K06 sinovi).
5. **Kim chaqiradi.** P07/P08: `start_session` (`sessions`, `questions`), `submit_answer` (`answers`), `daily_question` (P10 dan beri hech qanday kalitni sarflamaydi: `20261111220000_kun_savoli.sql`), `start_review_session` (`review_sessions`, `questions`). P15: yangi so'z berilganda `new_words`. P13: `save_study_plan` har chaqiruvda `plan_rebuilds` (tuzish, qayta tuzish, brauzerdagi rejani hisobga saqlash; o'chirish qaytarmaydi; belgilash va qayta taqsimlash sarflamaydi; `20261112150000_reja_p13.sql`). P30: `start_mock` yangi formada `mock_first`, retake'da `mock_retake` (mock ichida `sessions`/`questions`/`answers` sarflanmaydi; `docs/mock-imtihon.md`). Yangi kalit uchun migratsiya kerak emas.
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

**TarifDialog** (`src/components/sat/TarifDialog.astro`, `src/lib/sat/tarifDialog.ts`): server `quota_exceeded` qaytarganda tavsiya tarif (Pro) nima berishini ko'rsatadi, "Maybe later" / "See plans". Ulangan joylar: Savol banki (Start bosilganda), Mock test (yangi test yoki retake boshlanganda), mashq sessiyasi (javob yuborilganda, sahifada bir marta). Umumiy yordamchi `tarifTaklifiniOch(manba, matn, fokus)` (`supabaseTaklifManba(c)`; dev'da `tarifDialogSinov.ts`). Limit oldindan ma'lum bo'lsa tugma o'chiq turadi va sababi yoziladi, oyna chiqmaydi. Tavsiya tarifdagi foydalanuvchiga chiqmaydi. Ulanmagan: Lug'at (`new_words` qoldig'i oldindan ma'lum, sahifa ichida xabar beradi), AI tutor (hozir hamma tarifda yopiq, "not included" xabari oldindan chiqadi). Dev: `/uz/sat/mashq/bank/?mock=kvota2`, `/uz/sat/mashq/sessiya/?mock=kvota`, `/uz/sat/mashq/mock/?mock=kvota`, obuna sahifasi `?sinov=kvota`.
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

## Yon paneldagi Upgrade bandi (2026-11-13)

`BolimYon` (faqat SAT, Subscription sahifasining o'zida yo'q): "Upgrade to <tavsiya tarif nomi>" va izoh. Faqat kirgan va amaldagi tarifi `free` bo'lgan foydalanuvchiga ko'rinadi; pullik, noma'lum yoki xato holatda yashirin. Izoh `upgradeIzohi`: tavsiya tarif Free'dan farq qiladigan jadval qatorlari nomi (ko'pi bilan 2 ta), farq bo'lmasa "Compare plans". Raqam yozilmaydi. supabase-js yuklanmaydi: `tayanch:auth` dagi token bilan REST (`rpc/usage_status`, `plans`), natija sessionStorage `tayanch:sat-tarif-kesh` da 10 daqiqa (foydalanuvchi id bilan); Subscription sahifasi va muvaffaqiyatli to'lov keshni tozalaydi. Mantiq `src/lib/sat/upgradeBand.ts` (testlar), brauzer qismi `upgradeBandUlash.ts`. Dev: istalgan SAT sahifasida `?upgrade=sinov`.

## ADR 006 uchun tekshiruv (2-bosqich, 2026-11-21)

Asos `origin/main`, commit `fc4fb4f922aebd27a6e63fc21562231726cc7ff9`. Quyidagi xulosalar repo kodi va migratsiyalaridan olindi. Jonli bazaning sxemasi va joylangan Edge Function versiyalari tekshirilmagan. Qaror alohida PR #214 da, ushbu tekshiruv vaqtida ochiq. [ADR 006 PR #214](https://github.com/javohirqaxramonov36-web/Tayanch/pull/214)

### 1. `plans.bolim` mavjud

- `supabase/migrations/20261108000006_tolov.sql` 5–18-qatorlarda `public.plans` ni yaratadi. `bolim text not null default 'sat'` 8-qatorda bor.
- `plans.bolim` check qiymatlari `top-admission`, `sat`, `ielts`, `eyuf`. `payments.bolim` (33-qator) va `subscriptions.bolim` (54-qator) ham shu qiymatlarga cheklangan.
- `src/data/bolimlar.ts` dagi identifikator maydoni `slug`. Unda yuqoridagi to'rtta qiymatga qo'shimcha `ai-academy` bor. Uch jadvalning check cheklovi shu ro'yxatdan ortda qolgan.
- Dastlabki `free`, `pro`, `elite` qatorlari `sat` bilan yaratilgan (24–28-qatorlar). `20261111200000_tarif_max.sql` `elite` ni `max` ga o'tkazadi. Keyingi migratsiyalarda ushbu uch jadvalning `bolim` check qiymatlarini kengaytirish yoki `plans.bolim` ni qayta yaratish topilmadi. Jonli qatorlarning qiymati tekshirish kerak.
- `plans.code` yagona primary key. Bir xil `pro` kodini ikki qavatga berib bo'lmaydi. Keyingi pullik qavat uchun alohida kod kerak, ko'rinadigan `name` bir xil bo'lishi mumkin. Mavjud kod tekshiruvi defisni qabul qilmaydi (`20261108000006_tolov.sql`, 6-qator).

### 2. `tolov-yaratish/handler.ts` dagi SAT bog'lanishlari

| Joy | Hozirgi qiymat yoki holat | 3-bosqichga ta'siri |
| --- | --- | --- |
| 1-qator, izoh | Funksiya SAT tarifi uchun deb yozilgan | Qavatga mos tavsif bilan yangilash |
| 120-qator, `description` | `Tayanch SAT ${p.plan_name}, ${p.period_days} days` | SAT'da shu matnni saqlab, tavsifni serverdan kelgan qavatga moslash |
| 121-qator, `returnUrl` | `${d.saytUrl}/uz/sat/hisob/tolov-natija/?tolov=...` | Ruxsat etilgan qavat yo'llari xaritasi kerak, hozir faqat SAT yo'li bor |
| 46–58-qatorlar, `YaratilganTolov` va `yaratilganmi` | RPC qaytargan `bolim` interfeysga olinmagan va tekshirilmaydi | RPC javobidagi `bolim` ni tekshirish va xarita uchun ishlatish |

Handler'da boshqa SAT literal topilmadi. `payment_create` ga faqat `p_user` va `p_plan_code` yuboriladi (103-qator). `plan_code` yoki eski `plan` qabul qilinadi, `bolim` tanadan olinmaydi (88-qator). `webhookUrl` umumiy `/functions/v1/inpay-webhook` manziliga boradi (122-qator).

`supabase/functions/tolov-yaratish/index.ts` pending to'lovni `user_id` va `plan_code` orqali qayta topadi. Hozir `plans.code` global yagona bo'lgani uchun kod qavatni ham aniqlaydi. `supabase/functions/tests/tolov_yaratish_test.ts` 168–169-qatorlarda SAT tavsifi va qaytish manzilining aynan shu qiymatlarini tekshiradi.

### 3. Webhook obuna uchun `bolim` ni to'lovdan oladi

1. `payment_create` `plans` qatorini `code` orqali oladi (`20261109000010_tolov_inpay.sql`, 34-qator).
2. `payments.bolim` ga `v_plan.bolim` yozadi va RPC javobida ham `bolim` qaytaradi (56–66-qatorlar).
3. `inpay-webhook/handler.ts` imzoni tekshiradi, so'ng `payment_apply_event` ni chaqiradi (45–64-qatorlar).
4. `payment_apply_event` `provider_order_id` orqali `payments` qatorini qulf bilan oladi (182–184-qatorlar). Uzaytirish qavat bo'yicha cheklanadi (215-qator), yangi obunaga `v_pay.bolim` yoziladi (220–222-qatorlar).

Demak, qavatning mavjud server zanjiri `plans.bolim → payments.bolim → subscriptions.bolim`. Obuna yaratishda tarif jadvali qayta o'qilmaydi, to'lov yaratilgandagi qavat ishlatiladi. `payment_create` va `payment_apply_event` faqat `service_role` uchun ochiq (264–270-qatorlar). `inpay-holat` va muvofiqlashtirish ham shu umumiy qo'llash oqimidan foydalanadi (`supabase/README.md`, 10-bo'lim).

### 4. inPAY API v2 da usulni oldindan tanlash parametri topilmadi

2026-11-21 kuni IP03 rasmiy sahifasi HTTP 200 bilan o'qildi. `POST /payments/` jadvali va so'rov misollarida Click yoki Payme'ni oldindan tanlash parametri **topilmadi**. Jadval maydonlari `amount`, `currency`, `description`, `return_url`, `webhook_url`, `metadata`, `customer`, `sub_merchant`, `application_fee`. Hujjat xaridorni `checkout_url` orqali inPAY sahifasiga yuborishni ko'rsatadi. [inPAY API v2, to'lov yaratish](https://inpay.uz/api/v2/#payment-create)

Sahifadagi boshqa `payment_method` parametrlari tasdiqlangan saqlangan karta identifikatorini (`pm_…`) oladi. `payme_app` avtomatik obuna yaratish bo'limida berilgan. Ularni bir martalik `/payments/` so'rovi uchun Click/Payme tanlash parametri sifatida qo'llash hujjatlashtirilmagan. inPAY kabinetida aynan qaysi usullar yoqilgani tekshirish kerak. [inPAY API v2](https://inpay.uz/api/v2/)

### Keyingi bosqichlar uchun xulosalar

- **3-bosqich.** `bolim` ustunini qo'shish talab qilinmaydi. Migratsiya uch jadvalning `bolim` check ro'yxatiga `ai-academy` qo'shishi kerak. Tarifdan to'lovga va to'lovdan obunaga mavjud qavat zanjiri saqlanadi. Handler RPC javobidagi qavatni tekshirishi, faqat SAT qaytish manzilini qo'llashi, qo'llab-quvvatlanmagan qavatni inPAY'ga so'rov yuborishdan oldin xato bilan rad etishi kerak. Yangi va qayta ishlatiladigan pending to'lov yo'llari testda qamraladi.
- **Kelajakdagi pullik qavatlar.** `private.current_plan` obunasiz foydalanuvchiga global `free` qatorini qaytaradi (`20261108000008_rpc.sql`, 18–39-qatorlar). Boshqa qavatning pullik tarifi ochilishidan oldin qavatga mos bepul tarif va kvota mantiqi tekshirish kerak.
- **4-bosqich.** `payments.raw` brauzerga yopiq, alohida `livemode` ustuni yo'q (`20261108000006_tolov.sql`, 115–120-qatorlar). Mavjud `payment_history(p_bolim)` faqat `test` belgisini qaytaradi va `livemode` yo'qligini ham `test=false` qiladi (`20261112000000_obuna_holati.sql`, 51–75-qatorlar). `test=false` filtri qat'iy `livemode=true` talabini bajarmaydi. Umumiy tarix uchun faqat jonli to'lovlarni serverda ajratadigan, egasini tekshiradigan RPC yoki cheklangan xavfsiz maydon kerak. Bu server ishi 4-bosqich PR'ining bog'liqligi sifatida ko'rsatiladi.
- **5-bosqich.** Alohida usul tugmalari uchun v2 parametri topilmadi. Ko'rinadigan usullar ro'yxatini muallif kabinetdan tasdiqlaydi. Tasdiq bo'lmasa `Secure payment via inPAY` matni qo'llanadi.

Migratsiya qo'shiladigan 3-bosqich PR'ida **qo'llash kerak** deb yoziladi. Push oldidan raqam to'qnashuvi `supabase migration list --remote` bilan, qo'llanadigan fayllar `supabase db push --remote --dry-run` bilan tekshiriladi. Ushbu 2-bosqichda baza buyruqlari va haqiqiy to'lov sinovlari bajarilmagan.
