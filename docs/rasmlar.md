# Sayt rasmlari: manba va litsenziya

Bu fayl Canva bilan yaratilgan sahifa rasmlarini qayd qiladi. Bosh sahifa va qavat fotolari (Higgsfield, PR #87, #109, #111) `docs/og-rasmlar.md` da.

Qoidalar (bo'lim sahifalari vizual seriyasi, 2-davra, 2026-11-13): real foto uslubi (PR #111), yuzsiz, matnsiz, logo va bayroqsiz. WebP, 400 va 720 o'lcham, `width`/`height`, `loading="lazy"`, `alt` bilan. Bir sahifada hamma rasmlar jami 150 KB dan oshmaydi. Video yo'q.

| Fayl | Sahifa va joy | Manba | Litsenziya | Hajm |
| --- | --- | --- | --- | --- |
| `public/rasmlar/sat/qayerda-720.webp`, `qayerda-400.webp` | `/uz/sat/`, "Where the SAT counts" sarlavhasi yonida (telefonda ostida) | Canva AI rasm generatori (`generate-image`), 2026-11-13. Canva media `MAHavFQE_VY`; yuklab olish uchun dizayn `DAHavJ7eFOQ`, 2-sahifa (1776×896 PNG eksport), keyin `sips` + `cwebp -q 76` | Canva foydalanish shartlari va Canva AI shartlari asosida (aniq shartlar: tekshirish kerak) | 23 KB + 11 KB |

## Prompt (SAT, "qayerda")

"Photorealistic editorial photograph, wide panoramic crop. Morning light on a wooden study desk by a window in Tashkent: a closed plain university brochure folder and a plain cream envelope (both completely blank, no printing), a small stack of blank index cards, a pencil, a blue-white Rishtan-style ceramic piyola of green tea, a corner of ikat (atlas) silk cloth, plane tree (chinar) leaves visible through the window. Natural soft shadows, shallow depth of field, calm warm colors. Composition: objects spread along the lower middle of the frame, the top area calm and simple. No people, no hands, no faces, no text, no letters, no numbers, no logos, no signage, no flags, no crests."

Tomonlar nisbati: `LANDSCAPE_2_1`.

## Sahifa bo'yicha rasm byudjeti (1280 kenglikda yuklanadigan fayllar)

| Sahifa | Rasmlar | Jami |
| --- | --- | --- |
| `/uz/sat/` | qavat fotosi `sat-1344.webp` (77 KB) + `qayerda-720.webp` (23 KB) | ~100 KB |

Telefonda (375): `sat-800.webp` (37 KB) + `qayerda-400.webp` yoki retina ekranda `qayerda-720.webp`, ya'ni ≤ 60 KB.

Eslatma: birinchi urinishda Canva "generate-design" nomzodi rasmni boshqa stok foto bilan almashtirdi (krujka, piyola emas). U ishlatilmadi; yuqoridagi fayl faqat yaratilgan rasmning o'zidan olingan.
