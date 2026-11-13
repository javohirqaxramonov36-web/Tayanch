# Ulashish rasmlari (og:image)

Har qavatga bitta rasm: `public/og/<slug>.webp`, 1200×630. Meta teglar `src/components/BoshQism.astro` da,
rasm va alt matni `src/data/ogRasmlar.ts` da (qavat sahifa yo'lidan topiladi: `/uz/<bolim>/...`, aks holda 1-qavat).

## Qanday yasaladi

1. Foto: Higgsfield, model `gpt_image_2_6` (GPT Image 2.6), `quality: high`, `aspect_ratio: 16:9` (1344×752 PNG).
   Rasm ichida matn, yuz, logo, bayroq, pasport, test sahifasi yo'q (promptda taqiqlangan).
2. Yozuv: `node scripts/og-rasm-yasash.mjs <xom-papka> [slug ...]`. Xom PNG'lar `<xom-papka>/<slug>.png`
   (repoga qo'shilmaydi). Skript headless Chrome'da Figtree shrifti va `src/styles/tokens.css` (qorong'i mavzu)
   ranglari bilan yuqori chap burchakka karta chizadi, `sharp` bilan WebP (quality 80) qiladi.
3. Muallif tanlovi (2026-11-11): real foto uslubi, mahalliy detallar (Rishton piyola, atlas), karta kichik va yuqori chapda.

## Promptlar va kredit

Har rasm 1.5 kredit. Jami 10.5 kredit: 4 sinov (2 tasi rad etilgan birinchi variant) + 3 yakuniy.

Umumiy qism (har promptda): "Photorealistic editorial photograph ... Natural soft shadows, shallow depth of field.
Composition: objects sit in the lower and right part of the frame; the top-left area is calm and simple.
No people/faces, no text, no letters, no numbers, no logos, no signage, no flags."

| Slug | Sahna (prompt qisqa) | Kredit |
| --- | --- | --- |
| navigator | Tashkent at sunrise, wooden desk by a window: brass compass on a map with only route lines, pencil, blank notebook, blue-white Rishtan-style piyola of green tea, corner of ikat (atlas) silk | 1.5 |
| top-admission | University library reading room, carved wooden lattice (panjara) window, green-shaded lamp; on the table blank envelopes, fountain pen, Rishtan-style piyola | 1.5 |
| sat | Hand sketching with a pencil on blank grid paper, closed laptop, calculator with display turned away, eraser, Rishtan-style piyola, ikat cloth, chinar leaves in the window | 1.5 |
| ielts | Evening reading corner: hands holding an open book (unreadable pages), headphones, notebook, Rishtan-style piyola, ikat cushion, rainy window | 1.5 |
| eyuf | Suitcase with an ikat scarf on the handle, backpack, books on a chair, window with an airport runway and a plane at dusk; no passports or documents | 1.5 |
| (rad etilgan) | Birinchi sinov: navigator va sat, mahalliy detallarsiz, karta pastki chapda | 3.0 |
