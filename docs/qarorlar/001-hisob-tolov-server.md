# 001. Hisob, to'lov va server

- **Holat**: qabul qilingan (muallif, 2026-11-08). Hisob (email + parol) kodi P03 da yozildi (2026-11-09); to'lov kodi hali yo'q.
- **Almashtiradi**: "Formalar, to'lov, hisob yo'q" va "Foydalanuvchi ma'lumoti faqat brauzerda" qoidalari (CLAUDE.md, HANDOFF §4).

## Nima uchun

SAT bo'limi to'liq ilovaga aylanadi: original savollar, kvotali bepul qism va pullik tariflar (Free, Pro, Elite). Buning uchun foydalanuvchini tanish, natijani qurilmalar orasida saqlash va to'lovni qabul qilish kerak. Statik GitHub Pages buni o'zi qila olmaydi. Server yozish va saqlash o'rniga tayyor xizmat olinadi: Supabase (Auth, Postgres, Edge Functions) va inPAY (Click, Payme, UzCard/HUMO).

## Qayerda nima ishlaydi

| Joy | Nima qiladi | Nima qilmaydi |
| --- | --- | --- |
| Brauzer (GitHub Pages, statik Astro) | Sahifalarni ko'rsatadi. Supabase JS mijozi ochiq kalit bilan kirish/chiqish qiladi, foydalanuvchining o'z yozuvlarini o'qiydi/yozadi (RLS cheklagan doirada). Hisobsiz holatda progress `tayanch:` kalitlarida. | To'lov holatini yozmaydi, tarifni o'zi ochmaydi, maxfiy kalit saqlamaydi. |
| Supabase Auth | Bitta hisob butun sayt uchun: email va Google (SB04). Kirish va profil sahifalari hozircha `/uz/sat/hisob/` da, inglizcha (2026-11-09, P03; 1-qavatdagi `/uz/hisob/` keyinroq). Sessiya brauzerda `tayanch:auth` kalitida. | Har qavatga alohida login yo'q. |
| Supabase Postgres | Profil, obuna (`bolim` maydoni bilan, hozircha faqat `sat`), kvota hisobi, javob va progress, original savollar (`verified_by` bilan). Har jadvalda RLS yoqilgan (SB03). | College Board materiallari saqlanmaydi. |
| Supabase Edge Functions | inPAY'da invoice yaratish (bearer token bilan), inPAY webhook'ini qabul qilish, imzoni tekshirish va obunani yozish. Kalitlarni Supabase secrets dan oladi (SB02). | Brauzerga maxfiy kalit qaytarmaydi. |
| inPAY | To'lov sahifasi va to'lov usullari; muvaffaqiyatli to'lovdan keyin `callback_url` ga imzolangan webhook (IP01). Karta ma'lumoti faqat shu yerda. | Tayanch sahifasida karta raqami so'ralmaydi. |

## Qaysi ma'lumot saqlanadi

- **Hisob**: email, Google orqali kirsa Google bergan ism va email (SB04 dagi standart scope'lar). Parol Supabase Auth'da, Tayanch jadvallarida emas.
- **Obuna**: tarif (free, pro, elite), qavat (`bolim`), boshlanish va tugash sanasi, inPAY to'lov identifikatori.
- **Foydalanish**: kvota hisoblagichi, javoblar, xato daftari va progress (hozirgi `tayanch:sat-*` kalitlarining server nusxasi).
- **Saqlanmaydi**: karta ma'lumoti, pasport va boshqa hujjatlar, College Board kontenti.
- Minimal yosh: 12 (muallif, 2026-11-08). Maxfiylik matni hali yozilmagan (HANDOFF §5, 12-savol).

## Kalit siyosati

- Brauzerda (va repoda) faqat Supabase loyiha URL'i va ochiq kalit (publishable, eski nomi `anon`) bo'lishi mumkin. Supabase hujjati ochiq kalitni ochiq joyda turishi mumkin deydi, xavfsizlikni RLS ta'minlaydi (SB01, SB03).
- Qolgan hamma kalit faqat Supabase secrets (Dashboard yoki `supabase secrets set`) va lokal `.env` (`supabase/functions/.env`) da (SB02): Supabase secret/`service_role` kaliti, Google OAuth client secret, inPAY `merchant_id`, `bearer_token`, `webhook_secret`. Muallif ularni o'zi qo'yadi.
- `.env` fayllari `.gitignore` da turadi. Kalit qiymati repoga, logga, PR tavsifiga yoki Claude javobiga yozilmaydi; Claude ularni so'ramaydi va o'qimaydi.
- Kalit tasodifan oshkor bo'lsa: darhol bekor qilinadi (rotate), so'ng sabab yoziladi.

## Xavflar

- **To'lovni soxtalashtirish**: brauzer "to'landi" deb aytsa ishonilmaydi. Obuna faqat imzosi tekshirilgan webhook orqali yoziladi; webhook takror kelsa natija bir xil bo'lishi kerak (idempotent, IP01 README tavsiyasi).
- **RLS xatosi**: RLS o'chiq jadval ochiq kalit bilan hammaga ochiq bo'ladi (SB03). Har migratsiyada RLS tekshiriladi.
- **inPAY hujjati**: REST hujjati topilmagan, faqat SDK sahifalari bor (IP01, IP02). To'lov usullari Click va Payme (muallif, 2026-11-08). Takroriy to'lov noma'lum (HANDOFF §5, 13-savol). Integratsiyadan oldin inPAY'dan rasmiy hujjat so'raladi.
- **Repo ochiq/yopiq**: hozircha ochiq qoladi (2026-11-08). Pages sayti yopiq repoda ham ochiq bo'ladi va pullik tarif talab qiladi, shuning uchun himoya repo yopilishiga emas, Supabase RLS va secrets'ga tayanadi (HANDOFF §5, 11-savol). Kalitlar repoga tushmaydi.
- **Bog'liqlik**: Supabase yoki inPAY ishlamasa hisob va to'lov to'xtaydi. Hisobsiz bepul qism brauzerda ishlashda davom etishi kerak.
- **Shaxsiy ma'lumot**: minimal yosh va maxfiylik siyosati hal bo'lmaguncha hisob sahifasi "chop-etilgan" qilinmaydi.
- **Kontent huquqi**: savollar faqat original, muallif tasdig'i bilan (`verified_by`).

## Manbalar

`src/data/manbalar.ts`: SB01 (API kalitlari), SB02 (Edge Functions secrets), SB03 (Row Level Security), SB04 (Google bilan kirish), IP01 (`inpayuz/inpay-php`, Packagist), IP02 (`inpay-python`, PyPI, tekshirilmoqda).
