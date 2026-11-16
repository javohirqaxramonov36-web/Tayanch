# Mock imtihon (P30)

Holat: 2026-11-13, branch `sat-mock-imtihon`. Sahifalar: `/uz/sat/mashq/mock/` (kirish, yon panelda "Practice" → "Mock test") va `/uz/sat/mashq/mock/imtihon/?id=<attempt_id>` (imtihon ekrani, `SatFokus`).

Mock faqat muallifning original, tasdiqlangan (`status = 'verified'`) savollaridan yig'iladi. College Board PDF testlari, savollari va ball jadvallari ishlatilmaydi (`docs/kontent-siyosati.md`).

## Tuzilma (rasmiy manbalar, 2026-11-12 da tekshirildi)

| Qism | Savol | Vaqt | Manba |
| --- | --- | --- | --- |
| Reading and Writing · 1-modul | 27 | 32 daqiqa | CB03, CB41 |
| Reading and Writing · 2-modul | 27 | 32 daqiqa | CB03, CB41 |
| Tanaffus | — | 10 daqiqa | CB03 |
| Math · 1-modul | 22 | 35 daqiqa | CB03, CB42 |
| Math · 2-modul | 22 | 35 daqiqa | CB03, CB42 |

- Rasmiy imtihonda har modulda 2 ta pretest savol ballga kirmaydi (CB41, CB42). Tayanch mockida pretest yo'q: 98 savolning hammasi hisoblanadi.
- Adaptiv emas: 2-modul ham 1-modul kabi qiyinligi aralash (Tayanch qarori). Rasmiy imtihonda 2-modul qiyinligi 1-modul natijasiga bog'liq (CB03).
- Modul ichidagi sohalar (rasmiy ulushdan yaxlitlangan, Tayanch qarori; CB41, CB42, CB43):
  - R&W 27 = Craft and Structure 8, Information and Ideas 7, Standard English Conventions 7, Expression of Ideas 5.
  - Math 22 = Algebra 8, Advanced Math 8, Problem-Solving and Data Analysis 3, Geometry and Trigonometry 3.
- Tartib (Tayanch tartibi, rasmiy tartib da'vo qilinmaydi): R&W modulida savollar soha bo'yicha guruhlangan, soha ichida qiyinlik o'sib boradi; Math modulida qiyinlik o'sib boradi.

## Tayyorlik qoidasi (N)

**N = 8**: har ko'nikmada (30 ta, `src/data/satTaksonomiya.ts`) kamida 8 ta tasdiqlangan savol bo'lishi kerak, ya'ni kamida 240 ta. Qo'shimcha: har sohada ikki modulga yetadigan savol (masalan Algebra 16). Sabab: bitta forma 98 savol oladi; N = 8 bilan eng tor soha (Standard English Conventions, 2 ko'nikma × 8 = 16 ≥ 14) ham to'ladi va ikkinchi forma qisman yangi savollar oladi. Qaror muallif tomonidan Claude'ga topshirilgan (2026-11-12); qiymat `private.mock_config()` dagi `min_per_skill`.

Yetmasa `start_mock` `mock_not_ready` qaytaradi, kirish sahifasida "Mock tests are not open yet" chiqadi (raqamsiz). Nima yetishmasligi faqat admin hisobotida:

```sql
-- Supabase Dashboard → SQL Editor (service role)
select * from public.admin_mock_readiness() where missing > 0;
```

Ustunlar: `kind` (`skill` / `domain`), `section`, `domain`, `skill`, `verified`, `needed`, `missing`.

## Forma va urinishlar

- Yangi mock = yangi forma (foydalanuvchiga xos, `mock_forms`, `form_no` 1, 2, …). Avval ko'rmagan savollar (mashq urinishlari va oldingi formalar) afzal; soha ichida ko'nikmalar navbatma-navbat; tanlanganlar qiyinlik bo'yicha 1- va 2-modulga galma-gal bo'linadi.
- Retake = o'sha formani qayta topshirish (bir xil savollar). Formadagi savol yashirilsa (`hidden`), retake yopiladi (`mock_form_unavailable`).
- Bir vaqtda bitta ochiq mock. "Stop the mock test": joriy modul baholanadi, ball qo'yilmaydi, davom ettirib bo'lmaydi.

## Vaqt, uzilish va davom ettirish

- Modul "Start module" bosilganda boshlanadi (`mock_modules.started_at`, `deadline_at`). Modullar orasida va tanaffusda vaqt sanalmaydi; tanaffusni erta tugatish mumkin.
- Server muddatni majburlaydi: `deadline_at + 30 s` (grace) dan keyin `mock_save` javob qabul qilmaydi va har RPC muddati o'tgan modulni o'zi yopadi (`auto_submitted = true`, topshirish vaqti = muddat).
- Javoblar modul davomida qoralama (`mock_answers`), baholash faqat modul yopilganda: `practice_sessions` (`mode = 'mock'`) + `attempts`. To'g'ri javob va tushuntirish faqat natijada (`get_mock_result`).
- Brauzer: `tayanch:sat-mock:v1:<attempt_id>` (modul, joriy savol, yuborilmagan javoblar navbati, cross out). Oflayn bo'lsa javob navbatda turadi va qaytadan yuboriladi (1, 2, 4 … 30 s). Modul almashsa navbat tashlanadi.

## Ball (taxminiy)

Bo'lim = 200 + 600 × to'g'ri / jami, 10 ga yaxlitlangan; jami = R&W + Math (400–1600). Ekranda "Estimated score. This is not an official SAT score." va formula yoziladi. Bu College Board konversiyasi emas: rasmiy ball jadvallari (PDF test qo'llanmalari) kontent siyosati sabab ishlatilmaydi. Muallif qarori (2026-11-12): o'z chiziqli formula. Server `private.mock_section_score`, mijoz `bolimBall` (bir xil, testlangan).

## Kreditlar (P19 kvotasi)

| Kalit | Qachon sarflanadi |
| --- | --- |
| `mock_first` | yangi mock (yangi forma) boshlanganda |
| `mock_retake` | o'sha formani qayta boshlaganda |

- `private.consume_quota` orqali, `start_mock` ichida (xato bo'lsa urinish yaratilmaydi). Mock ichida `sessions`, `questions`, `answers` sarflanmaydi.
- Qiymatlar `plans.limits` da, hozircha yozilmagan = cheklovsiz (muallif qarori, 2026-11-12). Misol (oyiga): `{"mock_first": {"max": 1, "per": "month"}, "mock_retake": {"max": 1, "per": "month"}}` (`docs/tarif-qoidalari.md`, "Qiymatni o'zgartirish").

## Natija va redo

Taxminiy ball (jami, R&W, Math, to'g'ri soni), sohalar jadvali, modul vaqtlari ("time ran out"), xatolar (matn, javob, to'g'ri javob, tushuntirish; avtomatik redo `review_queue`, sabab tegi), javobsiz savollar ("Add to redo list", `add_to_review`).

## Sinov

- SQL: `supabase/tests/mock_test.sql` M01–M10 (`npm run db:tekshir`): huquqlar, tayyorlik, forma tuzilmasi, qoralama va baholash, uzilish va grace, natija va ball, kreditlar, ikkinchi forma, begona foydalanuvchi, yashirilgan savol.
- Sof mantiq: `src/lib/testlar/mock.test.ts` (ball formulasi, vaqt, navbat, xarita, kredit matni, natija jadvali, SQL ko'nikmalar ro'yxati = `satTaksonomiya.ts`).
- Dev mock: `src/lib/sat/mockImtihonMock.ts`, faqat DEV: `?mock=oddiy|qisqa|tayyor-emas|kvota|xato` (`&tozala=1`), oflayn: localStorage `tayanch:dev-mock-oflayn` = `1`. `qisqa`: modul 90 s, tanaffus 20 s.
