# Admission D-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| Q0 | Maxfiylik auditi (faqat o'qish) | kutilmoqda | | |
| Q1 | Ma'lumot sxemasi va validator | kutilmoqda | | |
| Q2 | Davlatlarni taqqoslash sahifasi | kutilmoqda | | |
| Q3 | Grantlar katalogi sahifasi | kutilmoqda | | |
| Q4 | "Menga mos universitet" filtri | kutilmoqda | | |
| Q5 | Ariza zinapoyasi → XP | kutilmoqda | | |
| Q6 | Kontent: 3 chuqur davlat + valyuta kurslari | kutilmoqda | | |
| Q7 | Kontent: 12 qisqa davlat kartasi | kutilmoqda | | |
| Q8 | Kontent: davlat grantlari | kutilmoqda | | |
| Q9 | Kontent: 30 universitet | kutilmoqda | | |
| Q10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Sozlamalar
- Eskirish muddati: "muddatli" faktlar 60 kun, "barqaror" faktlar 180 kun. (180 kun muallif tomonidan HALI TASDIQLANMAGAN.)

## Repo qoidalari bilan moslashtirish (BOSHQARUVCHI, 2026-11-19)
Reja matni o'zgartirilmagan. Quyidagi joylarda reja repo'ning amaldagi qoidalari (`CLAUDE.md`, `DESIGN.md`) bilan farq qiladi; qism agentlari repo qoidasiga amal qiladi:
- **Joy:** ish `main` checkout'da emas, alohida worktree'da: `Tayanch-SAT prep/.claude/worktrees/admission-d` (branch `admission-d`, asos `origin/main` 8b803c5). Sabab: bir papkada 4 akkaunt ishlaydi, `main` checkout'da branch almashtirish taqiqlangan. "davom" bo'lsa, shu worktree'ga o't.
- **Dizayn:** rejadagi "shrift Manrope, glassmorphism yo'q" eski. Amaldagi manba `DESIGN.md` va `src/styles/tokens.css` (matn shrifti Onest, Top Admission qavat tokenlari `adm-*`, sirtlar "Sirtlar" bo'limi bo'yicha). Xom rang/o'lcham yozilmaydi.
- **Yo'llar:** Top Admission sahifalari `src/pages/uz/top-admission/` da (`/uz/top-admission/...`), rejadagi `.../admission/...` emas. Ichki havola faqat `yol()` orqali.
- **"Header ochiladigan ro'yxati":** saytda qavatlar menyusi `QavatMenyu` faqat `/uz/` da, bo'lim ichida yon panel (`BolimYon`, `bolimlar.ts`). Agent avval o'rganadi; tuzilish rejadagidan farq qilsa, rejaning o'zi aytganidek tegmaydi va shu faylga yozadi (yoki `bolimlar.ts` dagi Top Admission bandlariga qo'shish mos bo'lsa, shuni qiladi va yozadi).
- **Faktlar:** `src/data/manbalar.ts` mavjud manba konventsiyasi; Q1 sxemasi u bilan to'qnashmasligi kerak.
- **band.md:** `~/Tayanch/00-ai/band.md` da qator bor; seriya tugaganda "Tugagan" ga ko'chiriladi.

## Topilmalar (Q0)

## Keyingi chat uchun eslatma

## Muallif uchun savollar
