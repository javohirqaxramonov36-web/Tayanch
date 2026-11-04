# Tayanch: dizayn tizimi

Yo'nalish: **hikoyali bosh sahifa va o'yinli mashqlar** (Quizlet'dan ilhomlangan interaktivlik). Oq fon, qora tipografiya va chegaralar, ko'k ta'kid, yumaloq tugmalar. Asos maket: Claude Design'dagi "Tayanch bosh sahifa maketlari", "Hikoya (v2)" sahifasi (2026-11-04). Bosh sahifa tuzilmasi: loyihadagi `BRIEF-bosh-sahifa.md`.

Kodda qiymat yozilmaydi, faqat `src/styles/tokens.css` dagi nomlar ishlatiladi.

## Rang

Palitra: **oq, qora, ko'k** (2026-11-04 qarori). Bo'limlar rang bilan emas, ikonka va karta ichidagi mazmun bilan farqlanadi.

| Token | Qiymat | Roli |
| --- | --- | --- |
| `--rang-asosiy` | `#4255ff` | Ko'k: asosiy tugmalar, havolalar, progress, ta'kid so'zlar, ikonkalar |
| `--rang-asosiy-toq` | `#2f40e0` | Ko'k tugma hover |
| `--rang-asosiy-qorada` | `#8b97ff` | Qora fon ustidagi ko'k (timeline chizig'i va nuqtalari) |
| `--fon` | `#ffffff` | Sahifa foni |
| `--fon-ikkinchi` | `#f5f6fa` | Tinch sahna foni, ichki kartalar |
| `--sirt-ikkinchi` | `#eceef3` | Neytral yorliq, ikkinchi darajali tugma |
| `--chiziq` / `--chiziq-kuchli` | `#e6e8ee` / `#dfe2ea` | Ajratuvchi va variant tugmasi chegarasi |
| `--matn` = `--qora` | `#0f1115` | Asosiy matn, qora sahna, karta chegarasi (1.5px) |
| `--matn-ikkinchi` | `#4a5063` | Tavsiflar |
| `--matn-sust` | `#5a6072` | Yorliqlar, izohlar |
| `--qora-sirt` / `--qora-chiziq` | `#1b1e26` / `#2a2e38` | Qora sahna ichidagi kartalar va chiziqlar |
| `--qora-matn-ikkinchi` | `#b4b9c8` | Qora fondagi ikkinchi darajali matn |

Qora sahna sahifada faqat bitta: bosh sahifadagi cho'qqi (muallif yo'li).
Qorong'i rejim: hozircha yo'q.

## Tipografiya

Bitta oila: **Figtree** (Google Fonts, OFL litsenziya), `@fontsource-variable/figtree` orqali saytning o'zidan yuklanadi (tashqi so'rov yo'q).

| Token | O'lcham / qator | Qalinlik | Qayerda |
| --- | --- | --- | --- |
| `--matn-h1` | 46px / 1.12 (telefonda 34px) | 800 | Sahifa sarlavhasi |
| `--matn-h2` | 32px / 1.2 (telefonda 26px) | 800 | Bo'lim sarlavhasi |
| `--matn-h3` | 24px / 1.25 | 800 | Karta sarlavhasi |
| `--matn-katta` | 18px / 1.6 | 400 | Kirish matni |
| `--matn-asosiy` | 16px / 1.6 | 400 | Oddiy matn |
| `--matn-kichik` | 14px / 1.5 | 500 | Izoh, yorliq |
| `--matn-mayda` | 13px / 1.4 | 700 | Ustki yorliq (`1 · BOSHLASH`) |

Qator uzunligi 60–75 belgi (`max-width: 62ch`).

## Bo'shliq

4 ga asoslangan shkala: `--b-1` 4px, `--b-2` 8px, `--b-3` 12px, `--b-4` 16px, `--b-5` 20px, `--b-6` 24px, `--b-8` 32px, `--b-10` 40px, `--b-14` 56px, `--b-16` 64px.
Kontent kengligi: `--kenglik` 1200px, yon chekka 20px. Bo'limlar orasi: 56–64px.

## Shakl va chuqurlik

- Radius: `--r-kichik` 6px, `--r-orta` 16px, `--r-katta` 24px, `--r-toliq` 999px.
- Soya: faqat bitta, `--soya` `0 4px 16px rgba(40,46,62,0.08)`. Faqat asosiy interaktiv karta (test, kartochka) uchun.

## Komponentlar

- **Tugma.** Asosiy: `--rang-asosiy` fon, oq matn, to'liq yumaloq, balandlik kamida 48px. Ikkinchi darajali: `--sirt` yoki `--sirt-ikkinchi` fon. Hover: ozgina to'qroq. Fokus: 3px `--rang-asosiy` chegara. Tugma faqat `<button>` yoki `<a>`.
- **Variant tugmasi** (test javobi): oq, 2px `--chiziq-kuchli` chegara, `--r-orta`, chapga tekislangan matn, balandlik 56px.
- **Bo'lim kartasi**: oq fon, 1.5px qora chegara, `--r-katta`, ko'k chiziqli ikonka. Hover: qora ofset soya. Bitta karta (SAT) qora bo'lishi mumkin.
- **Yorliq (pill)**: `--r-toliq`, 13px qalin matn. "Tez orada" = `--sirt-ikkinchi`.
- **Progress**: 8px balandlik, `--r-toliq`, to'ldirish `--rang-asosiy`.
- **Menyu**: oq qator, logo chapda, havolalar o'ngda; telefonda ikkinchi qatorga o'tadi.
- **Footer**: "Natija kafolatlanmaydi", Maxfiylik, Manba jurnali.
- **Sahifa oxiri bloki** (har sahifada, T1): rasmiy manbalar, tekshirilgan sana, keyingi tekshiruv, tekshirilmagan joylar.

## Tasvir va ikonkalar

- Ikonkalar: inline chiziqli SVG, `stroke-width: 2`, `currentColor`. Emoji ikonka sifatida ishlatilmaydi.
- Illyustratsiya: hozircha yo'q. Keyin ochiq litsenziyali to'plamdan (litsenziyasi tekshirilib), so'ng o'z maskotimiz.
- Real odam surati faqat muallifniki va faqat o'zi bergan bo'lsa.

## Taqiqlar

Gradient fonlar, gradient matn, glassmorphism, chap tomonda rangli chiziqli kartalar, uchta bir xil karta qatorini odat bo'yicha qo'yish, uydirma raqam yoki sharh.
