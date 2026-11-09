# Lokal ish tartibi: shaxsiy materiallar repodan tashqarida

Holat: 2026-11-08. Bu tavsiya; ko'chirishni muallif o'zi qiladi. Sabab: `docs/kontent-siyosati.md`.

Hozir repo papkasida College Board va kurs materiallari yotibdi (`SAT mock testlar/`, `SAT-question bank/`, `SAT-kurs materillari/`). `.gitignore` va `npm run repo:tekshir` ularni repoga tushishdan saqlaydi, lekin eng ishonchli yo'l: ularni repo papkasidan butunlay chiqarish. Shunda `git add -f`, boshqa vosita yoki AI sessiyasi ularga tasodifan tegmaydi.

## Ko'chirish (bir marta)

Terminalda, repo ildizida. Avval papka ochiladi:

```bash
mkdir -p ~/Tayanch-private
```

So'ng har papka ko'chiriladi:

```bash
mv "SAT mock testlar" "SAT-question bank" "SAT-kurs materillari" ~/Tayanch-private/
```

Tekshirish: papkalar yangi joyda, repo ildizida esa qolmagan.

```bash
ls ~/Tayanch-private
```

```bash
npm run repo:tekshir
```

## Keyingi qoidalar

- Yangi yuklangan College Board fayli (PDF, JSON) to'g'ridan-to'g'ri `~/Tayanch-private/` ga saqlanadi, repo papkasiga emas.
- `.env`, `supabase/.env` va boshqa kalitlar faqat lokal; ular `.gitignore` da. Qiymatlarini chatga, logga yoki commit xabariga yozmang.
- `git add -A` yoki `git add .` dan oldin `git status` ga qarang; shubhali fayl bo'lsa `npm run repo:tekshir`.
- `git add -f` (ignore'ni chetlab o'tish) bu papkalar uchun ishlatilmaydi.
- AI sessiyasiga `~/Tayanch-private/` ichini o'qishni topshirmang: bu materiallar promptga ham tushmasligi kerak.

## Supabase o'zgaruvchilari (hisob, P03)

Brauzer kodi faqat ikki **ochiq** qiymatni oladi (`astro.config.mjs`, `env.schema`, `astro:env/client`):

| O'zgaruvchi | Qayerdan | Izoh |
| --- | --- | --- |
| `PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API (Data API) | `https://<ref>.supabase.co` |
| `PUBLIC_SUPABASE_ANON_KEY` | O'sha joy: publishable yoki legacy `anon` kalit | Ochiq kalit; himoyani RLS beradi (SB01, SB03) |

`service_role`/secret kalit bu yerga **hech qachon** qo'yilmaydi: `PUBLIC_` bilan boshlangan qiymat build paytida JS fayliga yoziladi va hammaga ko'rinadi.

**Lokal.** Repo ildizida `.env` (`.gitignore` da), muallif o'zi yozadi:

```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

Qiymat bo'lmasa sayt baribir quriladi: hisob sahifalari "Hisob ochish saytda hali ishlamaydi" deydi, 1-qavat menyusida "Kirish" va yon panellarda hisob bandi chiqmaydi, qolgan sahifalar hisobsiz ishlaydi.

**GitHub Actions.** Repo → Settings → Secrets and variables → Actions → **Variables** bo'limida (Secrets emas: qiymatlar ochiq va baribir sahifaga yoziladi) ikkita repository variable qo'shiladi: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`. `.github/workflows/deploy.yml` ularni `vars.` orqali build qadamiga beradi. Holat: ikkalasi qo'shilgan (2026-11-09, publishable kalit). O'zgartirilgandan keyin sayt qayta qurilishi kerak (Actions → "Saytni joylash" → Run workflow).

Supabase dashboard sozlamalari (Redirect URL'lar, email tasdiqlash, SMTP): `supabase/README.md`.
