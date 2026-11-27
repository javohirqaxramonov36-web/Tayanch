# 2-qavat Top Admission

Top Admission — xorijga topshirish qavati: grantlar, universitetlar, hujjatlar va muddatlar. Uning tili **issiq va jasoratli**: katta qalin sarlavha, bitta to'q sariq urg'u va poydevordagi Liquid Glass.

Ilhom (muallif tanladi, 2026-11-17): yorug' mavzu ranglari ijodiy studiya saytidan (krem, qora, to'q sariq), qorong'i mavzu esa issiq qora-jigarrang shisha ilovadan (amber urg'u). Ikkalasi bir rang oilasida, shuning uchun bitta qavatning ikki mavzusi bo'ladi. Tasvir va matn ko'chirilmagan. v1 (siyoh-ko'k, oltin lenta, serif, chipta, shtamp) muallifga yoqmadi va olib tashlandi.

## Palitra

- Yorug': fon `adm-cream`, matn `adm-ink`. Qorong'i: fon `adm-ember` (issiq qora), matn `adm-cream`. Ikkalasi `adm-bg` / `adm-text` orqali.
- Urg'u faqat bitta: `adm-accent` (yorug'da `#FF5A0C`, qorong'ida amber `#FF7A1A`). U fill sifatida ishlatiladi: asosiy tugma, chip, belgilangan checkbox. Ustida doim `adm-on-accent` (qora, 6.3:1). Oq matn to'q sariqda ishlatilmaydi (3.1:1).
- Katta sarlavhadagi urg'u so'z `adm-accent-display` (yorug'da 3.2:1, faqat 24px+ qalin). Oddiy o'lchamdagi to'q sariq matn `adm-accent-text`.
- Shisha 2-qavatda tusli: `adm-glass` (yorug'da oq, qorong'ida jigarrang), matnli panel `adm-glass-strong`, chet `adm-glass-border`.
- Orqa fon nuri `floor-admission-glow`.
- Belgi rangi o'zgardi: `floor-admission-500` endi to'q sariq (Lift, bino). U `floor-ielts-500` qizili bilan yaqin: IELTS mini-DS'ida hal qilinadi.

## Tipografiya

- Hammasi Onest. Hero `adm-hero`: 800, katta harflar, zich (`letter-spacing -0.04em`), oxirgi so'z `.adm-urgu`.
- Bo'lim sarlavhasi `adm-h2`: yengil 500, urg'u so'z 700 va to'q sariq.
- Bo'lim ustida `adm-eyebrow`: oldida 24px to'q sariq chiziq, katta harflar.

## Komponentlar

- `AdmHero`: shisha panel ichida katta sarlavha, matn, ikki kapsula tugma (asosiysi to'q sariq).
- `AdmPlitka`: bo'lim plitkalari (Grantlar, Universitetlar, Hujjatlar, Muddatlar, Til testlari).
- `AdmMuddat`: zich shisha muddat kartasi, qolgan kun katta to'q sariq raqam, manba va tekshirilgan sana.
- `AdmRoyxat`: hujjatlar ro'yxati, haqiqiy checkbox'lar, to'q sariq belgi.
- Tugma, maydon, tab, almashtirgich poydevordan; 2-qavatda nur to'q sariq.

## Qilinmaydi

- Ikkinchi urg'u rangi (ko'k, yashil, oltin).
- To'q sariq fill ustida oq matn yoki kichik o'lchamdagi `adm-accent` matn.
- Uzun matn yoki forma shaffof `adm-glass` da: faqat `adm-glass-strong`.
- Manbasiz sana yoki "qolgan kun".

## Saytga o'tkazish (keyingi bosqich)

- `tokens.css`: `glass-*`, `btn-glass-*`, `floor-*-glow`, `adm-*` qo'shish; `--color-floor-admission-*` shkalasini to'q sariqqa o'zgartirish.
- `/uz/top-admission/` va `turkiye-burslari` sahifalari: hero, plitkalar, muddat kartasi (`deadline.ts`, `manbalar.ts`), hujjatlar ro'yxati.
