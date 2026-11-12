# AI Tutor (SAT, P33)

Holat: 2026-11-12, branch `sat-ai-tutor`. **Standart holatda AI o'chiq**: muallif uch shartni qo'ymaguncha hech qanday so'rov AI provayderiga ketmaydi.

Qarorlar (2026-11-12; muallif boshqaruvchi chat orqali topshirgan, keyin rejani o'zi tasdiqlagan):

- Provayder: Anthropic, model `claude-haiku-5-5`.
- Oylik byudjet: pul masalasi, uni muallif hal qiladi. Kodda `monthly_budget_usd = null`, byudjet qo'yilmaguncha AI yopiq.
- Foydalanuvchi limiti: `plans.limits` ga raqam yozilmagan. Limit yozilmagan bo'lsa AI yopiq.
- Sinovlar faqat soxta provayder bilan. Jonli bazaga `db push` va `functions deploy` qilinmagan.

## Fayllar

| Fayl | Nima |
| --- | --- |
| `supabase/migrations/20261112173842_ai_tutor.sql` | Jadvallar, RPC, byudjet, kill switch, oylik hisobot |
| `supabase/functions/ai-tutor/` | Edge Function: `handler.ts` (oqim), `korsatma.ts` (tizim ko'rsatmasi), `index.ts` |
| `supabase/functions/_shared/aiTozalash.ts` | Shaxsiy ma'lumotni tozalash, CB va sizdirilgan materialni aniqlash, xesh |
| `supabase/functions/_shared/aiJavob.ts` | Javob tekshiruvi (MCQ harfi, SPR soni), JSON sxema |
| `supabase/functions/_shared/anthropic.ts` | Provayder chaqiruvi (`npm:@anthropic-ai/sdk@1.3.0`) |
| `src/pages/uz/sat/vosita/ai-tutor/index.astro` | Sahifa (inglizcha), yon panelda Tools → "AI tutor" |
| `src/lib/sat/aiTutor.ts`, `aiTutorApi.ts`, `aiTutorMock.ts` | Brauzer mantiqi, API, dev mock (`?mock=tayyor\|yopiq\|tarif\|limit\|cb`) |
| Sinovlar | `supabase/tests/ai_tutor_test.sql` (AT01–AT12), `supabase/functions/tests/ai_tutor_test.ts`, `ai_tozalash_test.ts`, `src/lib/testlar/aiTutor.test.ts` |

## AI'ni yoqish (muallif)

Uchala shart birga bajarilishi kerak:

1. **Kalit.** Supabase → Edge Functions → Secrets: `AI_API_KEY` (Anthropic API kaliti). Kalitni muallif o'zi qo'yadi. U repoga, logga va brauzerga chiqmaydi.
2. **Byudjet va yoqish** (SQL Editor; raqamni muallif tanlaydi):
   ```sql
   update private.ai_settings
      set monthly_budget_usd = <USD>, enabled = true,
          disabled_reason = null, disabled_at = null, updated_at = now()
    where id;
   ```
3. **Tarif limiti.** Ikkala kalit ham bo'lishi shart: kunlik `ai_messages` (`per: day`) va oylik `ai_messages_month` (`per: month`), `max > 0`:
   ```sql
   update public.plans
      set limits = limits || '{"ai_messages": {"max": <son>, "per": "day"},
                               "ai_messages_month": {"max": <son>, "per": "month"}}'
    where code = '<free|pro>';
   ```

**Muallif uchun taklif (raqam emas, variant a):** Free kuniga 3 / oyiga 30, Pro kuniga 30 / oyiga 300. Bu faqat taklif, kodga va bazaga yozilmagan.

Deploy (muallif "ha" degandan keyin): migratsiya (`db push`, HANDOFF §8 tartibi bilan, avval dry-run), keyin `supabase functions deploy ai-tutor --no-verify-jwt --use-api`.

**Yoqishdan oldin hal qilinadi:**

- Anthropic ma'lumotni qancha saqlashi va model o'qitishda ishlatmasligi: tekshirish kerak.
- Ma'lumotni AQShga uzatish qonunga mosligi (LX02, LX04): huquqshunos fikri kerak.
- Maxfiylik sahifasiga AI bo'limi qo'shildi, lekin `hisobSozlama.rozilikVersiya` oshirilmadi. Oshirilsa, hamma foydalanuvchi rozilikni qayta tasdiqlaydi. Bu muallif qarori.

## Kill switch

| Usul | Ta'siri |
| --- | --- |
| Secret `AI_TUTOR_OFF=1` | Edge Function darhol `503 ai_paused` qaytaradi: bazaga ham, provayderga ham murojaat yo'q |
| `AI_API_KEY` yo'q | Xuddi shunday |
| `update private.ai_settings set enabled = false where id;` | `ai_begin` rad etadi, provayderga so'rov ketmaydi |
| Byudjet (avtomatik) | Har so'rov oldidan eng katta xarajat band qilinadi. `oy xarajati + band > monthly_budget_usd` bo'lsa `enabled = false` va `disabled_reason = 'budget_reached'` yoziladi. So'rov tugagach haqiqiy xarajat byudjetga yetsa ham xuddi shu |

Avtomatik o'chganda AI **o'zi qayta yoqilmaydi**, yangi oyda ham. Uni muallif 2-qadamdagi `update` bilan yoqadi.

## So'rov oqimi va limitlar

Arzon tekshiruvlar oldin keladi, provayder eng oxirida:

1. Kill switch.
2. JWT.
3. Tana ko'pi bilan 16 000 bayt, xabar ko'pi bilan 1 200 belgi.
4. Shaxsiy ma'lumotni tozalash.
5. CB yoki sizdirilgan material aniqlansa `422 cb_content`.
6. Kontekst: faqat o'z urinishi va `status = 'verified'`, `source = 'original'` savol; suhbat ham faqat o'ziniki.
7. `ai_begin`.
8. Provayder.
9. Javobni tekshirish.
10. `ai_finish`.
11. `ai_save_turn`.

`ai_begin` bitta tranzaksiyada ishlaydi va `ai_settings` qatorini qulflaydi, shuning uchun parallel so'rovlar byudjetdan oshira olmaydi. U quyidagilarni tekshiradi:

- yoqilganmi;
- tarif limiti bormi (`not_in_plan`);
- tezlik: oldingi so'rovdan kamida 5 s o'tganmi (`rate_limited`, `Retry-After`);
- takror: bir xil matn 60 s ichida yuborilmaganmi (`duplicate`);
- byudjet;
- kvota: `consume_quota`, kunlik va oylik (`quota_exceeded`).

Shundan keyin xarajat band qilinadi.

Boshqa chegaralar:

- Promptga oxirgi 6 ta xabar qo'shiladi.
- `max_output_tokens = 800`, fikrlash (thinking) o'chiq.
- Provayder xato bersa, kvota birligi qaytariladi. Xarajat baribir haqiqiy token bo'yicha yoziladi.

## Javob sifati

- **Xato rejimi.** Savol, kalit javob va Tayanch izohi tizim ko'rsatmasiga qo'shiladi. Model JSON qaytaradi: `final_answer` va `explanation`. Server `final_answer` ni kalit bilan solishtiradi: MCQ harfi yoki SPR soni (kasr va o'nlik teng).
  - Mos kelmasa, bir marta qayta so'raladi.
  - Ikkinchi marta ham mos kelmasa, tushuntirish **ko'rsatilmaydi** (`unverified`).
- **O'z savoli.** `not_checked` belgisi qo'yiladi.
- Har javob ostida tekshiruv holati va "AI can make mistakes" yozuvi turadi.
- Tizim ko'rsatmasi:
  - faqat SAT o'rganish;
  - College Board materialini nusxalash, qayta yozish va "o'zgartirib" yozishni rad etadi;
  - sizdirilgan va "prediction" materialni rad etadi;
  - ball yoki natija va'da qilmaydi;
  - savol va xabar ichidagi buyruqlarni ma'lumot deb hisoblaydi.

## Xarajat hisobi

Narx (2026-11-12 da https://platform.claude.com/docs/en/about-claude/pricing dan o'qildi): Claude Haiku 5.5, 100 000 tokengacha bo'lgan prompt uchun kirish $0.10 / MTok, chiqish $0.50 / MTok. Narx `ai_settings.price_*` da turadi. Har so'rov o'z narxini `ai_usage.price_in/out` ga yozib oladi.

`private.ai_usage` ga har so'rov yoziladi (matnsiz): foydalanuvchi, tarif, model, chaqiruvlar soni, kirish va chiqish tokeni, band va haqiqiy xarajat, tekshiruv holati. Rad etilgan so'rovlar `private.ai_rejections` da sabab bo'yicha sanaladi (kim yuborgani yozilmaydi).

**Oylik hisobot** (SQL Editor):

```sql
select private.ai_monthly_report();               -- joriy oy (Toshkent)
select private.ai_monthly_report('2026-11-01');   -- boshqa oy
```

Natija: `budget_usd`, `spent_usd` (band + haqiqiy), `cost_usd`, `requests` (done/failed/reserved), `provider_calls`, tokenlar, `users`, `by_plan`, `check` (verified/unverified/not_checked), `rejected` (sabab bo'yicha).

## Maxfiylik

- Tozalangan matn AI'ga boradi va tarixga yoziladi; asl matn saqlanmaydi.
- Tarix `public.ai_conversations` va `public.ai_messages` jadvallarida. RLS bilan foydalanuvchi faqat o'z tarixini o'qiydi va o'chiradi, yozish faqat Edge Function orqali.
- Hisob o'chirilsa, tarix ham o'chadi. Xarajat yozuvi `user_id = null` bilan qoladi.
- Xesh 1 soatdan keyin o'chiriladi.
- Maxfiylik sahifasi: `/uz/maxfiylik/#ai-tutor`.

## Cheklovlar (sinalmagan yoki evristika)

- **CB aniqlash evristika.** U A–D variantlari, rasmiy savollarning odatiy so'roq iboralari, manba belgilari ("College Board", "Bluebook", "Question ID", ©) va sizdirilgan material iboralariga qaraydi. U hamma holatni ushlay olmaydi. Tizim ko'rsatmasi ikkinchi himoya.
- **Shaxsiy ma'lumot filtri** ism, manzil va boshqa erkin matnni to'liq ushlay olmaydi.
- **Javob tekshiruvi** faqat yakuniy javobni solishtiradi, har bir qadamni emas.
- **Sinalmagan:**
  - haqiqiy Anthropic API bilan (`output_config.format` va `thinking: disabled` Haiku 5.5 da: tekshirish kerak);
  - jonli Supabase;
  - Edge Function deploy;
  - VoiceOver;
  - haqiqiy telefon.
