# Tayanch: dizayn tizimi

Yo'nalish: **Quizlet'dan ilhomlangan, ochiq va interaktiv ta'lim sayti.** Och fon, oq kartalar, har bo'limning o'z rangi, yumaloq tugmalar, ichida jonli bo'lagi bor kartalar. Asos maket: Claude Design'dagi "Tayanch bosh sahifa maketlari", "Quizlet yo'nalishi" sahifasi (2026-11-04).

Kodda qiymat yozilmaydi, faqat `src/styles/tokens.css` dagi nomlar ishlatiladi.

## Rang

| Token | Qiymat | Roli |
| --- | --- | --- |
| `--rang-asosiy` | `#4255ff` | Asosiy tugmalar, havolalar, progress, logo. Muqobil: `#0b7a83` (firuza), qaror hali yakuniy emas |
| `--rang-asosiy-matn` | `#ffffff` | Asosiy rang ustidagi matn |
| `--fon` | `#f6f7fb` | Sahifa foni |
| `--sirt` | `#ffffff` | Kartalar, sarlavha qatori |
| `--sirt-ikkinchi` | `#eef0f6` | Neytral yorliqlar, ikkinchi darajali tugma |
| `--chiziq` | `#e3e6ef` | Ajratuvchi chiziqlar |
| `--chiziq-kuchli` | `#d9dde8` | Variant tugmalari chegarasi |
| `--matn` | `#282e3e` | Asosiy matn |
| `--matn-ikkinchi` | `#4b5266` | Tavsiflar |
| `--matn-sust` | `#586380` | Yorliqlar, izohlar (oq fonda 4.5:1 dan yuqori) |

Bo'lim ranglari (faqat fon, ustidagi matn `--matn`):

| Token | Qiymat | Bo'lim |
| --- | --- | --- |
| `--bolim-top-admission` | `#dbdfff` | Top Admission |
| `--bolim-ielts` | `#ffe8cc` | IELTS |
| `--bolim-sat` | `#d9ffcc` | SAT |
| `--bolim-eyuf` | `#ccf3f5` | El-Yurt Umidi |

Holat ranglari: `--rang-ogoh-fon #ffe8cc` / `--rang-ogoh-matn #9a3412` (takrorlash, ogohlantirish), `--rang-yulduz #f59e0b`.

Qorong'i rejim: hozircha yo'q. Qo'shilganda har token uchun alohida qiymat yoziladi.

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
- **Bo'lim kartasi**: bo'lim rangidagi fon, `--r-katta`, ichida oq "jonli bo'lak" (ro'yxat, kartochka, T/F/NG yorliqlari, bosqich nuqtalari).
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
