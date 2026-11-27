# 3-qavat SAT prep

SAT prep — mashq va o'lchov qavati: savollar, testlar, natijalar, lug'at. U **ilova** kabi ishlashi kerak: tez kirish plitkalari, filtrlar, raqamlar va bitta savolga to'liq diqqat. Shuning uchun tili **navy shisha va ko'k nur**: chuqur navy sahna, ustida ko'k tusli Liquid Glass panellar, tanlangan holat va asosiy harakat ko'k kapsulada.

Ilhom (muallif tanladi, 2026-11-17): ranglar va material AutoHub ilova pinidan (to'q navy fon, ko'k shisha panellar, ko'k nurli kapsula tugma, shisha qidiruv, chip filtrlar, pastki tab bar, ikonka plitkalar). Vosita sahifalari tuzilmasi seller dashboard pinidan (4 ta raqamli karta, filtrli ro'yxat, tezkor harakatlar, grafik, faoliyat ro'yxati); uning och-ko'k ranglari olinmagan. Ikkalasidan faqat g'oya olingan, tasvir va matn ko'chirilmagan.

## Palitra

- Asos **navy** `sat-navy` (pindan o'lchangan, #061e36–#0a223c oralig'i). Navy sahna `.sat-sahna` ikkala mavzuda bir xil: SAT kirishi, hero, ikonka plitkalari, pastki tab bar.
- Vosita sahifalari foni `sat-bg`: yorug'da sovuq oq `sat-mist`, qorong'ida navy. Ostida poydevorning `.t-fon` nur dog'lari (`floor-sat-glow`).
- Shisha uch xil: `sat-glass` (shaffof, qisqa matn), `sat-glass-strong` (zich: savol, test, ro'yxat, forma), navy sahnada `sat-glass-navy` va `sat-glass-navy-strong`. Chet `sat-glass-border`, bezak.
- Urg'u faqat ko'k. Belgi rangi `sat-blue` (`floor-sat-500`) nur, hover chegara va grafik uchun, matn emas. Tanlangan holat va ko'k kapsula `sat-blue-fill`, ustida `sat-on-blue-fill` (5.1:1).
- Matn: `sat-text` va `sat-text-muted` (mavzuga qarab), navy ustida `sat-on-navy` va `sat-on-navy-muted`. Ko'k matn yorug'da `sat-blue-text`, navy ustida `sat-sky`.
- Ma'noli chegara (qidiruv, chip, javob varianti) `sat-line-strong`, navy sahnada `sat-line-on-navy`.
- Boshqa qavatlardan farq: Navigator qora `#181818` va laym, Top Admission krem, issiq qora va to'q sariq. SAT va 4-qavat IELTS ikkalasi ko'k (`floor-sat-500` / `floor-ielts-500`, 1.57:1); muallif qarori (2026-11-18) bilan ular rang emas, Sora sarlavhasi, plitka va tab bar motivi hamda qavat raqami bilan ajraladi. Navy qorong'ida Navigator qorasiga yorqinlikda yaqin (1.03:1): ular tus, ko'k nur va shisha bilan farqlanadi, yonma-yon blok sifatida qo'yilmaydi.

## Kontrast

- Hisoblash node bilan, shaffof shisha uchun tarkibiy rang bo'yicha. Eng yomon holat: shisha nur dog'i markazi ustida.
- Shaffof shishada (`sat-glass`): `sat-text` yorug' 13:1, qorong'i 9.5:1; `sat-text-muted` yorug' 5.3:1, qorong'i 5:1; `sat-sky` 4.9:1.
- Zich shishada: `sat-text` 13:1 dan yuqori, `sat-text-muted` 6.4 / 7:1, `sat-line-strong` 3.7 / 4:1.
- `sat-blue-fill` qorong'i zich shishada 2.9:1: tanlangan chip va javob holati shuning uchun yana `aria-pressed`/`checked`, oq matn va to'lgan harf bilan aytiladi.
- Fokus poydevordagi `focus-ring` (navy ustida yorug' mavzuda 4.9:1).

## Tipografiya

- Sarlavha va raqam: **Sora** 600 (`sat` oilasi). Geometrik, keng: Navigator'ning tor Barlow Condensed'i va Admission'ning qalin katta harfli Onest'idan aniq farq qiladi.
- Uslublar: `sat-hero` (36/40, desktop 56/60), `sat-h2` (24/30), `sat-raqam` (32/36, tabular), `sat-ball` (64, ball ko'rsatkichi), `sat-yorliq` (Onest 12/16, oddiy registr, `·` bilan).
- Oddiy matn va savol matni poydevordagi Onest. Savol matni 18/28, `measure` gacha.
- Sora'da `ʻ` va `ʼ` yo'q (2026-11-18 tekshirildi): u faqat inglizcha sarlavha va raqamda. O'zbekcha qism (lug'at tarjimasi, `lang="uz"`) Onest'da.
- Sora'da `tnum` ishlaydi (2026-11-18 tekshirildi: `tabular-nums` bilan 0–9 bir xil kenglik, usiz proporsional). Raqam ustunida `font-variant-numeric: tabular-nums` majburiy.
- Sora `bundle.css` @import orqali yuklanadi (600).

## Tuzilma

- **Navy sahna** (`.sat-sahna.t-fon`): kirish va hero. Ichida sarlavha, `SatPlitka` plitkalari va bitta ko'k kapsula (`.t-tugma.sat-tugma--kok`).
- **Plitka** (`SatPlitka`): kvadrat navy shisha, ichida ko'k chiziqli ikonka, ostida yorliq. Joriy bo'lim ko'k fill va nur.
- **Ko'rsatkich** (`SatKorsatkich`): 4 ta raqamli karta, ikonka ko'k doirada. Results, Study planner tepasida.
- **Filtr** (`SatFiltr`): zich shisha qidiruv, bo'lim chiplari, natija soni, savol qatorlari. Question bank, Vocabulary.
- **Savol** (`SatSavol`): zich shishadagi savol, A–D variantlari harf doirasi bilan, holat so'z bilan.
- **Tab bar** (`SatTabBar`): telefonda pastda, navy shisha, 5 band. Desktopda yon panel.
- Seller dashboard tuzilmasidan keyingi bosqichda: "Quick actions" ro'yxati, grafik paneli (chiziq `sat-blue`), faoliyat ro'yxati. Ular shu tokenlar bilan quriladi.
- Radius: panel va karta `radius-lg`, plitka `radius-md`, chip, qidiruv va tugma `radius-full`, katta sahna `radius-xl`.
- Bo'shliq: panel ichi `space-4`–`space-6`, kartalar orasi `space-3`.

## Matn qoidasi

- Hamma ekran matni inglizcha. SAT® va Bluebook™ belgisi har sahifada eng ko'zga tashlanadigan joyda bir marta.
- **Test va savol ekrani faqat zich shishada.** Shaffof shishada faqat qisqa matn: nom, raqam, yorliq.
- Raqam, ball va son faqat haqiqiy ma'lumotdan. Namuna ekranda "Sample" bilan. Savollar faqat original; College Board savoli, passage va tushuntirishi qo'yilmaydi.

## Qilinmaydi

- Laym, to'q sariq yoki boshqa ikkinchi urg'u rangi.
- Ko'k kapsulani sahifada bir nechta qilish: asosiy harakat bitta, qolganlari to'q `.t-tugma` yoki `--ikkinchi`.
- Shaffof shishada savol, passage, forma yoki uzun matn.
- Shisha ichida yana blur (ichma-ich shisha): ichki element tekis yoki zich sirt oladi.
- Holatni faqat rang bilan bildirish.
- Pindagi mashina fotosi kabi dekorativ rasm: SAT'da rasm faqat ma'noli (grafik, diagramma).
- `sat-*` tokenlarini boshqa qavat sahifasida ishlatish.

## Saytga o'tkazish (keyingi bosqich)

- `tokens.css`: `sat-*` tokenlari va `--font-sat` (Sora, Google Fonts), `floor-sat-500` o'zgarmaydi.
- `/uz/sat/` kirishi navy sahnaga, bo'limlar plitkaga o'tadi. Results (`analytics_summary()`) `SatKorsatkich`, Question bank `SatFiltr`, sessiya va Kun savoli `SatSavol` ga.
- `SatFokus` (test rejimi) zich shishada qoladi, tab bar yashiriladi.
- Telefon tab bari `satSahifalar.ts` ro'yxatidan, yon panel bilan bir manbadan.
