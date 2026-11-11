# Xato daftari: takrorlash qoidalari (SAT, P09)

Sahifa: `/uz/sat/vosita/takrorlash/` (manzil PR #22 dagidek). Matn inglizcha.

## Manbalar

| Manba | Qayerda saqlanadi | Kim yozadi |
| --- | --- | --- |
| Dars xatolari (8 ta dars, id `hajm-1` kabi) | Brauzer: `tayanch:sat-xato-daftari` (darslar), `tayanch:sat-takrorlash` (qutilar), `tayanch:sat-xato-sabab` (sabab va izoh) | `darsSaqlash.javobniYoz`, `takrorlash.ts`, `xatoSabab.ts` |
| Savol banki xatolari (`questions.id`, uuid) | Supabase `review_queue` (RLS) | `submit_answer`, `add_to_review` (server) |
| Saqlangan savollar | Supabase `bookmarks` (RLS) | Sessiyadagi "Save question" va shu sahifa |

Hisobsiz holatda faqat dars xatolari ko'rinadi (avvalgidek). Hisob bilan bank qatorlari `review_overview()` dan qo'shiladi.
Dars kalitlari hisobga P04 adapteri (PR #59, `user_state`) orqali sinxronlanadi; `tayanch:sat-xato-sabab` u merge bo'lgach
uning kalitlar ro'yxatiga (`holatBirlashtir.ts`) qo'shilishi kerak.

## Leitner qoidasi (o'zgarmagan)

- Xato javob → 1-quti, keyingi takrorlash **ertaga** (dars: `BIRINCHI_ORALIQ`; server: `today + 1`).
- Takrorlashda to'g'ri javob → keyingi quti: 1→2 **+3 kun**, 2→3 **+7**, 3→4 **+14**.
- 4-qutida to'g'ri javob → **5-quti = Mastered**. Ya'ni xatodan keyin ketma-ket 4 ta to'g'ri takrorlash
  (ertaga, so'ng 3, 7, 14 kundan keyin).
- Takrorlashda yoki darsda/oddiy sessiyada yana xato → 1-qutiga qaytadi (mastered bo'lsa ham).
- Bank savollarida qutini faqat server o'zgartiradi (`submit_answer`, faqat `mode = 'review'` sessiyada to'g'ri javob
  qutini oshiradi); sana `private.today_tashkent()` bo'yicha. Dars savollarida brauzer (`takrorlash.ts`, Toshkent sanasi).
- Oraliqlar Tayanch tanlovi, rasmiy tavsiya emas.

Sinov: `src/lib/testlar/takrorlash.test.ts` (regressiya), `supabase/tests/xato_daftari_test.sql` X06 (server oqimi).

## Ro'yxatlar

| Tab | Shart |
| --- | --- |
| Due today | 1–4-quti va `keyingi <= bugun` |
| All mistakes | 1–4-quti (bugun va keyinroq) |
| Saved | `bookmarks` da bor (faqat bank savollari) |
| Mastered | 5-quti |

Tab URL'da `?tab=all|saved|mastered` (standart Due today). Sof mantiq: `src/lib/sat/xatoDaftari.ts`.

## Sabab tegi va izoh ("Why I missed it")

Teglar: `careless`, `concept_gap`, `time_pressure`, `misread`, `other` (P08 sessiya natijasida ham shu 5 tasi).
Bazada `review_queue_reason_tag_kalit` CHECK; migratsiya ro'yxatda yo'q eski tegni `other` ga o'tkazadi.
Izoh 1000 belgigacha (`review_queue.note`; darsda `tayanch:sat-xato-sabab`). Teg bo'yicha filtr va sanoq
(`tegSonlari`) P14 analitikaga manba.

## Savol matni

Ro'yxatda faqat qisqa ko'rinish (90 belgigacha; bank: `private.savol_qisqa`, R&W da parcha boshi). "Show question"
to'liq matn va variantlarni ochadi, **javob va tushuntirish ko'rsatilmaydi** (`review_preview` ularni qaytarmaydi;
faqat foydalanuvchining navbatida yoki saqlanganlarida bor savol uchun, kvota sarflamaydi).

## Review now

- "Review lessons (n)": sahifadagi dars sessiyasi (PR #22, o'zgarmagan).
- "Review practice questions (n)": `start_review_session()` → P08 sessiya sahifasi `?id=`; faqat due savollar,
  kvota `review_sessions` va `questions` sarflanadi.

## Dev mock

`?mock=toliq|bosh|xato|kvota` (`&tozala=1` holatni tiklaydi), faqat `astro dev`. Saqlanganlar sessiya mock'i
(`?mock=oddiy`) bilan umumiy.
