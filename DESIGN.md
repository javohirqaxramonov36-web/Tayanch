# Tayanch: dizayn tizimi

Asos: **Tayanch Design System (DS)**, 2026-11-09. Manba fayllar: `docs/ds/tayanch-ds-tokens.css` (tokenlar, o'zgarmas manba) va `docs/ds/tayanch-ds-bino.txt` (shisha bino). DS artifact: https://claude.ai/artifact/VDa6kEFnybraLAMiR1JhP9.

G'oya: besh qavatli bino. Mobile-first, auditoriya 16–19 yosh.

**2026-11-18 dan: bino qoidasi** (ADR `docs/qarorlar/005-qavat-ds.md`). Tizim ikki qatlamdan iborat:
- **poydevor** hamma qavatda bir xil;
- har qavatning o'z kuchli **mini-DS'i** bor.

Asosiy material Liquid Glass. Manba: Claude Design artifakti "Tayanch Design System" https://claude.ai/artifact/MSiB7vTDiz7ri565yM2iwt (versiya 15).

**O'tish davri.** Yangi qoidalar saytga PR'lar bilan bosqichma-bosqich kiradi (ADR 005, "O'tkazish"). Qavat o'z PR'iga yetguncha uning sahifalari pastdagi hozirgi qoidalar bilan ishlaydi: studio foni, shishasiz zich sirtlar (2026-11-13), Onest. Quyidagi bo'limlarda "hozir" va "yangi" alohida belgilangan.

**A yo'nalish "Toza"** (2026-11-09, muallif tanladi; Claude Design maketi https://claude.ai/artifact/JXU8mCvXymmu3enj6NvubQ, artboard "A · Toza"): asos qora-oq, ranglar kam. Neytral shkala sovuq kulrang (`#F5F5F7` … `#111114`), havola va fokus alohida ko'k urg'u (`--color-accent-*`), asosiy tugma qora (qorong'ida oq). Shisha 2026-11-13 da olib tashlangan. Qavatlarning 5 rangi o'zgarmagan, ular faqat belgi, chip va bezakda. DS manba faylidagi (`docs/ds/`) neytral va brand qiymatlari endi faqat tarix uchun; amaldagi qiymatlar `tokens.css` da.

Kodda xom qiymat yozilmaydi: komponent CSS'ida faqat `var(--...)`, qiymatlar faqat `src/styles/tokens.css` da.

## Bino qoidasi (2026-11-18)

| Poydevor (hamma qavatda bir xil) | Qavat o'zi belgilaydi |
| --- | --- |
| Matn shrifti Onest (`body`, `small`, `caption`, `button`) | Sarlavha va raqam shrifti |
| `--space-*`, `--radius-*` | Qaysi radiusni qayerda ishlatish |
| Liquid Glass: `glass-*` sirtlar, kapsula tugma `.t-tugma` (`btn-glass-*`), maydon, tab | Fon, sirtlar va bloklar, shisha tusi |
| Fokus halqasi, holat ranglari (`success`, `warning`, `error`) | Urg'u rangi (bitta) va uning shkalasi |
| Lift, yon panel, qavat yo'li, hisob bandi | Karta, ro'yxat va hero tuzilmasi, motiv |
| Qavat nuri `floor-<qavat>-glow` (tugma osti, shisha orqasidagi dog') | Ikonka va rasm uslubi (poydevor chegarasida) |
| Kontrast: matn 4.5:1, ma'noli chiziq va ikonka 3:1, ikkala mavzuda | |

- **Prefiks.** Qavat tokenlari o'z prefiksi bilan yoziladi: `nav-*` (1), `adm-*` (2), `sat-*` (3), `ielts-*` (4), `eyuf-*` (5). Komponent boshqa qavat tokenini ishlatmaydi.
- **Nomlash.** Repoda rang tokeni `--color-<DS nomi>` bo'ladi: `floor-sat-500` → `--color-floor-sat-500`, `sat-navy` → `--color-sat-navy`.
- **Shrift tokenlari:** `--font-display`, `--font-mono`, `--font-sat`, `--font-ielts`, `--font-eyuf`.
- **Qavat mini-DS'lari:** artifaktdagi `qavat-1-navigator.md` … `qavat-5-eyuf.md`. Qavat PR'i o'z bo'limini shu faylga ko'chiradi.

## Tokenlar

Uch qatlam (`src/styles/tokens.css`):

1. **Primitive**: xom qiymatlar (`--color-neutral-*`, `--color-brand-*`, `--color-floor-<qavat>-100…900`, `--space-*`, `--radius-*`, `--duration-*`, `--font-size-*`).
2. **Semantic**: rol bo'yicha (`--color-bg`, `--color-surface`, `--color-text-primary`, `--color-link`, `--color-floor-<qavat>-fill/text/ui/subtle`, `--text-h1-size` …). Yorug' qiymatlar `:root` da, qorong'i qiymatlar `:root[data-mavzu='qorongi']` da.
3. **Component**: `--btn-*`, `--card-*`, `--input-*`, `--focus-ring`, `--floor-indicator-*`.

Saytga moslash (DS qiymatlari o'zgarmagan):
- DS `[data-theme]` o'rniga `data-mavzu`. Uni `<head>` dagi inline skript sahifa chizilishidan oldin qo'yadi (`BoshQism.astro`): avval `localStorage` dagi `tayanch:mavzu`, bo'lmasa `prefers-color-scheme`. Shuning uchun rang miltillamaydi. Tanlov tugmasi bo'lim yon panelida.
- DS `@container vp` o'rniga `@media (min-width: 768px)`: shu kenglikdan boshlab desktop matn o'lchamlari.
- Eski o'zbekcha nomlar (`--rang-*`, `--fon`, `--matn*`, `--b-*`, `--r-*`, `--soya`, `--parda`) DS tokenlariga ulangan, shuning uchun eski komponentlar ham DS qiymatlarini oladi. **Yangi kodda DS nomlari ishlatiladi.** Moslik jadvali `tokens.css` oxirida.

### Qavat rangi (`data-floor`)

`<html data-floor="1…5">` server tomonda qo'yiladi (`Asosiy`, `BolimQobiq`, `SatFokus`; `joriyQavat(Astro.url.pathname)`). Istalgan element `data-floor` olsa, uning ichida `--floor-*` shu qavatniki bo'ladi (Lift tugmasi, karta borilayotgan qavat rangida). 1-qavat standarti `:where(:root)` da: aks holda keyingi `:root` qoidasi `[data-floor="3"]` ni bosib ketadi.

Qiymatlar 2026-11-18 dan (ADR 005, PR 3 `ds-qavat-ranglari`). 500, yorug' matn (700) va qorong'i matn (400) DS artifaktidan; shkalaning qolgan qadamlari OKLCH da shulardan hisoblangan. Eski ranglar: `#19D3E6`, `#FFC21F`, `#EF4841`, `#3BD879`.

| Qavat | Kalit | `fill` (500) | `text` yorug' / qorong'i | `ui` yorug' / qorong'i | `--floor-on-fill` |
| --- | --- | --- | --- | --- | --- |
| 1 Navigator | `navigator` | laym `#B8D02C` | 700 `#5A6A0A` / 400 `#C8E04A` | 700 / 500 | qora |
| 2 Top Admission | `admission` | to'q sariq `#FF5A0C` | 700 `#B83C00` / 400 `#FF9A4A` | 700 / 500 | qora |
| 3 SAT prep | `sat` | ko'k `#2F86FF` (o'zgarmagan) | 700 `#0050B0` / 400 `#6FA9FF` | 600 / 500 | qora |
| 4 IELTS prep | `ielts` | elektr ko'k `#2760DE` | 700 `#1846B8` / 400 `#8FB3FF` | 600 / **400** | oq |
| 5 EYUF prep | `eyuf` | zumrad `#10895F` | 700 `#0A7350` / 400 `#5ED9A8` | 700 / **400** | oq |

- `text` va `ui` ikkala mavzuda `--color-bg` va `--color-surface` ustida ≥ 4.7:1 (`--rang-asosiy` ko'p joyda matn rangi, shuning uchun `ui` ham AA). `--floor-ui-text` (yorug'da oq, qorong'ida neutral-950) `ui` ustida ≥ 5.1:1.
- Qorong'ida 4 va 5-qavat `ui` = 400: 500 to'q fonda 3.5 / 4.4:1 bo'lib, matn uchun yetmaydi.
- `fill` (500) faqat belgi: bino, nur, bezak. Yorug' fonda laym 1.6:1, to'q sariq 2.9:1, shuning uchun matn, havola, CTA va holat rangi emas.
- `--floor-on-fill`: `fill` ustidagi matn (bino yorlig'i). Elektr ko'k ustida qora 3.5–3.9, oq 5.2+. Zumrad ustida ikkalasi ham chegarada (oq 4.3–4.7 yorliq balandligi bo'ylab): bino `aria-hidden` bezak, qavat raqami Lift va sahifa yorlig'ida matn bo'lib bor. Ochiq qoldi.

3 va 4-qavat yangi ranglarda ikkalasi ko'k (1.57:1, muallif qarori 2026-11-18). Ular rang bilan emas, shrift, motiv va qavat raqami bilan ajraladi. Lift va binoda rang doim raqam bilan keladi.

| Token | Roli |
| --- | --- |
| `--floor-fill` | Identifikatsiya rangi: bino, yonish, bezak. Matn uchun emas |
| `--floor-text` | Qavat rangidagi matn (zich `--color-surface` / `--color-bg` ustida AA) |
| `--floor-ui` | Urg'u: chip, son doirasi, progress, ikonka, chegara, faol qator (fon ustida ≥ 4.5:1, chunki `--rang-asosiy` matn ham) |
| `--floor-on-fill` | `--floor-fill` ustidagi matn (bino yorlig'i): 1–3-qavatda qora, 4–5-qavatda oq |
| `--floor-ui-text` | `--floor-ui` ustidagi matn: yorug'da oq, qorong'ida neutral-950 |
| `--floor-subtle` | Och fon (tanlangan javob, hover) |
| `--floor-ui-toq` / `--floor-ui-chuqur` | `--floor-ui` ning neutral-950 bilan aralashmasi (80% / 60%): 3D pog'ona yuzlari, Hajm 3D sahnasi, urg'u hover. Sayt qo'shimchasi, muallif tasdiqlagan |

Qoidalar:
- **CTA tugmalar qavatdan qat'i nazar bir xil**. Hozir: `--btn-primary-*` (yorug'da brand-900, qorong'ida oq). Yangi: to'q kapsula `.t-tugma` (`btn-glass-*`), ostida qavat nuri. Qavat mini-DS'i bitta urg'u kapsula variantini o'z tokenidan berishi mumkin (`adm-accent`, `sat-blue-fill`, `ielts-accent`, `eyuf-accent`), sahifada bitta. `floor-*-500` CTA bo'lmaydi.
- Qavat matn rangi karta va panel ustida matn sifatida ishlatilmaydi (yorug'da 4.5:1 ga yetmasligi mumkin). Karta ustida urg'u faqat `--floor-ui` doira, ikonka yoki chegarada; matn neytral (`--color-text-*`) yoki `--color-link`.
- Matn ko'rinishidagi havola va ta'kid: `--color-link` (`--rang-havola`). Qavat 700 matn rangi studio foni pastida (`#D9DADE`) 4.1–4.3:1 (SAT, IELTS 5.4+), AA ga yetmaydi.

### Neytral va holat ranglari

| Token | Yorug' | Qorong'i | Roli |
| --- | --- | --- | --- |
| `--color-bg` / `--color-bg-deep` | neutral-50 `#F5F5F7` / 150 `#E6E6EC` | neutral-925 `#0E0E12` / 950 `#050507` | Studio foni gradienti |
| `--color-surface` | oq | neutral-850 `#17171C` | Zich yuza (ustki qator, Lift, karta, forma maydoni) |
| `--color-surface-sunken` | neutral-100 | neutral-950 | Ichki kartalar, tinch sahna |
| `--color-border` | neutral-200 `#DADAE1` | neutral-800 `#26262E` | Ajratuvchi |
| `--color-text-primary` / `-secondary` | neutral-900 `#111114` / 600 `#5C5C66` | neutral-50 `#F5F5F7` / 400 `#A3A3AE` | Matn |
| `--color-link` | accent-700 `#264CD0` | accent-300 `#93B2FF` | Havola, ta'kid. Maketda `#2F5BEA` edi: shisha ostida eng yomon holatda 4.48:1 bo'lgani uchun to'qroq |
| `--color-focus-ring` | accent-500 `#2F86FF` | accent-400 `#7FB0FF` | Fokus halqasi |
| `--color-warning-subtle` / `-text` | | | "Tekshirish kerak" yorlig'i, forma xatosi (ogohlik juftligi) |
| `--qora`, `--qora-sirt`, `--qora-chiziq` | neutral-900 / 850 / 800 | xuddi shu | Qora sahna (ikkala mavzuda bir xil) |
| `--qora-matn` / `--qora-matn-ikkinchi` | oq / neutral-400 | xuddi shu | Qora sahna ustidagi matn |

Forma maydoni chegarasi `--chiziq-maydon` = `--matn-sust` (neutral-600 / 400). DS `--input-border` (neutral-500) studio foni pastida 3:1 ga yetmaydi.

Brauzerda saqlanadigan hamma kalit `tayanch:` bilan boshlanadi (`tayanch:mavzu`, `tayanch:sidebar`, `tayanch:sat-javoblar`, `tayanch:sat-lugat`, `tayanch:ielts-reja`). Supabase sessiyasi ham shu qoidaga bo'ysunadi: `storageKey` = `tayanch:auth` (`src/data/hisobSozlama.ts`), shuning uchun istisno yo'q; uni Supabase o'zi yozadi va yangilaydi, Tayanch kodi faqat o'qiydi (yon paneldagi hisob bandi). Natijalar sahifasidagi "Natijalarni o'chirish" tugmasi faqat `tayanch:sat-javoblar` ni o'chiradi.

## Fon

**Studio foni** (`--gradient-studio`): radial gradient, tepada `--color-bg`, pastda `--color-bg-deep`. Gradient fon **faqat shu yerda**. U `body::before` da ekranga mahkamlangan qatlam (`position: fixed`), shuning uchun uzun sahifada pastki rang butun sahifaga cho'zilmaydi (`background-attachment: fixed` iOS'da ishlamaydi). `SatFokus` qolipida ham shu fon.

**Yangi: shisha foni `.t-fon`** (PR 2 dan, qavat o'z PR'ida yoqadi). Bu qavat nuridan (`floor-<qavat>-glow`) chizilgan ikki xira dog'. U bo'lim yoki sahifa foni bo'ladi, chunki shisha ostida rang bo'lishi kerak. Qavat `.t-fon` ni yoqqanda u studio gradientining o'rnini oladi va yagona dekorativ fon bo'lib qoladi.

## Tipografiya

Bitta oila: **Onest** (`@fontsource-variable/onest`, OFL-1.1, oila nomi `'Onest Variable'`), saytning o'zidan yuklanadi (tashqi so'rov yo'q). O'zbekcha belgilar: `ʻ ʼ` latin faylida, `Ғ Қ Ҳ` cyrillic-ext faylida, `Ў ў` cyrillic faylida. Hajm 3D sahnasidagi canvas matni ham Onest (`hajmSahna.ts`).

| Rol | Telefon | ≥ 768px | Qalinlik | Eski nom |
| --- | --- | --- | --- | --- |
| `--text-display-*` | 40/44 | 72/76 | 700 | `--matn-hero` |
| `--text-h1-*` | 32/36 | 48/56 | 700 | `--matn-h1` |
| `--text-h2-*` | 24/32 | 32/40 | 700 | `--matn-h2` |
| `--text-h3-*` | 20/28 | 24/32 | 600 | `--matn-h3` |
| `--text-body-*` | 16/24 | 18/28 | 400 | `--matn-asosiy` |
| `--font-size-body-d` | 18 | 18 | 400 | `--matn-katta` (kirish matni) |
| `--text-small-*` | 14/20 | 15/24 | 400 | `--matn-kichik` |
| `--text-caption-*` | 12/16 | 13/20 | 600 | `--matn-mayda` (ustki yorliq) |
| `--text-button-*` | 16/20 | 16/20 | 600 | |

`h1–h3` ga rollar `global.css` da beriladi. Qator uzunligi 60–75 belgi (`--size-measure` 68ch).

**Qavat sarlavha shriftlari** (DS PR 4, 2026-11-18: fayllar va tokenlar tayyor, sahifalar qavat PR'larida 5–9 yoqadi). Matn hamma qavatda Onest qoladi.

| Qavat | Token | Sarlavha va raqam (paket) | `ʻ` U+02BB / `ʼ` U+02BC |
| --- | --- | --- | --- |
| 1 Navigator | `--font-display`, `--font-mono` | Barlow Condensed 700 (`@fontsource/barlow-condensed`), yorliq JetBrains Mono 400/500 (`@fontsource/jetbrains-mono`) | Barlow: bor / bor. JetBrains Mono: `ʻ` yo'q, `ʼ` bor; `ʻ` zaxira shriftdan chiqadi (muallif qabul qildi), mono yorliq qisqa |
| 2 Top Admission | `--font-family-sans` 800 | Onest (yangi fayl yo'q) | bor / bor |
| 3 SAT prep | `--font-sat` | Sora 600 (`@fontsource/sora`) | yo'q / yo'q: Sora faqat inglizcha matnda, SAT ichidagi o'zbekcha (`lang="uz"`) Onest'da |
| 4 IELTS prep | `--font-ielts` | Lexend 600 (`@fontsource/lexend`) | bor / bor |
| 5 EYUF prep | `--font-eyuf` | Playfair Display 400–900 variable, oddiy va kursiv (`@fontsource-variable/playfair-display`) | bor / bor (kursivda ham) |

Belgilar ikki yo'l bilan tekshirildi (2026-11-18): woff fayllarning `cmap` jadvali va brauzerda kenglik o'lchovi (`"Shrift", serif` va `"Shrift", monospace` bir xil kenglik bersa, glif shriftning o'zida). Saytdagi matnning ko'pi oddiy `'` bilan yozilgan, u hamma shriftda bor.

Yuklash qoidalari:
- `@font-face` faqat `src/components/QavatShrifti.astro` da (`BoshQism` ichida, `joriyQavat` bo'yicha). Har sahifa faqat o'z qavatining qoidalarini inline `<style>` da oladi; qo'shimcha CSS so'rovi yo'q. Boshqa qavat tokeni (masalan bosh sahifada `--font-sat`) zaxira oilaga tushadi.
- Subset faqat latin va latin-ext, `unicode-range` bilan: odatda faqat latin fayli keladi (`ʻ` `ʼ` latin'da). Kirill olinmagan: saytdagi o'zbekcha lotin.
- Vazn faqat DS ishlatgani. JetBrains Mono statik (400 va 500 alohida 21 KB), Playfair variable (500, 600 va kursiv uchun 2 fayl, statikdan kichik).
- `font-display: swap`. Brauzer faylni faqat shu oila biror elementda chizilganda yuklaydi, shuning uchun token ishlatilmaguncha tarmoq yuki o'zgarmaydi. Preload yo'q; qavat PR'i hero sarlavhasini yoqqanda faqat o'sha sahifaga, faqat latin faylini preload qilish ko'rib chiqiladi. Barlow Condensed Onest'dan ancha tor: swap paytida qator siljishi (CLS) qavat PR'ida tekshiriladi.
- `--font-family-mono` umumiy tizim mono (kod, taklif kodi) bo'lib qoladi va `--font-mono` ning zaxirasi; `--font-mono` faqat 1-qavat yorlig'i.

Raqam ustunlarida `font-variant-numeric: tabular-nums` (Sora'da ishlaydi). Playfair'da `lining-nums` ham qo'shiladi.

Harf oralig'i: PR #74 dagi `--oraliq-hero`, `--oraliq-sarlavha`, `--oraliq-kichik-sarlavha` DS `--text-display-ls`, `--text-h1-ls`, `--text-h3-ls` ga ulangan. Sarlavhalar `text-wrap: balance`, abzaslar `text-wrap: pretty`.

## Bo'shliq va shakl

- Bo'shliq: 4px to'r, `--space-1` … `--space-16` (eski `--b-N` = `--space-N`; `--b-24` 96px / telefonda 64px eski qiymat). Kontent kengligi `--size-content-max` 1200px.
- Radius: `--radius-sm` 6, `--radius-md` 12 (forma, kichik tugma, yon panel qatori), `--radius-lg` 20 (karta), `--radius-xl` 28 (modal), `--radius-full` (pill). Eski `--r-orta` va `--r-logo` → md, `--r-katta` → lg.
- Soya: `--shadow-1` (karta), `--shadow-2` (karta hover, eski `--soya`), `--shadow-3`. Qorong'ida soyada ichki yorug' chiziq bor.
- Bosiladigan joy kamida 44px (`--size-touch-min`). Tugma 48px (`--control-height-md`).

## Sirtlar

### Yangi: Liquid Glass (2026-11-18, ADR 005)

2026-11-13 dagi "shisha yo'q" qarorini muallif bekor qildi. Shisha poydevorning asosiy materiali bo'ladi: karta, panel, tugma, maydon, tab, Lift. Kod PR 2 dan boshlab keladi, har qavat o'z PR'ida yoqadi.

- **Sirt `.t-shisha`.**
  - Fon `glass-bg`, chet `glass-border`.
  - Radius `--radius-xl`, soya `glass-shadow`.
  - `backdrop-filter: blur(glass-blur) saturate(1.6)`.
  - Qavatda shisha tusli bo'ladi: `adm-glass`, `sat-glass`.
- **Matn qoidasi.**
  - Uzun matn, forma, test va savol ekrani faqat zich shishada (`glass-bg-strong`, qavatda `*-glass-strong`).
  - Shaffof shishada faqat qisqa matn bo'ladi: nom, raqam, yorliq.
  - Kontrast eng yomon holatda hisoblanadi: shaffof shisha nur dog'i markazida turganda.
- **Ichma-ich blur yo'q.** Shisha ichidagi element tekis yoki zich sirt oladi.
- **Kapsula tugma `.t-tugma`.**
  - To'q yaltiroq shisha, tepada statik aks (`glass-highlight`).
  - Ostida va soyasida qavat nuri `--nur`.
  - Variantlar: `--ikkinchi` (shaffof), `--ikonka`.
- **Zaxira holat.** `prefers-reduced-transparency: reduce` bo'lsa yoki brauzerda `backdrop-filter` yo'q bo'lsa:
  - shisha zich yoki tekis sirtga o'tadi;
  - tugma `action-primary-*` ga o'tadi.
- **Bino SVG.** Blursiz qoladi, SVG blur filtri qaytmaydi.
- **Telefonda tezlik.** Past darajali Android'da sinalmagan. Har shisha PR'ida haqiqiy telefonda tekshiriladi.

#### Kodda (PR 2, `ds-poydevor-shisha`)

Tokenlar `src/styles/tokens.css` ("Poydevor · Liquid Glass" bloki), stillar `src/styles/shisha.css` (`global.css` import qiladi). Hech bir sahifa hali ishlatmaydi.

| DS nomi (artifakt) | Repo tokeni | Yorug' | Qorong'i |
| --- | --- | --- | --- |
| `glass-bg` | `--color-glass-bg` | oq 52% | oq 7% |
| `glass-bg-strong` | `--color-glass-bg-strong` | oq 82% | `#1C1C22` 82% |
| `glass-border` | `--color-glass-border` | oq 90% | oq 14% |
| `glass-highlight` | `--color-glass-highlight` | oq 95% | oq 22% |
| `glass-shadow` | `--shadow-glass` | ichki oq chiziq + iliq soya | ichki oq 18% + qora soya |
| `glass-blur` | `--size-glass-blur` (24px), filtr `--glass-backdrop` = `blur() saturate(1.6)` | | |
| `btn-glass-bg` | `--color-btn-glass-bg` | `#121216` | `#1D1D24` |
| `btn-glass-text` | `--color-btn-glass-text` | `#F5F5F7` | `#F5F5F7` |
| `floor-<qavat>-glow` | `--color-floor-<qavat>-glow` (5 ta) | mavzuga bog'liq emas | |

- `floor-*-glow` DS qiymatlarida. 1, 2, 4, 5-qavatning hozirgi `floor-*-500` rangi 3-PR (`ds-qavat-ranglari`) da shu tusga o'tadi, keyin glow `floor-*-500` dan `color-mix` bilan olinadi.
- Qavat nuri `--nur`: `data-floor` bo'yicha (`shisha.css`, 1-qavat standarti `:where(:root)`). Tugma soyasi `--shadow-btn-glass` / `--shadow-btn-glass-hover` `.t-tugma` ning o'zida hisoblanadi, shunda qavat konteksti bergan nur olinadi.
- Sinflar: `.t-fon` (nur dog'lari, `--fon-nur-*`), `.t-shisha`, `.t-shisha--zich`, `.t-tugma`, `.t-tugma--ikkinchi`, `.t-tugma--ikonka`.
- Harakat sayt qoidasi bo'yicha: `:active` = `--bosilish`, transition faqat `transform`/`opacity` `--duration-fast`, hover (soya) faqat sichqoncha bilan va darhol. Artifaktdagi 150 / 250 / 400ms va `translateY(1px)` olinmadi.
- Zaxira: blur yo'q brauzerda shisha `--color-glass-bg-strong`; `prefers-reduced-transparency: reduce` yoki `prefers-contrast: more` da `--color-surface` + `--color-border`, tugma `--color-action-primary-*`, ikkinchi tugma `--color-surface` + `--btn-secondary-border`.
- Fokus: umumiy halqa (`global.css`, `a`/`button`).

**Kontrast (node, 2026-11-18).** Eng yomon holat: `.t-fon` nur dog'i markazi (blursiz), ustida `saturate(1.6)`, so'ng shisha.

| Holat | Yorug' | Qorong'i |
| --- | --- | --- |
| `btn-glass-text` / `btn-glass-bg` | 17.16 | 15.39 |
| Zich shisha, `text-primary` | 16.28+ | 12.91+ |
| Zich shisha, `text-secondary` | 5.71+ | 5.63+ |
| Shaffof shisha, `text-primary` | 12.58+ | 3.78 (1-qavat), qolganlari 5.47+ |
| Shaffof shisha, `text-secondary` | 4.41 (4-qavat), qolganlari 4.64+ | 1.65–3.20 |

Shundan qoida: **shaffof shishada faqat `text-primary`**. `text-secondary` faqat zich shishada. 1-qavat qorong'i mavzusida shaffof shisha nur dog'i ustiga qo'yilmaydi (yoki matn zich shishada bo'ladi). Qavat o'z PR'ida o'z foni va shishasi bilan qayta hisoblaydi.

### Qavat foto foni (2026-11-19, muallif tanlovi)

- Qavat kirish sahifalarida (Top Admission, SAT, IELTS, EYUF) `QavatFoto` rasmi butun ekranni qoplaydi va joyida qotib turadi (`position: fixed`, `object-fit: cover`), ustida `--qavat-fon-parda`.
- Kontent (`main`) foto ustida zich shishada: `--qavat-fon-shisha` (yorug'da sirt 78% + parda 30%, qorong'ida 75% + parda 40%; eng yomon holatda, ya'ni foto pikseli qora yoki oq bo'lsa, `--color-text-secondary` 4.5:1 dan past emas: yorug'da ~4.6:1, qorong'ida ~4.6:1), `--qavat-fon-blur`. Shisha `main::before` da, chunki `main` ning o'zidagi `backdrop-filter` fixed fotoni o'z qutisiga qamaydi.
- Zaxira: `prefers-reduced-transparency` yoki `backdrop-filter` yo'q bo'lsa, zich `--color-surface`.

### Hozir: shishasiz (2026-11-13), qavat o'z PR'iga yetguncha

- Ustki qatorlar (`Menyu`, `BolimYon` ustki qatori, `SatFokus` sarlavhasi) va Lift telefon paneli: zich `--color-surface` fon, 1px `--color-border` chiziq.
- Kartalar: `--card-bg` (= `--color-surface`, yorug'da oq), 1px `--card-border` (`--card-line`: yorug'da neutral-900 8%, qorong'ida oq 9%), statik `--card-shadow` (`--shadow-1`).
- Bino SVG: blursiz, glow va soya qatlamisiz.

## Qavat mini-DS'lari

### 3-qavat SAT (PR 5a `ds-sat-kirish`, 2026-11-18)

Manba: artifakt v15 `qavat-3-sat.md`, `tokens.json` (`sat-*`), `bundle.css` "3 · SAT prep". `/uz/sat/` kirishi (5a), Results, Question bank, Vocabulary (5b), savol ekranlari (5c) va telefon tab bari (5d) yangi ko'rinishda.

- **Tokenlar** (`tokens.css`, "3-qavat SAT mini-DS"): `--color-sat-navy`, `-navy-raised`, `-navy-high`, `-mist`, `-on-navy`, `-on-navy-muted`, `-sky`, `-line-on-navy`, `-blue` (= `floor-sat-500`), `-blue-fill`, `-on-blue-fill`, `-glass-navy(-strong, -border)`; mavzuli `--color-sat-bg`, `-surface`, `-glass(-strong, -border)`, `-text`, `-text-muted`, `-blue-text`, `-line`, `-line-strong`. Soya `--shadow-sat-panel-navy`, `--shadow-sat-plitka-hover`, `--shadow-sat-plitka-joriy`. O'lcham `--size-sat-plitka` (64, ≥720px 72), `--size-sat-tabbar`. Tipografiya `--text-sat-hero-*` (36/40, ≥720px 56/60), `--text-sat-h2-*` (24/30), shrift `--font-sat` (Sora 600, faqat inglizcha).
- **Stillar** `src/styles/sat.css` (faqat SAT sahifasi import qiladi): `.sat-sahna` (navy sahna, `.t-fon` bilan), `.sat-sarlavha`, `.sat-yorliq`, `.t-tugma.sat-tugma--kok`. Sahna poydevor tokenlarini (`--color-glass-*`, `--shadow-glass`, `--color-text-primary`, `--color-surface`, `--color-focus-ring`) navy qiymatga almashtiradi, shuning uchun ichida oddiy `.t-shisha`, `.t-shisha--zich`, `.t-tugma--ikkinchi` ishlatiladi (DS dagi `.sat-shisha` kerak emas). `overflow: clip`.
- **`SatPlitka`** (`src/components/sat/SatPlitka.astro`): `<ul>` ichida `<a>` plitkalar, ikonka `.t-shisha` (navy shisha, `sat-sky`), ostida yorliq; joriy bo'lim `aria-current="page"` (ko'k fill). Hover (faqat sichqoncha): chet `sat-blue` va nur, darhol. Bosish: ikonka `--bosilish`, 150ms. Telefonda 3 ustun, ≥720px 6.
- **Matn qoidasi.** Sahnada (nur dog'i ustida) matn faqat `sat-on-navy`; `on-navy-muted` va `sky` faqat zich shishada yoki 24px+ sarlavhada. Fokus sahnada `accent-400`, oraliq navy. Ko'k kapsula sahifada bitta.
- **`SatTabBar`** (PR 5d `ds-sat-tabbar`, 2026-11-23; `src/components/sat/SatTabBar.astro`, mantiq `src/lib/sat/satTab.ts`): faqat <720px, ekran pastida suzuvchi kapsula (`position: fixed`, chetdan `--space-2`, pastda `env(safe-area-inset-bottom)` qo'shiladi). 5 band: Today, Practice, Learn, Progress, Plan, yon panel guruhlaridan (`satYonGuruhlar`), har biri guruhning birinchi sahifasiga. Account va Lift poydevordagi hamburger panelda qoladi. Fon zich navy shisha (`sat-glass-navy-strong`, ikkala mavzuda bir xil), yorliq `sat-on-navy-muted` 11/14 (caption), joriy band `sat-sky` + `sat-navy-high` fon: aynan tab sahifasida `aria-current="page"`, guruhning boshqa sahifasida `"true"` (ko'rinishi bir xil). Band balandligi `--size-sat-tabbar`, body pastki bo'shlig'i va `scroll-padding-bottom` `--size-sat-tabbar-joy` + safe area (oxirgi kontent, `SatEslatma` yopilmaydi). Yashiriladi: `SatFokus` sahifalarida (ulanmaydi), matn maydoni fokusda bo'lganda, hamburger panel ochiq bo'lganda. Fokus `accent-400`, oraliq navy. Stil komponent ichida (sat.css'ga tegmaydi). Kontrast (node, 2026-11-23, zich navy shisha 0.9 ostida eng yorug' kontent oq): `sat-on-navy-muted` 5.62+, joriy `sat-sky` / `sat-navy-high` 5.43, fokus `accent-400` 5.29+; tekis zaxirada `sat-on-navy-muted` / `sat-navy-raised` 6.92.
- **Zaxira.** `prefers-reduced-transparency` / `prefers-contrast: more`: sahnadagi shisha tekis `sat-navy-raised` + `sat-line-on-navy` chet, ko'k kapsula tekis `sat-blue-fill` (hover'da ham).

**Kontrast (node, 2026-11-18).** Eng yomon holat: `.t-fon` nur dog'i markazi (blursiz, `floor-sat-glow` × 0.9), shisha ostida `saturate(1.6)`.

| Juftlik | Navy tekis | Nur markazi | Shaffof shisha / nur | Zich shisha / nur |
| --- | --- | --- | --- | --- |
| `sat-on-navy` | 15.72 | 6.69 | 9.43 | 13.28 |
| `sat-on-navy-muted` | 8.29 | 3.53 | 4.98 | 7.00 |
| `sat-sky` | 8.05 | 3.43 (faqat 24px+ sarlavha) | 4.83 | 6.80 |
| Fokus `accent-500` / `accent-400` | 4.89 / 7.81 | 2.08 / 3.33 | 2.93 / 4.69 | 4.13 / 6.60 |
| `sat-blue` (grafik, chet) | 4.89 | 2.08 (faqat hover bezagi) | 2.93 | 4.13 |

`sat-on-blue-fill` / `sat-blue-fill` 5.12. Navy sahna noshaffof, shuning uchun "Qavat foto foni" (`main` zich shishada) ichida ham sahna kontrasti o'zgarmaydi. Foto fon ustidagi zich shishada (eng yomon foto pikseli oq yoki qora) `sat-text` 10.54+, `sat-text-muted` 4.81+, `sat-blue-text` 5.26+; `sat-line-strong` u yerda 2.76 bo'lgani uchun faqat qattiq kartalar ichida. Pastki bo'limlar (sahnadan tashqari, qattiq kartalar): `sat-text` 13.13+, `sat-text-muted` 6.16+ (yorug') / 6.92+ (qorong'i), `sat-blue-text` 6.72+, `sat-line-strong` 3.54+.

#### Vositalar (PR 5b `ds-sat-vositalar`, 2026-11-18)

Sahifalar: Results (`/uz/sat/vosita/natijalar/`), Question bank (`/uz/sat/mashq/bank/`), Vocabulary (`/uz/sat/mashq/lugat/`). Takrorlash, Reja, Rasmiy testlar va boshqa vositalar hozircha eski ko'rinishda (keyingi PR).

- **`.sat`** (`sat.css`): vosita sahifa foni `sat-bg` (yorug' `sat-mist`, qorong'i `sat-navy`) va `.t-fon` nur dog'lari. `BolimQobiq` ning `sahifaSinfi="sat t-fon"` propi kontent ustuniga qo'yadi; yon panel (`BolimYon`) va boshqa SAT sahifalari tegilmaydi. Soha ichida poydevor tokenlari (`--color-glass-*` → `sat-glass*`, `--color-text-*`, `--color-surface`, `--color-border`) va eski o'zbekcha nomlar (`--matn*`, `--fon*`, `--sirt*`, `--chiziq*`, `--rang-asosiy*`, `--rang-havola`, `--qora*`) SAT qiymatiga o'tadi: eski sahifa CSS'i yangi ranglarni oladi. `overflow: clip` (sticky va `scrollIntoView` buzilmaydi). `.sat--fonsiz`: faqat token sohasi (Lug'at `SatFokus` ichida, `SatFokus` 5c da o'tadi).
- **Nur xiraroq**: `--sat-fon-nur-opacity` 0.4 / `-past` 0.25 (poydevorda 0.9 / 0.55). Sabab: vosita sahifasida oddiy matn (`sat-text-muted`, `sat-blue-text`) to'g'ridan-to'g'ri fon ustida, 0.9 da nur markazida 3.38–3.70.
- **`.sat-panel`**: zich sirt blursiz (`glass-bg-strong` + `glass-border` + `shadow-glass`, `radius-lg`). Ro'yxat, jadval, grafik, forma bloklari uchun: ichma-ich blur va o'nlab `backdrop-filter` bo'lmaydi. Haqiqiy shisha (`.t-shisha--zich`) faqat `SatKorsatkich` kartalari va `SatFiltr` panelida.
- **`SatKorsatkich`** (`src/components/sat/SatKorsatkich.astro`): `<dl>` 4 karta (telefonda 2 ustun, ≥900px 4), ikonka `sat-blue-fill` doirada oq chiziq (`--shadow-sat-ikon`), raqam Sora 600 `--text-sat-raqam-*` (32/36, ≥720px 40/44) `tabular-nums`, izoh `sat-text-muted`. Raqamni sahifa skripti `qiymatId` bo'yicha yozadi.
- **`SatFiltr`** (`src/components/sat/SatFiltr.astro`): zich shisha qobiq (`section` yoki `div`), ichida `.sat-chip` (`<button aria-pressed>`), `.sat-natija-bosh`, `.sat-qatorlar`/`.sat-qator`. Chip: chet `sat-line-strong`, tanlangan fill `sat-blue-fill` + oq matn, chet `--sat-tanlangan-chet` (yorug' fill, qorong'i `sat-sky`), soya `--shadow-sat-chip`; hover faqat sichqoncha bilan chet `sat-blue`, darhol; `:active` `--bosilish`; `forced-colors` da `Highlight`. Xatti-harakat (aria-pressed, filtr mantiqi, URL) sahifalarda o'zgarmagan.
- **Hover tuzatish**: `.sat` da `--rang-asosiy` = `sat-blue-fill`, `--rang-asosiy-matn` oq, `--rang-asosiy-toq` = fill 80% + navy. Eski qorong'i hover (qora matn / to'q ko'k 3.99) Results sahifasida yo'q; `.qayta` va `.mashq-tugma` hover fill + oq (5.12). SavolUslub va Rasmiy testlar hover'lari hali eski (5c / keyingi PR).
- **Zaxira**: `prefers-reduced-transparency` / `prefers-contrast: more` da `.sat-panel` tekis `sat-surface` + `sat-line-strong` chet, chip `sat-surface`, soyasiz.

**Kontrast (node, 2026-11-18, skript notes `sat-vosita-kontrast.mjs`).** Eng yomon holat: nur markazi (`floor-sat-glow` × 0.4), shisha ostida `saturate(1.6)`.

| Juftlik | Yorug' | Qorong'i |
| --- | --- | --- |
| Fon nur markazi: `sat-text-muted` / `sat-blue-text` | 4.76 / 5.21 | 5.88 / 5.71 |
| Zich shisha (nur 0.9 da ham): `sat-text` / `muted` / `blue-text` | 15.82 / 6.37 / 6.97 | 13.28 / 7.00 / 6.80 |
| Zich shisha: `sat-line-strong` (chip cheti) | 3.66 | 3.96 |
| Tanlangan chip: oq / `sat-blue-fill` | 5.12 | 5.12 |
| Tanlangan chip cheti / zich shisha | 4.73 (fill) | 6.80 (`sat-sky`; fill 2.86) |
| Hover fill: oq / `--rang-asosiy-toq` | 6.57 | 6.57 |
| Pill / hover fon (`sat-line`): `sat-text-muted` | 5.00 | 5.59 |
| Yulduz (tanlangan) / `sat-line` | 3.70 (fill) | 5.42 (sky) |
| Ko'rsatkich ikonka fill / zich sirt | 5.05 | 3.09 |

#### Savol ekranlari: SatSavol (PR 5c `ds-sat-savol`, 2026-11-23)

Manba: artifakt v15 `components/SatSavol`. Sahifalar: mashq sessiyasi (`/uz/sat/mashq/sessiya/`), Practice test (`/uz/sat/mashq/test/`), Kun savoli (`KunSavoli`, `/uz/sat/`), mock imtihon, takrorlash va musobaqa savollari (umumiy `SavolUslub.astro`), `SatFokus` qolipi. Faqat ko'rinish: xatti-harakat, kalitlar va matn o'zgarmagan.

- **Panel.** Savol, passage va natija faqat zich shishada: `sat-glass-strong`, 1px `sat-glass-border`, `radius-lg`, `shadow-glass`, `glass-backdrop`. Ichidagi variant, maydon va tugmalar tekis (ichma-ich blur yo'q). Foto fon zich shishasi ichida (Kun savoli, `/uz/sat/`) panel qattiq karta: `sat-surface`, `sat-line`, blursiz.
- **Variant.** Tekis, 1px `sat-line-strong`, `radius-lg`, min 44px; harf 36px doira, Sora 600. Hover (faqat sichqoncha) chet `sat-blue`, darhol. Tanlangan: chet va inset 1px `sat-blue-fill`, harf to'ladi (`sat-blue-fill` + oq). Holat yana `aria-checked` / `checked` bilan aytiladi.
- **Holatlar.** To'g'ri: fon `success-subtle`, chet `success-ui`, harf 2px `success-ui` halqa, ✓ belgi `success-text`. Xato: uzuq chet `sat-text`, matn ustidan chiziq, harf to'la `sat-text`, × belgi. Cross out: uzuq chet va xira matn. Natija sarlavhasi Sora, to'g'risi `success-text`; xabar so'z bilan (`aria-live`).
- **Ustki qator.** Savol raqami `sat-yorliq` uslubida (`sat-text-muted`), asboblar kapsula, faol holat `sat-line-strong` chet.
- **Tugma.** Tekshirish ko'k kapsula (`.t-tugma.sat-tugma--kok` yoki `.sk-asosiy`), panelda bitta; keyingi savol `.t-tugma`. Nofaol ko'k kapsula poydevordagi nofaol tugma kabi.
- **SatFokus.** `body` foni `sat-bg`, `main` = `.sat.t-fon` (5b token sohasi va nur dog'lari, nur xiraroq), ustki qator `sat-glass-strong` blursiz + `sat-line` chiziq, nom Sora, progress `sat-blue-fill`. Sessiya pastki qatori (sticky) zich shisha: savol paneli bilan yonma-yon, ichma-ich emas.
- **Zaxira.** `prefers-reduced-transparency` / `prefers-contrast: more` va blursiz brauzerda panel tekis `sat-surface` + `sat-line-strong`, ko'k kapsula tekis.
- **Kontrast.** 5b jadvalidagi zich shisha qiymatlari amal qiladi (`sat-text` 13.28+, `sat-text-muted` 6.37+, `sat-line-strong` 3.66+, oq / `sat-blue-fill` 5.12). Axe 4.14 (390/1280, yorug'/qorong'i, javobdan oldin va keyin): sessiya, test, Kun savoli, savol namunasi 0 buzilish.

### 4-qavat IELTS (PR 8 `ds-ielts-tokenlar`, 2026-11-23)

Manba: artifakt v15 `qavat-4-ielts.md`, `tokens.json` (`ielts-*`), `bundle.css` "4 · IELTS". Bu PR faqat tokenlar va stillar: IELTS sahifalari va komponentlari hali ishlatmaydi (u yerda Codex ishlayapti, muallif qarori). Hero, plitkalar, ko'rsatkich va ro'yxat keyingi PR'da.

- **Xarakter.** "Tungi ilova": qorong'i mavzuda navy sahna (`ielts-night`), yorug'da "tong" (`ielts-dawn`), shisha panellar, bitta elektr ko'k urg'u va hero obyekti ostida bitta nurli halqa. Sarlavha va raqam Lexend 600 (`--font-ielts`), oddiy harflar; matn Onest.
- **3 va 4-qavat ko'klari yaqin** (`floor-sat-500` / `floor-ielts-500` 1.57:1). Muallif qarori (2026-11-18): ikkalasi ko'k qoladi, farq shrift (Sora / Lexend), motiv (SAT plitka va tab bar / IELTS nurli obyekt va halqa) va qavat raqami bilan. Lift va binoda rang doim raqam bilan.
- **Tokenlar** (`tokens.css`, "4-qavat IELTS mini-DS"): primitiv `--color-ielts-night`, `-dawn`, `-ink`, `-on-accent` (oq); mavzuli `--color-ielts-bg`, `-glass`, `-glass-strong`, `-glass-border`, `-tile`, `-text`, `-text-muted`, `-accent` (yorug'da = `floor-ielts-500`), `-accent-text` (700 / 400), `-accent-display`, `-halo`, `-line`, `-line-strong`. Shisha filtri `--ielts-glass-backdrop` (blur + `saturate(1.5)`). Tipografiya `--text-ielts-hero-*` (32/40, ≥481px 40/48), `--text-ielts-h2-*` (24/32), `--text-ielts-raqam-*` (28/32, `tabular-nums`), `--text-ielts-birlik-*` (13/18, Onest 500). Nur poydevordagi `--color-floor-ielts-glow`.
- **Stillar** `src/styles/ielts.css` (`global.css` import qiladi): `.ielts-qobiq` (fon `ielts-bg`, matn `ielts-text`, `--nur` = IELTS nuri, `h1–h3` Lexend; `.t-fon` bilan ishlaydi), `.ielts-glass` (shaffof: qisqa matn, plitka, hero), `.ielts-glass-strong` (zich: uzun matn, ro'yxat, test, forma). DS dagi `.ielts` nomi olinmadi: `/uz/ielts/` kirishida `ielts` klassi allaqachon bor.
- **Matn qoidasi.** `.t-fon` nur dog'i ustida (shishasiz) faqat `ielts-text`. `ielts-text-muted`, `ielts-accent-text` va `ielts-line-strong` shishada; `line-strong` (chip, maydon cheti) va `accent` chegarasi shaffof shishada nur ustida 3:1 ga yetmaydi, shuning uchun ular zich shishada yoki tekis fonda. `ielts-accent-display` faqat 24px+. `ielts-accent` fill ustida doim `ielts-on-accent`. Urg'u rangi bitta (ikkinchi urg'u yo'q), halqa ekranda bitta.
- **Zaxira.** `backdrop-filter` yo'q brauzerda `.ielts-glass` zich bo'ladi; `prefers-reduced-transparency` / `prefers-contrast: more` da ikkala shisha zich, blursiz, chet `ielts-line-strong`.

**Kontrast (node, 2026-11-23).** Nur markazi: `.t-fon` dog'i blursiz, `floor-ielts-glow` × 0.9. Shisha ostida `saturate(1.5)`.

| Juftlik (yorug') | Fon tekis | Nur markazi | Shaffof / fon | Shaffof / nur | Zich / fon | Zich / nur |
| --- | --- | --- | --- | --- | --- | --- |
| `ielts-text` | 16.35 | 7.29 | 17.27 | 12.34 | 17.80 | 16.10 |
| `ielts-text-muted` | 6.01 | 2.68 | 6.34 | 4.53 | 6.54 | 5.91 |
| `ielts-accent-text` | 7.30 | 3.26 | 7.71 | 5.51 | 7.95 | 7.19 |
| `ielts-accent-display` (24px+) | 4.99 | 2.23 | 5.27 | 3.77 | 5.43 | 4.91 |
| `ielts-line-strong` (3:1) | 3.56 | 1.59 | 3.76 | 2.69 | 3.87 | 3.50 |
| `ielts-accent` chegara (3:1) | 4.99 | 2.23 | 5.27 | 3.77 | 5.43 | 4.91 |

| Juftlik (qorong'i) | Fon tekis | Nur markazi | Shaffof / fon | Shaffof / nur | Zich / fon | Zich / nur |
| --- | --- | --- | --- | --- | --- | --- |
| `ielts-text` | 16.23 | 8.95 | 13.64 | 8.59 | 15.27 | 14.61 |
| `ielts-text-muted` | 8.63 | 4.76 | 7.25 | 4.57 | 8.12 | 7.77 |
| `ielts-accent-text` | 8.64 | 4.76 | 7.26 | 4.57 | 8.13 | 7.78 |
| `ielts-accent-display` (24px+) | 6.71 | 3.70 | 5.63 | 3.55 | 6.31 | 6.04 |
| `ielts-line-strong` (3:1) | 3.81 | 2.10 | 3.20 | 2.02 | 3.58 | 3.43 |
| `ielts-accent` chegara (3:1) | 3.85 | 2.12 | 3.23 | 2.04 | 3.62 | 3.47 |

`ielts-on-accent` / `ielts-accent`: yorug' 5.51, qorong'i 4.69. Foto fon (`QavatFoto`) ustidagi kontrast IELTS sahifalari yangi ko'rinishga o'tganda o'sha PR'da hisoblanadi.

### 2-qavat Top Admission (PR 7 `ds-top-admission`, 2026-11-23)

Manba: artifakt v15 `qavat-2-top-admission.md`, `tokens.json` (`adm-*`), `bundle.css` (`.adm-*`). Hamma `/uz/top-admission/` sahifalari (16 ta) shu ko'rinishda. Til issiq va jasoratli: krem / issiq qora, bitta to'q sariq urg'u, Onest 800 sarlavha.

- **Doira `.adm`.** `BolimQobiq` dagi `<main>` `bolim="top-admission"` da `adm` sinfini oladi. Stil `src/styles/adm.css` da, uni faqat Top Admission sahifalari (va `Adm*` komponentlari) import qiladi. Doira poydevor va eski nomli tokenlarni (`--color-bg`, `--color-surface`, `--color-text-*`, `--color-link`, `--btn-*`, `--card-*`, `--fon`, `--matn`, `--chiziq*`, `--rang-*`, `--floor-*`) 2-qavat qiymatiga almashtiradi. Shuning uchun eski sahifa CSS'i ham krem/qora/to'q sariq tusni oladi. Sahifa foni `adm-bg`, studio gradienti 2-qavatda yo'q. Foto fonli kirishda `main` shishasi `adm-foto-shisha`.
- **Tokenlar** (`tokens.css`, "2-qavat Top Admission mini-DS"): `--color-adm-ink`, `-cream`, `-ember`, `-orange` (= `floor-admission-500`), `-on-accent`; mavzuli `-bg`, `-surface`, `-sunken`, `-chip`, `-glass(-strong, -border)`, `-text`, `-text-muted`, `-accent`, `-accent-display`, `-accent-text`, `-on-accent-text`, `-accent-subtle`, `-line`, `-line-strong`, `-foto-shisha`. Tipografiya `--text-adm-hero-*` (36–96, `12.5cqi`), `--text-adm-h1-*` (36/40, ≥720px 48/52), `--text-adm-h2-*` (32/36, ≥720px 44/48, 500), `--text-adm-eyebrow-*`, `--text-adm-raqam-*` (44). DS'dan farq: qorong'i `adm-line-strong` `#8A7A6F` (DS `#6E5F55` sirtda 2.57 edi); `adm-surface`, `-sunken`, `-chip`, `-accent-subtle`, `-on-accent-text`, `-foto-shisha` DS'da yo'q (tekis zaxira va eski sinflar uchun).
- **Sinflar.** `.adm-shisha` (blur bilan, qisqa matn), `.adm-shisha--zich`, `.adm-karta` (zich, blursiz: uzun matn, ro'yxat), `.adm-ichki` (karta ichidagi tekis qator), `.adm-h1`, `.adm-h2`, `.adm-urgu` (faqat 24px+ qalin), `.adm-eyebrow` (oldida 24px to'q sariq chiziq), `.adm-chip` (to'q sariq fill, qora matn), `.adm-chip--sust`, `.t-tugma.adm-tugma--urgu`.
- **Komponentlar** (`src/components/topAdmission/`):
  - `AdmHero`: `.t-fon` ustida zich shisha panel, katta harfli sarlavha va urg'u so'z, 1–2 kapsula. `katta={false}`: ichki sahifa sarlavhasi (`adm-h1`). DS'dan farq: panel zich (nur dog'i markazida shaffof shishada urg'u so'z 2.68 bo'lardi).
  - `AdmPlitka`: bo'lim plitkalari, chiziqli ikonka, joriy `aria-current="page"`. Faqat mavjud sahifalar.
  - `AdmMuddat`: zich shisha muddat kartasi. Sana `taChiptalar.ts` (`deadline.ts`) dan, manba va tekshirilgan sana `manbalar.ts` dan. Qolgan kun `muddatHolati` (Toshkent kuni): "N kun qoldi", "Bugun tugaydi", "Tugadi", ochilishdan oldin "Ochilishi kutilmoqda". JS'siz "20-fevral oxirgi kun". Ota-elementda `data-adm-tartib` bo'lsa tugagan karta oxiriga tushadi.
  - `AdmRoyxat`: haqiqiy checkbox qatorlar (52px), belgilangani to'q sariq fill. Holatni sahifa skripti boshqaradi (kurs darsidagi tekshiruv mezonlari, kalit o'zgarmagan).
  - `AdmTekshirildi`: "Tekshirilgan: sana" chipi (ekran o'quvchiga "Rasmiy manbada tekshirilgan"). Eski muhr o'rnida.
- **Olib tashlandi** (v1, muallif DS'da rad etgan): muhr (shtamp), chipta, MRZ lentasi, viza kartasi va katakli to'r, kirishdagi yo'l xaritasi. Faktlar, sanalar, manbalar va matn o'zgarmagan.
- **Matn qoidasi.** Uzun matn (darslar, namunalar, qo'llanmalar, grant qo'llanmasi) `.adm-karta` ichida. To'q sariq yorug' fonda kichik matn sifatida ishlatilmaydi: kichik to'q sariq matn va havola faqat `adm-accent-text` (tagi chizilgan), `adm-accent` faqat fill, `adm-accent-display` faqat 24px+ qalin. Oq matn to'q sariqda yo'q. Ikkinchi urg'u rangi yo'q: havola ham to'q sariq matn rangida.
- **Zaxira.** `prefers-reduced-transparency` / `prefers-contrast: more`: shisha va kartalar tekis `adm-surface` + `adm-line-strong` chet, foto ustidagi `main` shishasi tekis `adm-bg`, urg'u kapsula tekis to'q sariq.

**Kontrast (node, 2026-11-23).** Nur dog'i markazi: `floor-admission-glow` × 0.9, blursiz.

| Juftlik | Yorug' | Qorong'i |
| --- | --- | --- |
| `adm-text` / `adm-bg` | 17.53 | 17.05 |
| `adm-text-muted` / `adm-bg`, zich shisha / nur | 6.29, 6.39 | 8.10, 6.33 |
| `adm-accent-text` / `adm-bg`, `adm-sunken`, `adm-accent-subtle` | 5.11, 4.58, 4.58 | 9.03, 7.92, 6.92 |
| `adm-accent-display` / zich shisha nur ustida (24px+) | 3.27 | 5.70 |
| `adm-on-accent` / `adm-accent` | 6.26 | 7.50 |
| `adm-on-accent-text` / `adm-accent-text` | 5.70 | 9.29 |
| `adm-line-strong` / `adm-surface`, zich shisha | 3.82, 3.76 | 3.81, 3.92 |
| Foto ustida `main` shishasi (eng yomon piksel): `text-muted`, `accent-text`, `line-strong` | 5.58, 4.53, 3.04 | 8.18, 7.21, 3.47 |

### 5-qavat EYUF (PR 9 `ds-eyuf`, 2026-11-23)

Manba: artifakt v15 `qavat-5-eyuf.md`, `tokens.json` (`eyuf-*`), `bundle.css` "5 · EYUF", `components/Eyuf*`. Hamma `/uz/eyuf/` sahifasi yangi ko'rinishda.

- **Tokenlar** (`tokens.css`, "5-qavat EYUF mini-DS"): primitiv `--color-eyuf-night`, `-ivory`, `-ink`, `-on-accent`; mavzuli `--color-eyuf-bg`, `-bg-deep`, `-surface` (zich shishaning noshaffof zaxirasi), `-glass`, `-glass-strong`, `-glass-border`, `-tile`, `-text`, `-text-muted`, `-accent`, `-accent-hover`, `-accent-text`, `-gold`, `-gold-line`, `-halo`, `-line`, `-line-strong`. Tipografiya `--text-eyuf-hero-*` (34/40, ≥640px 40/46, ≥1280px 56/62), `--text-eyuf-h1-*`, `--text-eyuf-h2-*` (26/32), `--text-eyuf-raqam-*` (40/44); o'lcham `--size-eyuf-doira`, `-qator`, `-halqa`. Shrift `--font-eyuf` (Playfair Display 600, raqam `lining-nums tabular-nums`).
- **Qavat qatlami** (`src/styles/eyuf.css`, faqat EYUF sahifalari import qiladi): `html:root[data-floor="5"]` da poydevor tokenlari (`--color-bg`, `-surface`, `-text-*`, `-border*`, `-link`, `-focus-ring`, `-action-primary-*`, `-glass-*`, `--floor-text`) eyuf-* ga o'tadi. Shuning uchun mavjud forma, test va panel kodi o'zgarmasdan palitrani oladi. Sarlavhalar (`main h1–h3`) Playfair; ro'yxat qatori sarlavhasi Onest.
- **Sirtlar.** `main` foto ustida zich shishada (`QavatFoto`), shuning uchun uning ichidagi panellar tekis zich (`eyuf-glass-strong`, blur yo'q): `.eyuf-panel`, `.eyuf-panel-zich`, IQ ekranlari. Shisha (`.t-shisha`) faqat noshaffof sahnada `.eyuf-sahna.t-fon` (hero). Forma, test, savol va uzun matn faqat zich sirtda.
- **Komponentlar** (`src/components/eyuf/`): `EyufHero` (sahna + shaffof shisha; `obyekt` bilan oltin orbita, ekranda bitta; `ixcham` ichki sahifa sarlavhasi), `EyufBosqich` (oltin serif raqamli kartalar, holat chipi so'z va ikonka bilan, joriy `aria-current`; `zich` sahnadan tashqarida), `EyufRoyxat` (zich panelda 64px qatorlar, 44px doira ikonka, holat so'zi, chevron), `EyufTayyorlik` (halqa `--ulush` 0–100 va bandlar; IQ natijasida dinamik), `EyufIkonka`, `EyufYulduz`. Tugma: urg'u `.t-tugma.eyuf-tugma--urgu` (sahifada bitta), ikkinchi `.t-tugma--ikkinchi` (sahnada oltin chet), sahifa ichidagi eski `.tugma-asosiy` zumrad fill.
- **Matn qoidasi.** Shaffof shishada va sahnada faqat `eyuf-text` (`eyuf-text-muted` qorong'ida 4.21). Oltin faqat serif raqam, kursiv urg'u (24px+) va bezak chizig'i; tugma, havola yoki holat rangi emas. Fokus `eyuf-accent-text`.
- **Zaxira.** `prefers-reduced-transparency` / `prefers-contrast: more`: panellar `eyuf-surface` + `eyuf-line-strong` chet, urg'u kapsula tekis `eyuf-accent`.

**Kontrast (node, 2026-11-23).** Eng yomon holat: sahna nur dog'i markazi (`floor-eyuf-glow` × 0.9, blursiz); `main` foto ustida (foto pikseli qora yoki oq). Yorug' / qorong'i.

| Juftlik | Sahna nur markazi | Shaffof shisha / nur | Zich panel / main | Main (foto) |
| --- | --- | --- | --- | --- |
| `eyuf-text` | 7.96 / 7.86 | 12.73 / 7.63 | 17.21+ / 14.33+ | 12.45+ / 9.40+ |
| `eyuf-text-muted` | 3.16 / 4.34 | 5.06 / **4.21** | 6.84+ / 7.92+ | 4.95+ / 5.19+ |
| `eyuf-accent-text` (havola, fokus) | 2.90 / 4.96 | 4.64 / 4.82 | 6.27+ / 9.05+ | 4.53+ / 5.93+ |
| `eyuf-gold` | 2.52 / 5.28 | 4.03 / 5.12 | 5.45+ / 9.62+ | 3.94+ / 6.31+ |
| `eyuf-line-strong` (maydon cheti) | 1.86 / 1.93 | 2.97 / 1.87 | 4.02+ / 3.51+ | 2.91+ / 2.31+ |

`eyuf-on-accent` / `eyuf-accent` 5.34 / 5.13 (hover 6.73 / 6.50). Shundan: maydon cheti va holat chipi ma'noli bo'lsa faqat zich panelda; sahnada matn faqat `eyuf-text`.

## Harakat

- Davomiylik (2026-11-13): `--duration-fast` 150ms, `--duration-base` 200ms, `--duration-slow` 200ms, `--duration-stagger` 50ms. Hamma harakat 120–200ms.
- Faqat `transform` va `opacity` animatsiya qilinadi. Rang, fon, chegara, soya, `width`, `height` darhol almashadi. `transition: all`, doimiy `will-change` va cheksiz animatsiya (pulse, shimmer, glow, skeleton, spinner) yo'q.
- Hover faqat `@media (hover: hover) and (pointer: fine)` ichida. Telefonda faqat `:active` (`--bosilish` = `scale(0.97)`).
- Egri: `--ease-enter` (kelish, yonish), `--ease-exit` (ketish, o'chish), `--ease-state` (hover, bosish, holat).
- **Reduced motion**: `prefers-reduced-motion: reduce` da DS davomiylik tokenlari 0ms va `--motion-distance` 0 (siljish yo'q). `global.css` qo'shimcha ravishda hamma transition va animatsiyani o'chiradi. Bino yonishi, Lift paneli va "2 → 3" ko'rsatkichi animatsiyasiz.
- PR #76 dagi eski nomlar DS ga ulangan: `--harakat-tez` = `--duration-fast`, `--harakat-orta` = `--duration-base`, `--harakat-sekin` = `--duration-slow`, `--harakat-egri` = `--ease-enter`, `--kotarilish` = `translateY(--card-lift)`, `--bosilish` = `scale(--btn-press-scale)` (0.97, reduced motion'da 1; `hover: none` da `--kotarilish` none). Umumiy transition (`a`, `button`, `summary`, `.variant`: faqat `transform`, `opacity`, 150ms) `global.css` da.

## Komponentlar

- **Fokus halqasi** (DS): `--focus-ring-width` 2px `--color-focus-ring` + 2px `--color-focus-gap` oraliq. Global `a`, `button`, `summary` da `outline` + oraliq `box-shadow` (outline forced-colors rejimida ham ko'rinadi). Komponentlardagi maxsus fokus ham `outline: var(--focus-ring-width) solid var(--color-focus-ring)`.
- **Tugma** (yagona komponent, `global.css`, 2026-11-13): 48px (`--control-height-md`), pill (`--btn-radius`), `--text-button-*`, matn bir qatorda (480px dan torda sig'masa sinadi, gorizontal scroll yo'q). Uch variant:
  - **Asosiy** (`.tugma.tugma-asosiy`): to'liq `--btn-primary-*` fon. Yorug'da neutral-900, qorong'ida neutral-50, matn teskari. Soya yo'q.
  - **Ikkinchi** (`.tugma.tugma-ikkinchi`, variantsiz `.tugma` ham): `--btn-secondary-*`, 1px chegara.
  - **Matn** (`.tugma.tugma-matn`): havola ko'rinishi, `--color-link`, tagiga chizilgan, 44px.
  - Holatlar: hover (faqat sichqoncha; fon bir pog'ona o'zgaradi), active (`scale(0.97)`), focus-visible (global fokus halqasi), disabled (`--btn-disabled-*`), loading (`aria-busy="true"` + `disabled`: statik halqa belgisi, rang o'zgarmaydi, aylanmaydi).
  - Eski sahifa klasslari shu variantlarga ulangan (ko'rinish faqat `global.css` da, sahifada faqat joylashuv): asosiy = `.katta.asosiy`, `.katta.qora`, `.katta-tugma.asosiy`, `.katta-tugma.oq`, `.tugma-l.kok`, `.asosiy-tugma`, `.kun-asosiy`, `.tolov-tugma`, `.uzaytir`, menyudagi `a.boshlash`; ikkinchi = `.katta`, `.katta-tugma`, `.tugma-l`, `.ikkinchi-tugma`, `.chiziq-tugma`, `.kun-tugma`, `.qora-tugma`; matn = `.matn-tugma`. Yangi kodda faqat `.tugma` + variant klassi.
  - **Qora karta ichida** (`.qora-kontekst` konteynerda): asosiy oq pill (`--qora-matn` fon, `--qora` matn), ikkinchi oq chegarali, matn oq.
  - Toggle va ikonka tugmalari (`.kichik-tugma`, `.chip`, `.segment`, `.belgi-tugma`, Lift raqamlari) CTA emas, o'z ko'rinishida qoladi.
  - Telefonda katta tugmalar to'liq kenglik. Havola bo'lsa `<a>`, amal bo'lsa `<button>`.
- **Variant tugmasi** (test javobi): 2px chegara, `--r-orta`, chapga tekislangan matn, balandlik 56px. Tanlangani `--floor-subtle` fon va `--floor-ui` chegara.
- **DS link karta** (`.ds-karta`, `global.css`): `--card-bg`, 1px `--card-border`, `--card-radius`, statik `--card-shadow`. Hover (faqat sichqoncha): `translateY(--card-lift)`, soya o'zgarmaydi; bosilganda `scale(0.97)`. Kartada `data-floor` = **borilayotgan qavat**; urg'u `.ds-karta-belgi` (ikonka yoki strelka `--floor-ui` doirada). Ishlatilgan: bosh sahifa bo'lim kartalari, `Zina`, `QavatlarAro`. Besh bo'lim kartasi bir xil (alohida qora karta yo'q).
- **Yorliq (pill)** (`.yorliq`, DS badge): 24px, `--radius-full`, `--text-caption-*`. "Tez orada" = `--sirt-ikkinchi`.
- **Progress**: 8px (`--progress-height`), `--radius-full`, to'ldirish `--floor-ui`.
- **Qora sahna**: `--qora` fon, matn `--qora-matn` (ikkala mavzuda oq), ikkinchi matn `--qora-matn-ikkinchi`. Ichidagi ko'k ta'kid `--rang-asosiy-qorada` (brand-300).
- **SAT bo'limi dizayni** (2026-11-04): asos `Tayanch-SAT-dizayn.md` (Claude Design kanvasi, 6 ekran: Main, Mashq, Telefon, Natijalar, Lug'at, Savol banki). Ekranlardagi savol, so'z va raqamlar namuna, saytga qo'yilmaydi. Hammasi qo'llangan: yon panel, SAT kirishi (hero, qora "Imtihon tuzilmasi" kartasi CB03 raqamlari bilan, 3 qadam, sahifalar guruhlari), telefon ko'rinishi, Mashq testi va Lug'at (yon panelsiz "fokus" qolipi `SatFokus`), Savol banki, Mening natijalarim. Namuna savollar va so'zlar `src/data/satNamuna.ts` da, ekranda "Namuna" deb belgilangan. Natijalar haqiqiy javoblarni ko'rsatadi; javob bo'lmasa namuna chiqadi va "Namuna ma'lumot" yorlig'i turadi.
  - SAT kirishi vizual qatlami (2026-11-11, branch `vizual-sat`): "Test structure" qora kartasida modul vaqt chizig'i (bo'lak uzunligi CB03 daqiqalariga mutanosib, `--floor-ui`, `--progress-height`, `aria-hidden`; karta ko'ringanda bir marta to'ladi, reduced motion yoki JS'siz darhol to'liq). "Where will you start?" qadamlarida `--floor-ui` doiradagi ikonka va ularni ulovchi 2px `--color-border` chiziq. "Where the SAT counts" telefonda (≤640px, JS bilan) ixcham: sarlavha qatori `<button aria-expanded>`, matn va havola ochilganda; kengroq ekranda yoki JS'siz hammasi ochiq, holat saqlanmaydi. Telefonda bolalar tartibi `order` bilan: Zina va kun savoli h1 dan keyin.
  - Yon panel qatori: 44px, `--r-yon` (md), faol qator `--floor-ui` fon va `--floor-ui-text`, ikonkalar `--floor-ui`. Guruhlar (2026-11-13, rekonstruksiya 1-bosqich, muallif tanlovi): birinchi havola "Today" (bo'lim kirishi), keyin Practice, Learn (Guides, Math lessons, Reading & Writing lessons kichik sarlavhalari bilan), Progress, Plan, Account. Har sahifada ikonka bor; hali yozilmagan sahifalar yon panelda yo'q ("Coming soon" guruhi olib tashlandi, URL "tez orada" sahifasini ko'rsatadi).
  - SAT "Today" bloki (`SatBugun`, 2026-11-13): faqat kirgan o'quvchiga (`SatKirganBelgi` sahifa chizilishidan oldin `<html data-sat-kirgan>` qo'yadi; tanishtiruv qismi yashirinadi, h1 ekran o'quvchiga qoladi). Chapda bitta asosiy qadam kartasi (`--card-*`, bitta `.tugma-asosiy`), o'ngda ko'rsatkichlar paneli (`<dl>` qatorlari, 44px, 1px chiziq bilan ajratilgan; uchta bir xil karta emas) va zaif ko'nikmalar. ≤52rem bir ustun; yangi o'quvchida panel yashirin. Yuklanishda skelet, xatoda ogohlik juftligi va "Try again". Ma'lumot `satYonGuruhlar` (`satSahifalar.ts`); SAT kirish sahifasi `satGuruhlar` ni ishlatadi. Bu yerdagi kichik tugmalar 44px (`--size-touch-min`).
- **IELTS bo'limi dizayni** (2026-11-05): asos `Tayanch-IELTS-dizayn.md` (7 ekran: kirish, Reading qo'llanma, 30 kunlik reja; har biri telefon varianti bilan). SAT'dan farqlari: yon panel qatori 48px va `--r-orta`, matn 16px; "tez orada" bandlar havola emas (kulrang ikonka va yorliq, Tab bilan o'tilmaydi); logo radiusi `--r-kichik`; pastda Telegram bandi. Sahifadagi yagona soya: kirishda reja kartasi, qo'llanmada mini-mashq, rejada savol kartasi. "Manbalar va tekshiruv" bloki `ManbaBlok`. Kvadrat qavsdagi joylar rasmiy manbadan to'ldirildi (IE01–IE03, ID01); tekshirib bo'lmaganlari "tekshirilmoqda" deb qoldi.
  - IELTS kirishi vizual qatlami (2026-11-11, branch `vizual-ielts`): "To'rt bo'lim" qora kartasida davomiylik chizig'i (to'liq uzunlik = eng uzun bo'lim, IE01 daqiqalari; oraliq vaqt, masalan Speaking 11–14, `--floor-ui-toq` bo'lak bilan; `aria-hidden`; karta ko'ringanda bir marta, qatorlar `--duration-stagger` bilan; reduced motion yoki JS'siz darhol to'liq). Qo'llanmasi bor bo'lim qatori (Reading) havola; havolasiz qatorlarda ham strelka joyi qoldiriladi, chiziqlar bir shkalada. "Qayerdan boshlayman?": 1px `--color-border` chegara, raqam doiralari ulovchi chiziq bilan; telefonda raqam sarlavha qatorida, tavsif to'liq kenglikda, chiziqsiz. "Qo'llanmalar"da telefonda (≤640px, JS bilan) tez-oradagi bandlar `<button aria-expanded>` ostida yig'iladi; holat saqlanmaydi.
- **Bo'lim yon paneli** (`BolimYon`, `bolim="sat" | "ielts"`, qolip `BolimQobiq`): 1024px va undan kengda chapda doimiy (`--yon-kenglik` 288px), yig'ilganda `--yon-yigilgan` 72px. Undan torda sticky ustki qator (zich fon) va undagi hamburger tugmasi panelni chapdan chiqaradi: Esc yopadi, fokus panel ichida qoladi, qolgan sahifa `inert`. Pastda "Tayanch bosh sahifasi" havolasi va mavzu tugmasi.
- **Tayanch binosi** (2026-11-05, muallif qarori): sayt 5 qavatli bino. 1 Navigator (`/uz/`), 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Ma'lumot `src/data/qavatlar.ts` (2–5 qavat holati `bolimlar.ts` dan), `joriyQavat(pathname)`.
- **Shisha bino** (`Bino.astro`, DS `heroSVG`): bosh sahifa hero'sida, sochilgan yorliqlar uning atrofida. Server tomonda chiziladi (JS'siz), `aria-hidden`, ikonkalar `qavatlar.ts` dan, raqamlar "01" ko'rinishida. Geometriya, gradientlar, filtrlar va CSS DS dan o'zgarishsiz. `aktiv` qavat yonib turadi (bosh sahifada 1). Sahifadagi `[data-bino-yoq="N"]` elementga (qavat kartalaridagi havola yoki tugma) hover yoki fokus kelsa, o'sha qavat yonadi (CSS `:has()`); reduced motion'da animatsiyasiz.
- **Qavatlar ro'yxati** (2026-11-19 dan; oldin `Lift.astro`, 2026-11-15 "Unify navigation"): ustki qatordagi Lift ("Floor 3 · SAT prep / Floors") olib tashlandi, muallif uni ortiqcha deb topdi. Qavatlar endi hamburger panelida (`BolimYon`) "Qavatlar"/"Floors" guruhida: raqam doirasi + nom, joriy qavat `aria-current="location"` (qalin, sust fon), "tez orada" yorlig'i, Suhbatdosh. Panel o'ng tomondan, tugma tagidan ochiladi. Mavzu tugmasi faqat ustki qatorda. Qavat yo'li qavat kirish sahifasida ko'rsatilmaydi.
- **Telefon pastki paneli** (2026-11-15 da olib tashlangan; 2026-11-23 da faqat SAT'da qaytdi): pastki Lift yo'q, bo'lim navigatsiyasi hamma ekranda ustki qatordagi hamburger panelida (`BolimYon`). SAT'da <720px da qo'shimcha `SatTabBar` ("Qavat mini-DS'lari" → 3-qavat SAT). Asos: ADR 005 (`docs/qarorlar/005-qavat-ds.md`), muallif 2026-11-18 da 12 PR'lik DS rejasini (5d SatTabBar ichida) tasdiqlagan, 2026-11-23 da qarorlarni boshqaruvchi chatga topshirgan. Tab bar hamburger panel, Lift va hisob bandini almashtirmaydi.
- **Qavat yo'li** (`QavatYoli.astro`): SAT'da yon panel guruhidagi sahifaning guruh nomi `satYonGuruhlar` dan olinadi ("Plan › Study planner", "Learn › Math lessons"), sahifa bergan `yol` dan emas: yo'l satri va panel guruhi ajralib ketmaydi. Guruhda yo'q sahifalar (sessiya, mock imtihon, huquqiy) o'z bandlarini saqlaydi.
- **Qavat yo'li** (`QavatYoli.astro`): sahifa tepasida "3-qavat › Mashq › Test"; oxirgi band havola emas (`aria-current="page"`). 1-qavat bosh sahifasida yo'q.
- **Zina** (`Zina.astro`): qavat kirish sahifasi pastida qo'shni qavatlarga ikki DS link karta (pastga chapda, yuqoriga o'ngda). 5-qavatda faqat pastga. 1-qavat bosh sahifasida yo'q (2026-11-13, N2: qavat kartalari hero ostida).
- **Qavatlar orasidagi yo'l** (2026-11-09, dizayn rejasi B 4-bosqich, muallif tanlovi):
  - Bosh sahifa (2026-11-13, N2): bitta kirish yo'li. Hero'da sarlavha, bitta izoh va bitta asosiy tugma "Boshlash" (Navigator onboarding dialogini ochadi; to'liq profil bo'lsa yo'l xaritasiga o'tkazadi). Dialog o'zi ochilmaydi. Hero ostida darhol qavat kartalari (`#qavatlar`, 2x2, 760px dan torda 1 ustun): DS karta, qavat rangidagi ikonka doirasi, nom, tavsif, `bolimlar.ts` dagi `xususiyatlar` (ko'pi bilan 3, belgi qavat matn rangida), ochiq qavatda keng asosiy tugma "<Nom>'ni boshlash", tez-oradagida "Tez orada" yorlig'i (nom baribir qavat sahifasiga havola). Kartada bitta fokus nuqtasi: havola `::after` bilan butun kartani qoplaydi. Menyuda "Yo'nalishlar" → `#qavatlar`, "Boshlash" → `/uz/?boshlash=1` (`data-boshlash`; bosh sahifaning o'zida qayta yuklamay dialogni ochadi). Maqsad testi (`MaqsadTesti`) olib tashlangan.
  - "Boshqa qavatda" (`QavatlarAro.astro`, ma'lumot `src/data/qavatlarAro.ts`): dars oxirida (`DarsQolip`, `modul` bo'yicha) va Topshirish yo'li oxirida DS link karta: yorliq "4-qavat · IELTS prep" (strelka yuqori/past, qavat rangidagi doirada), nom, izoh. Matn manba sahifa tilida; nom boshqa tilda bo'lsa `nomiTili`. Faqat saytda bor sahifalarga, fakt yozilmaydi.
- **Top Admission: pasport/viza detallari** (maket, 2026-11-05: Claude Design "Tayanch Top Admission maketi", https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF; A kirish, B Türkiye Bursları, C Topshirish yo'li, D lift; yorug' va qorong'i). Detallar ma'no tashiydi, bezak emas; hammasi CSS/SVG, rasmsiz (pasport surati, bayroq, gerb yo'q). Urg'u rangi 2-qavatniki (`--floor-ui`).
  - **Muhr**: 58–92px doira, 2px uzuq urg'u chegara + ichki 1.5px halqa, -8° burilgan, ichida "TEKSHIRILGAN" va sana. Faqat rasmiy manbada tekshirilgan faktda. Tekshirilmaganida muhr yo'q, o'rniga ogohlik rangidagi "tekshirish kerak" yorlig'i.
  - **Chipta**: faqat muddat kartalari. 1.5px qora chegara, `--r-orta`; o'ng "korishok" (150px, telefonda 96px) uzuq chiziq bilan ajratilgan, chegarasida tepa va pastda yarim doira teshik. Chapda sana katta (900), korishokda qolgan kun.
  - **Viza sahifasi**: yo'nalish sahifasi boshidagi karta, 24px katakli nozik to'r (`--sirt-ikkinchi`), chap yuqorida davlat kodi ("UZ → TR", urg'u, 900), 2×2 maydon: Dastur, Daraja, Ariza oynasi, Manba.
  - **MRZ qatori**: faqat sahifa oxiri blokida, `--fon-ikkinchi` lentada ikki qator `TAYANCH<<TOP<ADMISSION<<<…`, Onest 700, harf oralig'i 0.22em, `aria-hidden`. Shaxsiy ma'lumot yo'q.
  - **Savol progressi** (Topshirish yo'lidagi 3D zinapoya: ust `--floor-ui`, old `--floor-ui-toq`, yon `--floor-ui-chuqur`) va **Zina** (qavatlar orasidagi kartalar) har xil ko'rinadi va har xil yozilgan; ularni adashtirmaslik kerak.
  - **Kirish sahifasi vizual qatlami** (2026-11-12, branch `vizual-top-admission`): hero o'ngida yo'l xaritasi SVG (bezak, `aria-hidden`): katakli to'r ustida "UZ" doirasidan sahifadagi yo'nalish kodlariga chiziqlar; yaxlit chiziq = yo'nalish sahifasi bor (TR), uzuq = tez orada; muhrsiz (muhr faqat tekshirilgan faktda); telefonda yo'q. Vosita kartasidagi chiplar JS bilan `<button aria-pressed>` (44px, guruh `role="group"`): tanlov Topshirish yo'li kalitiga vosita formatida yoziladi, "Mening yo'lim" va 3D zinapoyadagi pog'ona (`--floor-ui`) darhol yangilanadi; JS'siz statik yozuv. Telefonda 3D zinapoya yo'q. Tez-oradagi yo'nalishlar bitta ixcham uzuq chegarali qator. Chiptada "Kalendarga qo'shish": build vaqtida yaratiladigan statik `.ics` (`/uz/top-admission/kalendar/<id>.ics`, butun kunlik, 1 kun oldin eslatma; matn `taChiptalar.ts` dan).
  - Topshirish yo'lida asosiy yo'l kartasi qora (qorong'ida `--fon-ikkinchi` + 2px `--rang-havola` chegara); kartaning orqa yuzi pasport sahifasi (to'r fon, muhrli faktlar, "tekshirish kerak" yorliqlari).
- **Hisob va to'lov sahifalari** (2026-11-08, ADR `docs/qarorlar/001-hisob-tolov-server.md`). Umumiy kirish va profil 1-qavatda (o'zbekcha), SAT tarif sahifalari inglizcha. Yangi rang yo'q, faqat mavjud tokenlar (yagona istisno: Google tugmasi, pastda). Qizil yoki yashil ta'kid taqiqi bu yerda ham amal qiladi: xato ham, muvaffaqiyat ham rang bilan emas, matn va ikonka bilan aytiladi.
  - **Forma maydoni**: ko'rinib turadigan `<label>` maydon ustida (placeholder yorliq o'rnini bosmaydi). Balandlik kamida 48px, `--sirt` fon, 2px `--chiziq-maydon` chegara (`--chiziq-kuchli` emas: u 3:1 ga yetmaydi), `--r-orta`, matn `--matn-asosiy`. Fokus: DS fokus halqasi. To'g'ri `type` va `autocomplete` (`email`, `current-password`, `new-password`). Yordamchi matn maydon ostida `--matn-ikkinchi`, `aria-describedby` bilan bog'lanadi.
  - **Xato xabari**: maydon ostida, ogohlik juftligi (`--rang-ogoh-fon` / `--rang-ogoh-matn`), `--r-kichik`, ogohlik ikonkasi (inline SVG) va matn. Maydonga `aria-invalid="true"` va `aria-describedby`. Forma yuborilganda xatolar ro'yxati tepada `role="alert"` bilan, fokus unga o'tadi. Xato faqat rang bilan ko'rsatilmaydi. Matn nima qilishni aytadi ("Email manzilida @ belgisi yo'q"), aybdor qilmaydi.
  - **Parol maydoni**: forma maydoni qoidalari + "Ko'rsatish" / "Show" tugmasi (`<button type="button">`, `aria-pressed`, maydon ichida o'ngda, 48px). Talablar (uzunlik) maydon ostida oldindan yoziladi. Nusxa qo'yish (paste) taqiqlanmaydi.
  - **Google tugmasi** (`GoogleTugma.astro`, P03B, 2026-11-09; muallif tasdiqlagan istisno): Google brend qoidalari bo'yicha (developers.google.com/identity/branding-guidelines, tekshirildi 2026-11-09), sayt palitrasidan tashqari. Rangli standart G logosi rasmiy SVG'dan o'zgarishsiz (monoxrom taqiq), 20px, matndan oldin. Ranglar faqat shu tugmada, `--google-*` tokenlari: yorug'da fon `#FFFFFF`, 1px chegara `#747775`, matn `#1F1F1F`; qorong'ida `#131314`, `#8E918F`, `#E3E3E3`. Kontrast: matn 16.5:1 / 14.5:1, chegara karta ustida 4.5:1 / 5.9:1. 48px, to'liq yumaloq (`--r-toliq`), to'liq kenglik, logo va matn orasi 10px. Hover: `--google-hover` holat qatlami (ichki soya; Google qiymati emas, o'zimizniki). Fokus: saytning umumiy fokus halqasi. Matn "Google bilan davom etish" (Google'ning "Continue with Google" varianti; o'zbekcha tarjima muallif tekshiradi). **Og'ish**: shrift Google Sans Medium 14/20 emas, sayt shrifti 500, `--matn-asosiy` (sayt tugmalari bilan bir xil o'lcham; brend qoidasidan kichik og'ish, muallif tasdiqlagan). Bosilganda "Kuting…" va o'chiq; Google'dan "Orqaga" bilan qaytilsa (`pageshow`) tiklanadi.
  - **Kvota ko'rsatkichi** (Free tarifda): Progress komponenti (8px, `--r-toliq`, to'ldirish `--floor-ui`) + matn "ishlatilgan / jami" ko'rinishida (kvota raqamlari hali belgilanmagan). Kvota tugaganda rang o'zgarmaydi; ostida matn va Pro tariflar sahifasiga `<a>` havola. `role="progressbar"` bilan `aria-valuenow`/`aria-valuemax` yoki oddiy matn.
  - **To'lov usuli tugmasi** (Click, Payme, UzCard/HUMO): radio guruhi sifatida (`<fieldset>` + `<legend>`, har biri `<input type="radio">` va `<label>`), Variant tugmasi ko'rinishida: 56px, 2px `--chiziq-kuchli`, `--r-orta`. Tanlangani 2px `--floor-ui` chegara va belgi ikonkasi. Usul nomi matn bilan yoziladi; to'lov tizimlari logotiplari faqat ularning rasmiy brend qoidalari tekshirilgandan keyin. Pastda bitta asosiy tugma "To'lash" / "Pay", summa tugma yonida yoziladi. Karta raqami Tayanch sahifasida so'ralmaydi (to'lov inPAY sahifasida).
- **SAT bo'limi inglizcha matnlari** (2026-11-08, SAT matni inglizcha): muhr ichida "TEKSHIRILGAN" o'rniga **VERIFIED** va sana; "tekshirish kerak" yorlig'i o'rniga **needs verification**; footerdagi "Natija kafolatlanmaydi" o'rniga **Results are not guaranteed**; "Namuna" o'rniga **Sample**. Ko'rinish va qoidalar o'zbekcha variant bilan bir xil. SAT sahifalarida `<html lang="en">` (qolip vazifasi). Inglizcha matnni muallif tekshiradi.
- **Menyu**: zich ustki qator (sticky emas), logo chapda, havolalar o'ngda, "Boshlash" `btn-primary`; bo'limlarga o'tish o'rniga lift. Telefonda ikkinchi qatorga o'tadi.
- **Footer**: "Natija kafolatlanmaydi", Maxfiylik, Manba jurnali.
- **Sahifa oxiri bloki** (har sahifada, T1): rasmiy manbalar, tekshirilgan sana, keyingi tekshiruv, tekshirilmagan joylar.

## Tasvir va ikonkalar

- Ikonkalar: inline chiziqli SVG, `currentColor`, `stroke-width: 2` (DS `--icon-stroke-width` 1.75 binoda). Emoji ikonka sifatida ishlatilmaydi.
- Illyustratsiya: shisha bino (DS). Boshqasi keyin ochiq litsenziyali to'plamdan (litsenziyasi tekshirilib), so'ng o'z maskotimiz.
- Real odam surati faqat muallifniki va faqat o'zi bergan bo'lsa.

## Taqiqlar

- Gradient fon: faqat studio foni, `.t-fon` nur dog'lari va `.t-tugma` dagi statik aks ruxsat etiladi. Gradient matn yo'q.
- `backdrop-filter`: faqat `.t-shisha`, `.t-tugma` va qavat shisha sinflarida (ADR 005). Shaffof shishada uzun matn, forma, test yoki savol yo'q. Ichma-ich blur yo'q. SVG blur filtri yo'q.
- Cheksiz animatsiya, `transition: all`, transform/opacity dan boshqa xossani animatsiya qilish.
- Qavat rangini (`floor-*-500`) CTA, havola yoki holat (xato / muvaffaqiyat) ma'nosida ishlatish.
- Bir qavat komponentida boshqa qavat tokeni (`nav-*`, `adm-*`, `sat-*`, `ielts-*`, `eyuf-*`).
- Chap tomonda rangli chiziqli kartalar; uchta bir xil karta qatorini odat bo'yicha qo'yish.
- Komponent CSS'ida xom rang yoki o'lcham.
- Uydirma raqam yoki sharh.
