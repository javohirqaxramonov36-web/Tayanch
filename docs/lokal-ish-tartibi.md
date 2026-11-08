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
