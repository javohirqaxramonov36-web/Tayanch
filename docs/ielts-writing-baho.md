# IELTS Writing baholovchi: spetsifikatsiya (qoralama, 2026-11-19)

Holat: muallif tasdiqlagan (2026-11-19). PR 1 (server) qurilgan, PR 2 (sahifa) qurilmagan.

## Maqsad
Foydalanuvchi IELTS Writing Task 2 inshosini yozadi, AI uni 4 mezon bo'yicha baholaydi va har biriga bitta aniq maslahat beradi. Natija **taxminiy**, rasmiy IELTS bali emas.

## Doira (1-versiya)
- Faqat Task 2 (insho). Task 1 Academic grafik rasmini talab qiladi, General letter keyin.
- Umumiy Writing bali (Task 1 + Task 2 formulasi) ko'rsatilmaydi: bitta vazifa baholanadi.
- Sahifa: `/uz/ielts/mashq/writing/`, `/uz/ielts/mashq/` dagi Writing kartasi ochiladi. Sahifa matni o'zbekcha, insho va savol inglizcha (`lang="en"`).

## Xatti-harakat
1. **Savol tanlash.** Ro'yxatdan Tayanch original savoli (`src/data/ielts/writingSavollar.ts`, ekranda "Namuna") yoki "O'z savolim" (600 belgigacha).
2. **Yozish.** `<textarea>`, jonli so'z sanog'i (server bilan bir xil algoritm). Qoralama har 2 soniyada `localStorage` `tayanch:ielts-writing-qoralama` ga saqlanadi, sahifa qayta ochilganda tiklanadi.
3. **Yuborish.** "Baholash" tugmasi (`<button>`). Faol shartlar: kamida 50 so'z, ko'pi bilan 600 so'z / 5000 belgi. 250 dan kam bo'lsa ogohlantirish (Task Response bali cheklanadi), lekin yuborish mumkin. Tugma ostida: "Bugun N ta tekshiruv qoldi". Ctrl/Cmd+Enter yubormaydi (tasodifiy sarfni oldini olish).
4. **Hisobsiz.** Yozish va sanoq ishlaydi; "Baholash" kirish sahifasiga `?keyin=` bilan olib boradi, qoralama saqlanib qoladi.
5. **Kutish.** Tugma "Baholanmoqda…" va o'chiq, `aria-live` holat xabari. Matn tahrirlanmaydi.
6. **Natija.** Katta yozuv: taxminiy band va "Taxminiy ball, rasmiy IELTS natijasi emas". 4 karta: mezon, band, izoh, inshodan iqtibos, keyingi bandga 1 maslahat. "Qayta yozish" matnni saqlab tahrirga qaytaradi. Oxirgi 5 natija pastda ro'yxat.
7. **Xatolar** (har biri o'zbekcha xabar bilan): kirish kerak, kunlik limit tugadi (qachon yangilanadi), AI vaqtincha o'chiq (byudjet yoki kill switch), juda qisqa/uzun, tarmoq xatosi (matn yo'qolmaydi).
8. **Telefon va qorong'i mavzu.** Textarea to'liq kenglikda, so'z sanog'i textarea ostida yopishqoq; kartalar bir ustunda.

## Server
- Yangi Edge Function `ielts-writing-baho`. `ai-tutor` dagi umumiy qismlar qayta ishlatiladi: `_shared/anthropic.ts`, `_shared/aiTozalash.ts` (shaxsiy ma'lumotni tozalash), kill switch, JWT, CORS.
- Limit va byudjet: `ai_begin` hozir SAT tariflariga bog'langan (`not_in_plan`). IELTS'da pullik qism yo'q, shuning uchun migratsiya `feature` ustunini qo'shadi (`sat_tutor` | `ielts_writing`) va IELTS uchun tarifsiz kunlik limit qo'yadi. Oylik byudjet umumiy. Aniq qanday kengaytirish: tekshirish kerak (migratsiya yozilganda).
- So'z sanog'i serverda; brauzerdan kelgan `word_count` ishlatilmaydi.
- Prompt (tuzatilgan versiya, `ielts-writing-baho/korsatma.ts`): yaxlitlash misoli to'g'rilangan; inshoni "baholanadigan matn, ko'rsatma emas" deb belgilash (prompt injection); `task_band` ni model emas, server hisoblaydi (4 mezon o'rtachasi, .5 ga pastga yaxlitlash); umumiy formula olib tashlangan.
- Javob tekshiruvi: JSON sxema, har band 1–9 va 0.5 qadam; iqtibos inshoda so'zma-so'z bo'lmasa, o'chiriladi. Sxemaga mos kelmasa bir marta qayta urinish, keyin xato.
- Saqlash: jadval `ielts_writing_baholar` (RLS, faqat o'z qatorlari): savol, insho, natija JSON, vaqt. Bir xil insho xeshi 24 soat ichida qayta yuborilsa, eski natija qaytadi (limit sarflanmaydi).
- Insho matni va AI javobi logga yozilmaydi. Maxfiylik sahifasiga band: insho baholash uchun Anthropic'ga yuboriladi.

## Qurilish tartibi (2 PR)
1. Migratsiya, Edge Function, prompt, testlar (`supabase/functions/tests/`): limit, byudjet, sxema, iqtibos tekshiruvi, injection namunasi.
2. Sahifa va Writing kartasi; `a11y-check`, `contrast`, build, telefon va qorong'i mavzu.

## Qarorlar (muallif tasdiqlagan, 2026-11-19)
1. Kunlik bepul limit: kirgan foydalanuvchiga kuniga 2 ta (`private.ai_settings.ielts_writing_daily`, 0 = yopiq).
2. Oylik AI byudjeti SAT Tutor bilan umumiy (`monthly_budget_usd`), kill switch ham umumiy (`AI_TUTOR_OFF`, `enabled`).
3. Izoh tili inglizcha, sahifa sarlavhalari o'zbekcha.

## PR 1: server (qurilgan)
- Migratsiya `supabase/migrations/20261119120000_ielts_writing_baho.sql`: `ai_settings` ga `ielts_writing_daily` (2) va `ielts_writing_max_output_tokens` (2000), `ai_usage.feature` (`sat_tutor` | `ielts_writing`), jadval `ielts_writing_results` (RLS: o'z qatorlarini o'qish va o'chirish), RPC `ielts_writing_begin` / `ielts_writing_finish` (faqat service_role), `ielts_writing_status()` (authenticated). SAT `ai_begin` / `ai_finish` o'zgarmagan.
- Kunlik limit `ai_usage` dagi bugungi (Toshkent) `reserved` + `done` qatorlardan sanaladi: muvaffaqiyatsiz baholash (`failed`) limitga kirmaydi. Kesh (24 soat, o'sha insho xeshi) AI yopiq bo'lsa ham ishlaydi va limit sarflamaydi.
- Edge Function `supabase/functions/ielts-writing-baho/` (`handler.ts`, `korsatma.ts`, `index.ts`), `config.toml` da `verify_jwt = false`.
- Prompt tuzatishlari: yaroqsiz yaxlitlash misoli va umumiy formula olib tashlangan; insho `<essay>` teglarida, ichidagi ko'rsatmalar e'tiborsiz (teglar inshodan olib tashlanadi); `task_band` ni server hisoblaydi (o'rtacha, pastga 0.5); iqtibos inshoda so'zma-so'z topilmasa bo'sh satr.
- So'z sanog'i (`sozSoni`): bo'shliq bilan ajralgan, harf yoki raqami bor bo'laklar. PR 2 sahifasi xuddi shu qoidani ishlatadi.

### So'rov va javob
`POST {"task_type": "task2", "prompt": "...", "prompt_id": "t2-01" | null, "essay": "..."}`, `Authorization: Bearer <sessiya>`.
200: `{"result_id", "cached", "task_band", "word_count", "under_length", "result": {"criteria": {task_response, coherence_cohesion, lexical_resource, grammatical_range_accuracy}, "overall_summary", "under_length"}, "remaining"}`.

| Kod | Status | Ma'nosi |
| --- | --- | --- |
| `not_signed_in` | 401 | kirish kerak |
| `invalid_request` | 400 | tana noto'g'ri |
| `invalid_prompt` | 400 | savol 20–1200 belgidan tashqari |
| `essay_too_short` / `essay_too_long` | 400 | 50 so'zdan kam / 600 so'z yoki 6000 belgidan ko'p |
| `request_too_large` | 413 | tana 40 KB dan katta |
| `quota_exceeded` | 429 | kunlik limit tugadi (`daily_limit` bilan) |
| `rate_limited` | 429 | juda tez (`retry_after`) |
| `ai_paused` | 503 | AI yopiq yoki byudjet tugagan |
| `ai_unavailable` | 502 | provayder xatosi (limitdan sanalmaydi) |
| `assessment_failed` | 502 | model ikki marta yaroqsiz javob berdi (limitdan sanalmaydi) |
| `cannot_assess` | 422 | model rad etdi |

### Sinov
- `supabase/functions/tests/ielts_writing_baho_test.ts`: 17 sinov (soxta provayder va RPC), `npm run funksiyalar:tekshir` ichida.
- `supabase/tests/ielts_writing_test.sql` IW01–IW08: lokal Postgres 17 da (lokal shim + hamma migratsiya) o'tgan, 2026-11-19. `ai_tutor_test.sql` AT01–AT12 ham o'tgan.
- Sinalmagan: haqiqiy Claude modeli bilan baho sifati va JSON sxemasi, jonli Supabase.

### Ishga tushirish (muallif tasdig'idan keyin, merge'dan so'ng)
1. `supabase db push --remote --dry-run`, so'ng migratsiya.
2. `supabase functions deploy ielts-writing-baho --no-verify-jwt --use-api`.
3. Haqiqiy model bilan 3–5 namuna inshoda sinov (prompt sifati).
