# Materiallar: Telegram inbox → sayt (holat)

Sana: 2026-11-19. Manba: Telegram bot `inbox/` (repodan tashqarida). Batafsil fayl ro'yxati faqat lokal: `~/Tayanch/materials-private/ROYXAT.md` (repo ochiq, nomlar bu yerga yozilmaydi).

## Natija

| Holat | Soni |
| --- | --- |
| Jami qabul qilingan yozuv | 234 (229 unikal, 5 ta takror) |
| Saytga yuklangan | 0 |
| `materials-private` ga (nusxa) | 231 |
| Material emas (salomlashish matni) | 3 |
| Tekshirilmagan (kalit yo'q) | 0, chunki hech biri import qilinmadi |
| 25 MB dan katta fayl | 0 (eng kattasi 20 MB dan kichik) |

## Nega hech biri saytga chiqmadi

- 231 tasining hammasi Telegram kanallaridan forward qilingan (o'zimiz yozgan material yo'q, litsenziya ko'rsatilmagan).
- SAT, 31 ta PDF: "real exam", "version", "predictions" va shu kabi fayllar. `docs/kontent-siyosati.md` §6 bo'yicha taqiqlangan (sizdirilgan, "prediction" va esda qolgan imtihon materiallari).
- IELTS, 199 ta (PDF, HTML, rasm): "real exam" xotiradan yozilgan testlar, javob kalitlari, transkriptlar, Cambridge muallifining qo'llanmasi. Manba rasmiy yoki noaniq, shuning uchun qoida 4(b)/(c) qo'llandi.
- 1 ta APK fayl: dastur, ochilmadi va ishga tushirilmadi.
- Fayllar ichi o'qilmadi va OCR qilinmadi: rasmiy/sizdirilgan materialni promptga yoki ekranga qo'ymaslik qoidasi (CLAUDE.md).

## Repo o'zgarishi

- `.gitignore`: `materials-private/`.
- Shu fayl.

## Qoldi (muallif qarori)

- `materials-private` dagi 231 fayl bilan nima qilish (o'chirish, saqlash yoki litsenziya so'rash).
- Saytga material kerak bo'lsa: original savollar `docs/savol-formati.md` (savollar repodan tashqarida, `TAYANCH_SAVOLLAR_DIR`), IELTS testlari `docs/ielts-schema.md`.
