# 001. Hisob, to'lov va server

- **Holat**: qabul qilingan (muallif, 2026-11-08). Hisob (email + parol) kodi P03 da yozildi (2026-11-09, PR #58, #61). Kod: sxema (PR #38, #57), inPAY to'lovi Edge Function'lari (PR #62, 2026-11-09); to'lov sahifalari hali yo'q.
- **Almashtiradi**: "Formalar, to'lov, hisob yo'q" va "Foydalanuvchi ma'lumoti faqat brauzerda" qoidalari (CLAUDE.md, HANDOFF §4).

## Nima uchun

SAT bo'limi to'liq ilovaga aylanadi: original savollar, kvotali bepul qism va pullik tariflar (Free, Pro, Max; 2026-11-11 gacha uchinchi tarif "Elite" deb atalgan). Buning uchun foydalanuvchini tanish, natijani qurilmalar orasida saqlash va to'lovni qabul qilish kerak. Statik GitHub Pages buni o'zi qila olmaydi. Server yozish va saqlash o'rniga tayyor xizmat olinadi: Supabase (Auth, Postgres, Edge Functions) va inPAY (Click, Payme, UzCard/HUMO).

## Qayerda nima ishlaydi

| Joy | Nima qiladi | Nima qilmaydi |
| --- | --- | --- |
| Brauzer (GitHub Pages, statik Astro) | Sahifalarni ko'rsatadi. Supabase JS mijozi ochiq kalit bilan kirish/chiqish qiladi, foydalanuvchining o'z yozuvlarini o'qiydi/yozadi (RLS cheklagan doirada). Hisobsiz holatda progress `tayanch:` kalitlarida. | To'lov holatini yozmaydi, tarifni o'zi ochmaydi, maxfiy kalit saqlamaydi. |
| Supabase Auth | Bitta hisob butun sayt uchun: email va Google (SB04). Kirish va profil sahifalari 1-qavatda, `/uz/hisob/`, o'zbekcha (2026-11-09; PR #58 da SAT ichida edi, muallif qarori bilan 1-qavatga ko'chdi). Hamma qavatdan kiriladi. Sessiya brauzerda `tayanch:auth` kalitida. | Har qavatga alohida login yo'q. |
| Supabase Postgres | Profil, obuna (`bolim` maydoni bilan, hozircha faqat `sat`), kvota hisobi, javob va progress, original savollar (`verified_by` bilan). Har jadvalda RLS yoqilgan (SB03). | College Board materiallari saqlanmaydi. |
| Supabase Edge Functions | `tolov-yaratish`: inPAY API v2'da to'lov yaratish (maxfiy kalit bilan); `inpay-webhook`: webhook'ni qabul qilish, imzoni tekshirish va obunani yozish (IP03, `supabase/README.md` 10-bo'lim). Kalitlarni Supabase secrets dan oladi (SB02). | Brauzerga maxfiy kalit qaytarmaydi. |
| inPAY | To'lov sahifasi (`checkout_url`) va to'lov usullari; to'lov holati o'zgarganda `webhook_url` ga imzolangan webhook (IP03). Karta ma'lumoti faqat shu yerda. | Tayanch sahifasida karta raqami so'ralmaydi. |

## Qaysi ma'lumot saqlanadi

- **Hisob**: email, Google orqali kirsa Google bergan ism va email (SB04 dagi standart scope'lar). Parol Supabase Auth'da, Tayanch jadvallarida emas.
- **Obuna**: tarif (free, pro, max), qavat (`bolim`), boshlanish va tugash sanasi, inPAY to'lov identifikatori.
- **Foydalanish**: kvota hisoblagichi, javoblar, xato daftari va progress (hozirgi `tayanch:sat-*` kalitlarining server nusxasi).
- **Statistika** (P25, 2026-11-12): birinchi tomon hodisalari `events` jadvalida (ro'yxat, sessiya, kun savoli, tariflar sahifasi, to'lov), hisob ID si bilan, savol matni, email va IP siz. Profilda o'chiriladi (to'lov hodisalaridan tashqari). Uchinchi tomon analitikasi yo'q. So'rovlar: `docs/metrikalar.sql`.
- **Saqlanmaydi**: karta ma'lumoti, pasport va boshqa hujjatlar, College Board kontenti.
- Minimal yosh: 12 (muallif, 2026-11-08). 12–17 yosh: ota-ona yoki vasiy ismi va roziligi (Qonun 21-modda, LX02, LX03; HANDOFF §5, 12-savol). Maxfiylik siyosati `/uz/maxfiylik/`, Foydalanish shartlari `/uz/shartlar/` (P23, 2026-11-09).
- Hisobni o'chirish: profil sahifasidan, `public.delete_own_account()` (o'z `auth.users` qatorini o'chiradi, cascade bilan bog'liq jadvallar ham).

## Kalit siyosati

- Brauzerda (va repoda) faqat Supabase loyiha URL'i va ochiq kalit (publishable, eski nomi `anon`) bo'lishi mumkin. Supabase hujjati ochiq kalitni ochiq joyda turishi mumkin deydi, xavfsizlikni RLS ta'minlaydi (SB01, SB03).
- Qolgan hamma kalit faqat Supabase secrets (Dashboard yoki `supabase secrets set`) va lokal `.env` (`supabase/functions/.env`) da (SB02): Supabase secret/`service_role` kaliti, Google OAuth client secret, inPAY `INPAY_SECRET_KEY` (API v2 kaliti) va `INPAY_WEBHOOK_SECRET` (2026-11-09 da v1 nomlari `merchant_id`, `bearer_token`, `webhook_secret` o'rniga). Muallif ularni o'zi qo'yadi.
- `.env` fayllari `.gitignore` da turadi. Kalit qiymati repoga, logga, PR tavsifiga yoki Claude javobiga yozilmaydi; Claude ularni so'ramaydi va o'qimaydi.
- Kalit tasodifan oshkor bo'lsa: darhol bekor qilinadi (rotate), so'ng sabab yoziladi.

## Xavflar

- **To'lovni soxtalashtirish**: brauzer "to'landi" deb aytsa ishonilmaydi. Obuna faqat imzosi tekshirilgan webhook orqali yoziladi; webhook takror kelsa natija bir xil bo'lishi kerak (idempotent, IP01 README tavsiyasi).
- **RLS xatosi**: RLS o'chiq jadval ochiq kalit bilan hammaga ochiq bo'ladi (SB03). Har migratsiyada RLS tekshiriladi.
- **inPAY hujjati**: 2026-11-09 da rasmiy hujjat topildi: v1 (IP04, webhook imzosiz) va v2 (IP03: sinov rejimi, imzolangan webhook, Idempotency-Key, Obunalar). Tayanch v2 ni ishlatadi. To'lov usullari Click va Payme (muallif, 2026-11-08). Takroriy to'lov v2'da bor, hozircha ishlatilmaydi: har davr yangi to'lov (HANDOFF §5, 13-savol).
- **Repo ochiq/yopiq**: hozircha ochiq qoladi (2026-11-08). Pages sayti yopiq repoda ham ochiq bo'ladi va pullik tarif talab qiladi, shuning uchun himoya repo yopilishiga emas, Supabase RLS va secrets'ga tayanadi (HANDOFF §5, 11-savol). Kalitlar repoga tushmaydi.
- **Bog'liqlik**: Supabase yoki inPAY ishlamasa hisob va to'lov to'xtaydi. Hisobsiz bepul qism brauzerda ishlashda davom etishi kerak.
- **Shaxsiy ma'lumot**: minimal yosh, 18 yoshgacha qoida va maxfiylik siyosati hal bo'ldi (P23, 2026-11-09). Hisob sahifasini "chop-etilgan" qilish muallif qarori.
- **Kontent huquqi**: savollar faqat original, muallif tasdig'i bilan (`verified_by`).

## Manbalar

`src/data/manbalar.ts`: LX02 (Shaxsga doir ma'lumotlar to'g'risidagi Qonun), LX03 (Fuqarolik kodeksi 22-modda), LX04 (VM 415-son, teng himoya ro'yxati), SB01 (API kalitlari), SB02 (Edge Functions secrets), SB03 (Row Level Security), SB04 (Google bilan kirish), IP01 (`inpayuz/inpay-php`, Packagist), IP02 (`inpay-python`, PyPI, tekshirilmoqda), IP03 (inPAY API v2), IP04 (inPAY API v1).
