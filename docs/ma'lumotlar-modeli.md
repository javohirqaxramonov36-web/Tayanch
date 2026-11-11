# Ma'lumotlar modeli (Supabase, P02)

Sxema: `supabase/migrations/`. Qarorlar: `docs/qarorlar/001-hisob-tolov-server.md`. Qo'llash: `supabase/README.md`.

Asosiy qoida: **mijoz to'g'ri javobni savol bilan birga hech qachon olmaydi.** `questions` jadvaliga mijozdan to'g'ridan-to'g'ri kirish yo'q; savollar faqat RPC orqali, `correct` va `explanation` siz beriladi. To'g'ri javob va tushuntirish faqat `submit_answer` javobida, javob yozilgandan keyin keladi.

## Sxemalar

- `public`: jadvallar va mijoz chaqiradigan RPC'lar (PostgREST API orqali).
- `private`: ichki funksiyalar (kvota, filtr, SPR normallash) va `spr_test_cases`. API'ga chiqmaydi, `anon`/`authenticated` da huquq yo'q.
- `auth`, `storage`: Supabase'niki. Biz faqat `auth.users` ga trigger va `storage.objects` ga policy qo'shamiz.

## Jadvallar

```
auth.users ─(trigger handle_new_user)─> profiles (1:1)
     │
     ├── practice_sessions ──< session_questions >── questions
     │        │                                         │
     │        └──< attempts >───────────────────────────┤
     ├── review_queue >─────────────────────────────────┤   (Leitner qutilari 1–5)
     ├── bookmarks >────────────────────────────────────┤
     ├── reports >──────────────────────────────────────┘
     ├── official_tests ──< official_mistakes
     ├── study_plans ──< plan_tasks
     ├── user_state           (kalit tayanch:*, qiymat jsonb)
     ├── vocab_progress >── vocab_words
     ├── subscriptions >── plans <── payments ── payment_events (provider_order_id)
     ├── usage_counters       (user_id, key, period_start)
     ├── feedback
     └── events               (P25)
audit_log                     (admin amallari, service role)
storage: question-figures     (yopiq bucket, imzolangan URL)
```

`──<` bittaga ko'p, `>──` ko'pdan bittaga.

| Jadval | Nima | Mijoz (authenticated) | Kim yozadi |
| --- | --- | --- | --- |
| `profiles` | ism, taxallus, davlat, maqsad ball, imtihon sanasi, rozilik, til | o'zini o'qiydi; ruxsat etilgan ustunlarni yangilaydi | trigger yaratadi; `consent_at` ni trigger qo'yadi |
| `questions` | savol banki (`draft`/`verified`/`hidden`, `verified_by`, `version`) | **hech narsa** | service role |
| `practice_sessions` | sessiya (`practice`, `timed`, `daily`, `review`) | o'zini o'qiydi | RPC |
| `session_questions` | sessiyaga berilgan savollar | o'zini o'qiydi | RPC |
| `attempts` | javob, `is_correct`, vaqt, `flagged`, savol versiyasi | o'zini o'qiydi; faqat `flagged` ni o'zgartiradi | RPC (`submit_answer`) |
| `bookmarks` | xatcho'p | o'zini o'qiydi, qo'shadi, o'chiradi | mijoz |
| `review_queue` | takrorlash: `box`, `next_due`, `first_missed_at`, `reason_tag`, `note` | o'zini o'qiydi; `note`, `reason_tag` ni o'zgartiradi; o'chiradi | RPC |
| `official_tests`, `official_mistakes` | rasmiy test natijasi va xatolari (savol matnisiz) | o'zini to'liq | mijoz |
| `study_plans`, `plan_tasks` | reja va vazifalar | o'zini to'liq (vazifa faqat o'z rejasiga) | mijoz |
| `user_state` | `tayanch:*` kalitlarining server nusxasi | o'zini to'liq | mijoz |
| `vocab_words` | lug'at so'zlari | tasdiqlanganini o'qiydi (anon ham) | service role |
| `vocab_progress` | so'z holati (`new`, `learning`, `known`) | o'zini to'liq | mijoz |
| `plans` | tarif: narx, muddat, `limits`, `features` | faolini o'qiydi (anon ham) | service role |
| `subscriptions` | obuna (`bolim`, `status`, muddat, `source`) | o'zini o'qiydi | service role (webhook, admin) |
| `payments` | to'lov (`provider_order_id` unique) | o'zini o'qiydi, `raw` siz | service role |
| `payment_events` | webhook jurnali (`provider, event_id` unique) | **hech narsa** | service role |
| `usage_counters` | kvota hisoblagichi | o'zini o'qiydi | RPC |
| `daily_picks` | kun savoli tanlovi (`day` → `question_id`, hamma uchun bitta) | **hech narsa** | RPC (`daily_pick`) |
| `reports` | savoldagi xato haqida xabar | o'zini o'qiydi, qo'shadi | mijoz |
| `feedback` | fikr-mulohaza | o'zini o'qiydi, qo'shadi | mijoz |
| `events` | analitika hodisasi (P25) | faqat qo'shadi | mijoz |
| `audit_log` | admin amallari | **hech narsa** | admin funksiyalari |

`anon` (hisobsiz): faqat faol `plans` va tasdiqlangan `vocab_words` ni o'qiydi. RPC faqat kun savoli uchun (`daily_question_public`, `check_daily_answer`, hech narsa yozmaydi); hisobsiz progress brauzerda (`tayanch:*`) qoladi.

## RPC'lar

Hammasi `security definer`, `search_path = ''`, execute faqat `authenticated` da (admin funksiyalari faqat `service_role` da).

| Funksiya | Qaytaradi | Kvota |
| --- | --- | --- |
| `question_counts(filters)` | mavzu/qiyinlik bo'yicha soni, javob berilgani | sarflamaydi |
| `start_session(filters, volume, mode)` | sessiya + savollar (javobsiz) | `sessions` +1, `questions` +n |
| `submit_answer(session, question, answer, time_ms)` | `is_correct`, `correct`, `explanation`, `already_answered` | `answers` +1 |
| `daily_question()` | kunning savoli (kuniga bitta `daily` sessiya), natija, streak | **sarflamaydi** (P10) |
| `daily_question_public()` | kunning savoli javobsiz (anon ham) | sarflamaydi, hech narsa yozmaydi |
| `check_daily_answer(question, answer)` | faqat bugungi savol: `is_correct`, `correct`, `explanation` (anon ham) | sarflamaydi, hech narsa yozmaydi |
| `start_review_session(limit)` | muddati kelgan takrorlash savollari | `review_sessions` +1, `questions` +n |
| `usage_status()` | tarif, cheklovlar, bugungi sarf | sarflamaydi |
| `analytics_summary()` | analitika paneli (P14): jami, ko'nikma va bo'lim bo'yicha aniqlik, 90 kunlik faollik, streak, xato sababi teglari; `analytics_extended` bayrog'i bo'lsa qiyinlik bo'yicha aniqlik va median vaqt | sarflamaydi |
| `can_read_question_figure(name)` | Storage policy yordamchisi | sarflamaydi |
| `admin_grant_plan(...)`, `admin_hide_question(...)` | yangi obuna / yashirilgan savol id, `audit_log` | service role |

Filtrlar (`filters`, jsonb): `section` (`math`/`rw`), `domains[]`, `skills[]`, `difficulties[]` (1–5), `unanswered_only`, `incorrect_only`, `bookmarked_only`. Faqat `verified` savollar.

Xatolar: `not_authenticated` (42501), `invalid_mode` / `invalid_volume` / `invalid_answer` / `invalid_filters` (22023), `session_not_found` / `question_not_in_session` / `question_unavailable` (P0002), `quota_exceeded` (P0001, `detail` da kalit va chegara).

## Oqimlar

### Ro'yxatdan o'tish

```
Brauzer ── signUp / signInWithOAuth(google) ──> Supabase Auth ── insert auth.users
                                                         └─ trigger handle_new_user ─> profiles (display_name: full_name | name)
```

### Mashq

```
Brauzer ── rpc start_session(filters, volume, mode) ──> filtered_questions (verified)
                                                        ├─ practice_sessions + session_questions
                                                        ├─ consume_quota (oshsa: quota_exceeded, hammasi qaytariladi)
                                                        └─> savollar: stem, passage, options{key,text}, figure  (correct YO'Q)
Brauzer ── rpc submit_answer(session, question, answer) ─> sessiya egasi? savol shu sessiyadami? verified?
                                                        ├─ check_answer (mcq: harf; spr: spr_equal)
                                                        ├─ attempts (bitta urinish)
                                                        ├─ review_queue (xato → 1-quti, ertaga)
                                                        ├─ consume_quota('answers')
                                                        └─> is_correct, correct, explanation
```

### Takrorlash (Leitner, `src/lib/takrorlash.ts` bilan bir xil)

```
xato javob (har qanday sessiyada) → box 1, next_due = bugun + 1
start_review_session → box < 5 va next_due <= bugun (Toshkent)
review sessiyada to'g'ri: 1→2 (+3 kun), 2→3 (+7), 3→4 (+14), 4→5 (o'zlashtirildi)
```

Oraliqlar Tayanch tanlovi, rasmiy qoida emas.

### To'lov (inPAY API v2, IP03; migratsiyalar 0010, 0011, Edge Function'lar `tolov-yaratish`, `inpay-webhook`, `inpay-holat`, `inpay-muvofiqlash`)

```
Brauzer ── tolov-yaratish (JWT, {"plan"}) ─> payment_create ─> payments (created, provider_order_id = 'tayanch:<id>')
                                          ─> inPAY POST /payments/ (Idempotency-Key = payments.id, metadata.payment_id)
                                          ─> payment_set_invoice ─> payments (pending, provider_order_id = inPAY id) | (failed)
inPAY ── inpay-webhook: imzo (X-Inpay-Signature, 5 daqiqa) ─> payment_apply_event, bitta tranzaksiya:
           payment_events (provider, event_id unique: takror = 'duplicate')
           └─ payment.succeeded: summa, UZS, livemode, metadata mos ─> payments (paid) ─> subscriptions (payment_id unique) ─> audit_log
           └─ payment.failed / payment.canceled ─> payments (failed / canceled); boshqa hodisa ─> 'ignored'
inpay-holat (foydalanuvchi) / inpay-muvofiqlash (Cron, 15 daqiqa–48 soat pending) ─> inPAY GET /payments/{id}
           ─> yakuniy bo'lsa o'sha payment_apply_event (id 'poll_<inpay id>_<status>')
```

`payment_events.payload` trigger bilan tozalanadi (0011): faqat ruxsat etilgan maydonlar, qolganlarining faqat nomi `dropped` da.

Holatlar: `created → pending → paid | failed | canceled`; `failed`/`canceled` dan keyin `succeeded` kelsa `paid`, `paid` yakuniy. Xato hodisa (`unknown_order`, `amount_mismatch`, `livemode_mismatch`, `metadata_mismatch`) `payment_events.error` bilan saqlanadi, obuna bermaydi. Obuna muddati `payments.raw.tayanch.period_days` (to'lov paytidagi tarif), shu tarifda faol obuna bo'lsa uning oxiridan boshlanadi.

Brauzer to'lovni "tasdiqlay" olmaydi: `payments`, `subscriptions`, `payment_events` ga mijozda yozish huquqi yo'q, `payment_*` funksiyalarini faqat service_role chaqiradi. Batafsil: `supabase/README.md`, 10-bo'lim.

### Kun savoli (P10, migratsiya `20261111220000_kun_savoli.sql`)

```
daily_pick(bugun, Toshkent) ─ daily_picks da bormi va yaroqlimi (verified, rasmsiz)? ─> o'sha
                            └ yo'q: bo'lim = juft kun 'rw' / toq kun 'math' (2026-01-01 = 0-kun), shu bo'lim avval,
                                    avval berilmagani, keyin eng uzoq berilgani, md5(external_id || sana) ─> daily_picks
Mehmon ── daily_question_public ─> savol (javobsiz), next_at
       ── check_daily_answer(question, answer) ─> faqat bugungi savol: is_correct, correct, explanation (yozuv yo'q)
Kirgan ── daily_question ─> 'daily' sessiya (kuniga bitta) + result (javob berilgan bo'lsa) + streak
       ── submit_answer(session, question, answer) ─> attempts, review_queue; kvota YO'Q; kun o'tsa 'daily_expired'
```

- **Sana chegarasi**: Asia/Tashkent (UTC+5, yozgi vaqt yo'q). Savol Toshkent vaqti 00:00 da (UTC 19:00) hamma uchun bir vaqtda almashadi. Boshqa mintaqada ham shu chegara: masalan Nyu-Yorkda (UTC−5) 14:00 da, Londonda (UTC+0) 19:00 da. Sahifa `next_at` ni foydalanuvchining mahalliy vaqtida ko'rsatadi.
- **Streak**: faol kun = kun savoliga javob berilgan Toshkent kuni (to'g'ri yoki xato farqsiz). Bugun javob berilmagan bo'lsa kechagacha bo'lgan ketma-ketlik ko'rsatiladi (kun tugaguncha uzilmaydi). Hisob `practice_sessions` (`daily`) va `attempts` dan, alohida jadval yo'q.
- **Kvota**: kun savoli hech qanday kalitni sarflamaydi (P19 bilan kelishilgan qoida). `daily` kaliti `usage_counters` da qoladi, lekin oshmaydi.
- **Rasmli savol** kun savoli bo'lmaydi: mehmon `question-figures` dan rasm ocha olmaydi.
- **Sinov**: `supabase/tests/kun_savoli_test.sql` (KS01–KS13, sana `private.today_tashkent` almashtirilib simulyatsiya qilinadi), `npm run db:tekshir`.

### Kvota

```
current_plan(user, 'sat') = faol obuna (bolim = 'sat', starts_at <= now < ends_at) yoki 'free'
plans.limits = {"<kalit>": {"max": n, "per": "day" | "month"}}; kalit yo'q = cheklov yo'q
usage_counters(user, kalit, davr boshi) ga shartli UPDATE (count + n <= max): parallel so'rovda ham oshib ketmaydi
```

Raqamlar P19 da (hozir `limits = {}`).

### Savol rasmi

```
figure.path = "<bucket ichidagi yo'l>"  →  bucket question-figures (yopiq)
Brauzer ── storage.createSignedUrl(path) ──> storage.objects SELECT policy:
            can_read_question_figure(name) = rasm shu foydalanuvchiga berilgan sessiyadagi verified savolniki
```

## SPR (talaba kiritadigan javob) normallash

`private.spr_parse` javobni aniq kasr `{surat, maxraj}` ga aylantiradi, `private.spr_equal` `correct.accepted` dagi har qiymat bilan `a·d = c·b` orqali solishtiradi.

- Qabul: `.5` = `0.5` = `1/2` = `2/4`; `5.` = `5`; `007` = `7`; chetdagi bo'shliq; minusdan keyingi va `/` atrofidagi bo'shliq; unicode minus `−`, `–`, `—`.
- Rad: `1 1/2` (aralash son), `1,5` (vergul), `+2`, `1/0`, `--3`, bo'sh javob.
- Yaxlitlash avtomatik emas: `2/3` uchun `.6666`, `.6667` kabi qiymatlarni muallif `accepted` ro'yxatiga yozadi.

Sinov holatlari: `private.spr_test_cases`, natija `select * from private.run_spr_tests();` (bo'sh = hammasi o'tdi).
