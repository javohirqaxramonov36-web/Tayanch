# Tayanch: dizayn tizimi

Asos: **Tayanch Design System (DS)**, 2026-11-09. Manba fayllar: `docs/ds/tayanch-ds-tokens.css` (tokenlar, o'zgarmas manba) va `docs/ds/tayanch-ds-bino.txt` (shisha bino). DS artifact: https://claude.ai/artifact/VDa6kEFnybraLAMiR1JhP9.

G'oya: besh qavatli bino. Besh qavat bir xil ko'rinadi, har qavat faqat o'z urg'u rangi bilan farqlanadi. Mobile-first, auditoriya 16–19 yosh. Yorug' studio foni, Onest shrifti, yumaloq tugmalar, ustki qatorlarda yengil shisha (Liquid Glass).

**A yo'nalish "Toza"** (2026-11-09, muallif tanladi; Claude Design maketi https://claude.ai/artifact/JXU8mCvXymmu3enj6NvubQ, artboard "A · Toza"): asos qora-oq, ranglar kam. Neytral shkala sovuq kulrang (`#F5F5F7` … `#111114`), havola va fokus alohida ko'k urg'u (`--color-accent-*`), asosiy tugma qora (qorong'ida oq), shisha kuchliroq xiralashgan va chetida ingichka yorug' chiziq. Qavatlarning 5 rangi o'zgarmagan, ular faqat belgi, chip va bezakda. DS manba faylidagi (`docs/ds/`) neytral va brand qiymatlari endi faqat tarix uchun; amaldagi qiymatlar `tokens.css` da.

Kodda xom qiymat yozilmaydi: komponent CSS'ida faqat `var(--...)`, qiymatlar faqat `src/styles/tokens.css` da.

## Tokenlar

Uch qatlam (`src/styles/tokens.css`):

1. **Primitive**: xom qiymatlar (`--color-neutral-*`, `--color-brand-*`, `--color-floor-<qavat>-100…900`, `--space-*`, `--radius-*`, `--duration-*`, `--font-size-*`).
2. **Semantic**: rol bo'yicha (`--color-bg`, `--color-surface`, `--color-text-primary`, `--color-link`, `--color-floor-<qavat>-fill/text/ui/subtle`, `--text-h1-size` …). Yorug' qiymatlar `:root` da, qorong'i qiymatlar `:root[data-mavzu='qorongi']` da.
3. **Component**: `--btn-*`, `--card-*`, `--input-*`, `--focus-ring`, `--glass-*`, `--floor-indicator-*`.

Saytga moslash (DS qiymatlari o'zgarmagan):
- DS `[data-theme]` o'rniga `data-mavzu`. Uni `<head>` dagi inline skript sahifa chizilishidan oldin qo'yadi (`BoshQism.astro`): avval `localStorage` dagi `tayanch:mavzu`, bo'lmasa `prefers-color-scheme`. Shuning uchun rang miltillamaydi. Tanlov tugmasi bo'lim yon panelida.
- DS `@container vp` o'rniga `@media (min-width: 768px)`: shu kenglikdan boshlab desktop matn o'lchamlari.
- Eski o'zbekcha nomlar (`--rang-*`, `--fon`, `--matn*`, `--b-*`, `--r-*`, `--soya`, `--parda`) DS tokenlariga ulangan, shuning uchun eski komponentlar ham DS qiymatlarini oladi. **Yangi kodda DS nomlari ishlatiladi.** Moslik jadvali `tokens.css` oxirida.

### Qavat rangi (`data-floor`)

`<html data-floor="1…5">` server tomonda qo'yiladi (`Asosiy`, `BolimQobiq`, `SatFokus`; `joriyQavat(Astro.url.pathname)`). Istalgan element `data-floor` olsa, uning ichida `--floor-*` shu qavatniki bo'ladi (Lift tugmasi, karta borilayotgan qavat rangida). 1-qavat standarti `:where(:root)` da: aks holda keyingi `:root` qoidasi `[data-floor="3"]` ni bosib ketadi.

| Qavat | Kalit | Identifikatsiya (`fill`, 500) |
| --- | --- | --- |
| 1 Navigator | `navigator` | `#19D3E6` |
| 2 Top Admission | `admission` | `#FFC21F` |
| 3 SAT prep | `sat` | `#2F86FF` |
| 4 IELTS prep | `ielts` | `#EF4841` |
| 5 EYUF prep | `eyuf` | `#3BD879` |

| Token | Roli |
| --- | --- |
| `--floor-fill` | Identifikatsiya rangi: bino, yonish, bezak. Matn uchun emas |
| `--floor-text` | Qavat rangidagi matn (zich `--color-surface` / `--color-bg` ustida AA) |
| `--floor-ui` | Urg'u: chip, son doirasi, progress, ikonka, chegara, faol qator (fon ustida ≥ 3:1) |
| `--floor-ui-text` | `--floor-ui` ustidagi matn: yorug'da oq, qorong'ida neutral-950 |
| `--floor-subtle` | Och fon (tanlangan javob, hover) |
| `--floor-ui-toq` / `--floor-ui-chuqur` | `--floor-ui` ning neutral-950 bilan aralashmasi (80% / 60%): 3D pog'ona yuzlari, Hajm 3D sahnasi, urg'u hover. Sayt qo'shimchasi, muallif tasdiqlagan |

Qoidalar:
- **CTA tugmalar qavatdan qat'i nazar bir xil** (`--btn-primary-*`: yorug'da brand-900, qorong'ida oq). Qavat rangi CTA bo'lmaydi.
- Qavat matn rangi shaffof shisha ustiga qo'yilmaydi (yorug'da 4.5:1 ga yetmasligi mumkin). Shisha yoki shisha-karta ustida urg'u faqat `--floor-ui` doira, ikonka yoki chegarada; matn neytral (`--color-text-*`) yoki `--color-link`.
- Matn ko'rinishidagi havola va ta'kid: `--color-link` (`--rang-havola`). Qavat 700 matn rangi studio foni pastida (`#D9DADE`) faqat 3.6:1.

### Neytral va holat ranglari

| Token | Yorug' | Qorong'i | Roli |
| --- | --- | --- | --- |
| `--color-bg` / `--color-bg-deep` | neutral-50 `#F5F5F7` / 150 `#E6E6EC` | neutral-925 `#0E0E12` / 950 `#050507` | Studio foni gradienti |
| `--color-surface` | oq | neutral-850 `#17171C` | Zich yuza (Lift tugmasi, forma maydoni, shisha zaxirasi) |
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

Harf oralig'i: PR #74 dagi `--oraliq-hero`, `--oraliq-sarlavha`, `--oraliq-kichik-sarlavha` DS `--text-display-ls`, `--text-h1-ls`, `--text-h3-ls` ga ulangan. Sarlavhalar `text-wrap: balance`, abzaslar `text-wrap: pretty`.

## Bo'shliq va shakl

- Bo'shliq: 4px to'r, `--space-1` … `--space-16` (eski `--b-N` = `--space-N`; `--b-24` 96px / telefonda 64px eski qiymat). Kontent kengligi `--size-content-max` 1200px.
- Radius: `--radius-sm` 6, `--radius-md` 12 (forma, kichik tugma, yon panel qatori), `--radius-lg` 20 (karta), `--radius-xl` 28 (modal), `--radius-full` (pill). Eski `--r-orta` va `--r-logo` → md, `--r-katta` → lg.
- Soya: `--shadow-1` (karta), `--shadow-2` (karta hover, eski `--soya`), `--shadow-3`. Qorong'ida soyada ichki yorug' chiziq bor.
- Bosiladigan joy kamida 44px (`--size-touch-min`). Tugma 48px (`--control-height-md`).

## Liquid Glass (shisha)

Muallif tasdiqlagan qiymatlar (DS dagi eski panel qiymatlari emas):

| Token | Yorug' | Qorong'i |
| --- | --- | --- |
| `--glass-blur` | 20px | 20px |
| `--glass-saturate` | 1.8 | 1.4 |
| `--glass-chrome-bg` (topbar, sticky, Lift paneli) | oq 84% | neutral-925 84% |
| `--glass-card-bg` (kartalar, blursiz) | oq 72% | oq 5% |
| `--card-line` (karta chegarasi, `--card-border`) | neutral-900 8% | oq 9% |
| `--glass-edge` | ichki 1px oq 78% + `--glass-highlight` | ichki 1px oq 12% + `--glass-highlight` |
| `--glass-highlight` (ichki yuqori chiziq) | 0 1px 0 oq 95% | 0 1px 0 oq 16% |
| `--glass-shadow` (Menyu, Lift paneli, `.shisha`) | 0 12px 32px neutral-900 10% | 0 12px 32px neutral-950 45% |
| `--glass-sheen` (statik) | yuqoridan oq 35% → 0 (50% gacha) | oq 4% → 0 |

Qoidalar:
- `backdrop-filter` faqat **ustki qatorlarda** (`Menyu`, `BolimYon` ustki qatori, `SatFokus` sarlavhasi), **sticky panelda** va **Lift telefon panelida**. Klass: `.shisha` (`global.css`) yoki shu tokenlar.
- Bir ekranda bir vaqtda ko'pi bilan 3 ta shisha qatlam.
- Uzun ro'yxat va animatsiya qilinayotgan element ustida `backdrop-filter` yo'q. Lift paneli harakatlanadi: shisha panelning o'zida.
- Aks (sheen) statik, animatsiyasiz.
- Kartalar blursiz (`--glass-card-bg`, `.ds-karta`) va faqat studio foni ustida.
- Bino SVG blursiz, shaffof to'ldirish bilan.
- Shisha ustidagi matn: oddiy matn ≥ 4.5:1, katta matn va UI ≥ 3:1, ikkala mavzuda. Past bo'lsa fon zichlashtiriladi. A yo'nalishda fon 84%: bu ikkinchi darajali matn (neutral-600 / 400) eng yomon holatda (ostida qora yoki oq kontent, blur hisobga olinmagan) 4.5:1 ni saqlaydigan eng kichik qiymat. Maketdagi 56% / 55% bunga yetmaydi. Tekshiruv `scripts/kontrast-brauzer.js`: 38 sahifa × 2 mavzu × 1280/360, 0 buzilish (2026-11-09). Qiymat o'zgarsa qayta hisoblanadi.
- **Zaxira.** Asosiysi: `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` bo'lsa, zich fon (`--color-surface`) va `backdrop-filter: none`. Qo'shimcha: `prefers-reduced-transparency: reduce` bo'lsa, shisha va kartalar zich fonga o'tadi, aks yo'q.

## Harakat

- Davomiylik: `--duration-fast` 150ms, `--duration-base` 250ms, `--duration-slow` 400ms, `--duration-stagger` 50ms.
- Egri: `--ease-enter` (kelish, yonish), `--ease-exit` (ketish, o'chish), `--ease-state` (hover, bosish, holat).
- **Reduced motion**: `prefers-reduced-motion: reduce` da DS davomiylik tokenlari 0ms va `--motion-distance` 0 (siljish yo'q). `global.css` qo'shimcha ravishda hamma transition va animatsiyani o'chiradi. Bino yonishi, Lift paneli va "2 → 3" ko'rsatkichi animatsiyasiz.
- PR #76 dagi eski nomlar DS ga ulangan: `--harakat-tez` = `--duration-fast`, `--harakat-orta` = `--duration-base`, `--harakat-sekin` = `--duration-slow`, `--harakat-egri` = `--ease-enter`, `--kotarilish` = `translateY(--card-lift)`, `--bosilish` = `translateY(--btn-press-shift)` (reduced motion'da siljishsiz; `hover: none` da `--kotarilish` none). Umumiy transition (`a`, `button`, `summary`, `.variant`) `global.css` da.

## Komponentlar

- **Fokus halqasi** (DS): `--focus-ring-width` 2px `--color-focus-ring` + 2px `--color-focus-gap` oraliq. Global `a`, `button`, `summary` da `outline` + oraliq `box-shadow` (outline forced-colors rejimida ham ko'rinadi). Komponentlardagi maxsus fokus ham `outline: var(--focus-ring-width) solid var(--color-focus-ring)`.
- **Tugma** (`.tugma`): 48px (`--control-height-md`), pill (`--btn-radius`), `--text-button-*`. Bosilganda 1px pastga (`--btn-press-shift`, reduced motion'da 0).
  - Asosiy (`.tugma-asosiy`, sahifalardagi `.katta.asosiy`, `.katta-tugma.asosiy`, `.tugma-l.kok`, menyudagi "Boshlash"): `--btn-primary-*`, hamma qavatda bir xil. Yorug'da neutral-900 `#111114` (hover 800, bosilgan 950), qorong'ida neutral-50 (hover oq, bosilgan 250 `#D4D4DC`), matn teskari. `--btn-primary-shadow`: ichki yuqori yorug' chiziq + 0 1px 2px soya (`global.css` da shu klasslarning hammasiga); fokusda soya o'rniga fokus oralig'i.
  - Ikkinchi darajali (`.tugma-ikkinchi`): `--btn-secondary-*`. Yorug'da oq, 1px neutral-300 `#C9C9D2` chegara, hover 100, bosilgan 150. Qorong'ida oq 6% / 11% / 16%, chegara oq 22%.
  - O'chiq: `--btn-disabled-*` (`--color-surface-sunken` fon, `--color-text-disabled`).
  - **Qora karta ichidagi CTA**: oq pill (`--qora-matn` fon, `--qora` matn). `btn-primary` (neutral-900) qora fonga qo'shilib ketadi.
  - Telefonda katta tugmalar to'liq kenglik. Tugma faqat `<button>` yoki `<a>`.
- **Variant tugmasi** (test javobi): 2px chegara, `--r-orta`, chapga tekislangan matn, balandlik 56px. Tanlangani `--floor-subtle` fon va `--floor-ui` chegara.
- **DS link karta** (`.ds-karta`, `global.css`): `--glass-card-bg`, 1px `--card-border`, `--card-radius`, `--card-shadow` + `--glass-highlight`. Hover: `--card-shadow-hover` va `--card-lift` (reduced motion'da siljishsiz). Kartada `data-floor` = **borilayotgan qavat**; urg'u `.ds-karta-belgi` (ikonka yoki strelka `--floor-ui` doirada). Ishlatilgan: bosh sahifa bo'lim kartalari, `Zina`, `QavatlarAro`. Besh bo'lim kartasi bir xil (alohida qora karta yo'q).
- **Yorliq (pill)** (`.yorliq`, DS badge): 24px, `--radius-full`, `--text-caption-*`. "Tez orada" = `--sirt-ikkinchi`.
- **Progress**: 8px (`--progress-height`), `--radius-full`, to'ldirish `--floor-ui`.
- **Qora sahna**: `--qora` fon, matn `--qora-matn` (ikkala mavzuda oq), ikkinchi matn `--qora-matn-ikkinchi`. Ichidagi ko'k ta'kid `--rang-asosiy-qorada` (brand-300).
- **SAT bo'limi dizayni** (2026-11-04): asos `Tayanch-SAT-dizayn.md` (Claude Design kanvasi, 6 ekran: Main, Mashq, Telefon, Natijalar, Lug'at, Savol banki). Ekranlardagi savol, so'z va raqamlar namuna, saytga qo'yilmaydi. Hammasi qo'llangan: yon panel, SAT kirishi (hero, qora "Imtihon tuzilmasi" kartasi CB03 raqamlari bilan, 3 qadam, sahifalar guruhlari), telefon ko'rinishi, Mashq testi va Lug'at (yon panelsiz "fokus" qolipi `SatFokus`), Savol banki, Mening natijalarim. Namuna savollar va so'zlar `src/data/satNamuna.ts` da, ekranda "Namuna" deb belgilangan. Natijalar haqiqiy javoblarni ko'rsatadi; javob bo'lmasa namuna chiqadi va "Namuna ma'lumot" yorlig'i turadi.
  - Yon panel qatori: 44px, `--r-yon` (md), faol qator `--floor-ui` fon va `--floor-ui-text`, ikonkalar `--floor-ui`. Guruhlar (2026-11-09, muallif tanlovi): Lessons (Math, Reading & Writing kichik sarlavhalari bilan), Practice, Tools, Coming soon. Har tayyor sahifada ikonka bor; hali yozilmagan sahifalar "Coming soon" guruhida havola emas (kulrang matn va "soon" yorlig'i, Tab bilan o'tilmaydi). Ma'lumot `satYonGuruhlar` (`satSahifalar.ts`); SAT kirish sahifasi `satGuruhlar` ni ishlatadi. Bu yerdagi kichik tugmalar 44px (`--size-touch-min`).
- **IELTS bo'limi dizayni** (2026-11-05): asos `Tayanch-IELTS-dizayn.md` (7 ekran: kirish, Reading qo'llanma, 30 kunlik reja; har biri telefon varianti bilan). SAT'dan farqlari: yon panel qatori 48px va `--r-orta`, matn 16px; "tez orada" bandlar havola emas (kulrang ikonka va yorliq, Tab bilan o'tilmaydi); logo radiusi `--r-kichik`; pastda Telegram bandi. Sahifadagi yagona soya: kirishda reja kartasi, qo'llanmada mini-mashq, rejada savol kartasi. "Manbalar va tekshiruv" bloki `ManbaBlok`. Kvadrat qavsdagi joylar rasmiy manbadan to'ldirildi (IE01–IE03, ID01); tekshirib bo'lmaganlari "tekshirilmoqda" deb qoldi.
- **Bo'lim yon paneli** (`BolimYon`, `bolim="sat" | "ielts"`, qolip `BolimQobiq`): 1024px va undan kengda chapda doimiy (`--yon-kenglik` 288px), yig'ilganda `--yon-yigilgan` 72px. Undan torda sticky ustki qator (shisha) va undagi hamburger tugmasi panelni chapdan chiqaradi: Esc yopadi, fokus panel ichida qoladi, qolgan sahifa `inert`. Pastda "Tayanch bosh sahifasi" havolasi va mavzu tugmasi.
- **Tayanch binosi** (2026-11-05, muallif qarori): sayt 5 qavatli bino. 1 Navigator (`/uz/`), 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Ma'lumot `src/data/qavatlar.ts` (2–5 qavat holati `bolimlar.ts` dan), `joriyQavat(pathname)`.
- **Shisha bino** (`Bino.astro`, DS `heroSVG`): bosh sahifa hero'sida, sochilgan yorliqlar uning atrofida. Server tomonda chiziladi (JS'siz), `aria-hidden`, ikonkalar `qavatlar.ts` dan, raqamlar "01" ko'rinishida. Geometriya, gradientlar, filtrlar va CSS DS dan o'zgarishsiz. `aktiv` qavat yonib turadi (bosh sahifada 1). Sahifadagi `[data-bino-yoq="N"]` elementga ("Qavatni tanlang" tugmalari) hover yoki fokus kelsa, o'sha qavat yonadi (CSS `:has()`); reduced motion'da animatsiyasiz.
- **Lift** (`Lift.astro`): 5 ta yumaloq raqamli tugma (48px), `<nav aria-label="Qavatlar (lift)">`, tugma `<a>`. Har tugma `data-floor` bilan o'z qavat rangida: zich `--color-surface` fon, raqam `--floor-text`, hover `--floor-subtle`. Joriy qavat DS chip tanlangan holatida (`--floor-ui` fon, `--floor-ui-text`), `aria-current="location"`. Tez-oradagi qavatda nuqta bor, lekin unga kirsa bo'ladi ("qavat qurilmoqda" sahifasi). Kompyuterda Lift uch joyda turadi: bo'lim yon panelida logo ostida ("3-qavat · SAT prep" yozuvi bilan; yig'ilgan panelda ustun, yozuvsiz), 1-qavat menyusining o'ng tomonida va mashq sahifasi sarlavhasida (44px). Telefonda pastda shisha panel chiqadi: 5 tugma, raqam va qisqa nom, 64px tugma + 2 × 4px = 72px + safe area. Bu `global.css` dagi `body` pastki bo'shlig'iga (72px) mos, bo'shliq o'zgarmaydi. Chiqib keladigan panel ochiq bo'lsa Lift inert. Pastga 48px dan ko'p aylantirilsa yashirinadi; yuqoriga 24px, sahifa tepasi yoki oxirida, yoki Tab bilan fokus kelsa chiqadi (2026-11-09, muallif tasdig'i; reduced motion'da animatsiyasiz, holat saqlanmaydi). Qavat o'zgarsa qisqa "2 → 3" ko'rsatkichi chiqadi (sessionStorage `tayanch:qavat`; reduced motion'da animatsiyasiz).
- **Qavat yo'li** (`QavatYoli.astro`): sahifa tepasida "3-qavat › Mashq › Test"; oxirgi band havola emas (`aria-current="page"`). 1-qavat bosh sahifasida yo'q.
- **Zina** (`Zina.astro`): qavat kirish sahifasi pastida qo'shni qavatlarga ikki DS link karta (pastga chapda, yuqoriga o'ngda). 1-qavatda faqat yuqoriga, 5-qavatda faqat pastga.
- **Qavatlar orasidagi yo'l** (2026-11-09, dizayn rejasi B 4-bosqich, muallif tanlovi):
  - Bosh sahifa hero'sida "Qavatni tanlang" qatori (`#qavatlar`): 2–5 qavatga yumaloq havolalar (48px, raqam doirasi qavat rangida; tez-oradagi qavatda "qurilmoqda" yorlig'i, lekin havola) va "Bilmayapman: 3 savolga javob bering" → maqsad testi (`#maqsad`). Menyuda "Yo'nalishlar" → `#qavatlar`, "Boshlash" → `#maqsad`. Maqsad testi natijasi va bo'lim kartalari tez-oradagi qavatga ham olib boradi (Lift kabi).
  - "Boshqa qavatda" (`QavatlarAro.astro`, ma'lumot `src/data/qavatlarAro.ts`): dars oxirida (`DarsQolip`, `modul` bo'yicha) va Topshirish yo'li oxirida DS link karta: yorliq "4-qavat · IELTS prep" (strelka yuqori/past, qavat rangidagi doirada), nom, izoh. Matn manba sahifa tilida; nom boshqa tilda bo'lsa `nomiTili`. Faqat saytda bor sahifalarga, fakt yozilmaydi.
- **Top Admission: pasport/viza detallari** (maket, 2026-11-05: Claude Design "Tayanch Top Admission maketi", https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF; A kirish, B Türkiye Bursları, C Topshirish yo'li, D lift; yorug' va qorong'i). Detallar ma'no tashiydi, bezak emas; hammasi CSS/SVG, rasmsiz (pasport surati, bayroq, gerb yo'q). Urg'u rangi 2-qavatniki (`--floor-ui`).
  - **Muhr**: 58–92px doira, 2px uzuq urg'u chegara + ichki 1.5px halqa, -8° burilgan, ichida "TEKSHIRILGAN" va sana. Faqat rasmiy manbada tekshirilgan faktda. Tekshirilmaganida muhr yo'q, o'rniga ogohlik rangidagi "tekshirish kerak" yorlig'i.
  - **Chipta**: faqat muddat kartalari. 1.5px qora chegara, `--r-orta`; o'ng "korishok" (150px, telefonda 96px) uzuq chiziq bilan ajratilgan, chegarasida tepa va pastda yarim doira teshik. Chapda sana katta (900), korishokda qolgan kun.
  - **Viza sahifasi**: yo'nalish sahifasi boshidagi karta, 24px katakli nozik to'r (`--sirt-ikkinchi`), chap yuqorida davlat kodi ("UZ → TR", urg'u, 900), 2×2 maydon: Dastur, Daraja, Ariza oynasi, Manba.
  - **MRZ qatori**: faqat sahifa oxiri blokida, `--fon-ikkinchi` lentada ikki qator `TAYANCH<<TOP<ADMISSION<<<…`, Onest 700, harf oralig'i 0.22em, `aria-hidden`. Shaxsiy ma'lumot yo'q.
  - **Savol progressi** (Topshirish yo'lidagi 3D zinapoya: ust `--floor-ui`, old `--floor-ui-toq`, yon `--floor-ui-chuqur`) va **Zina** (qavatlar orasidagi kartalar) har xil ko'rinadi va har xil yozilgan; ularni adashtirmaslik kerak.
  - Topshirish yo'lida asosiy yo'l kartasi qora (qorong'ida `--fon-ikkinchi` + 2px `--rang-havola` chegara); kartaning orqa yuzi pasport sahifasi (to'r fon, muhrli faktlar, "tekshirish kerak" yorliqlari).
- **Hisob va to'lov sahifalari** (2026-11-08, ADR `docs/qarorlar/001-hisob-tolov-server.md`). Umumiy kirish va profil 1-qavatda (o'zbekcha), SAT tarif sahifalari inglizcha. Yangi rang yo'q, faqat mavjud tokenlar (yagona istisno: Google tugmasi, pastda). Qizil yoki yashil ta'kid taqiqi bu yerda ham amal qiladi: xato ham, muvaffaqiyat ham rang bilan emas, matn va ikonka bilan aytiladi.
  - **Forma maydoni**: ko'rinib turadigan `<label>` maydon ustida (placeholder yorliq o'rnini bosmaydi). Balandlik kamida 48px, `--sirt` fon, 2px `--chiziq-maydon` chegara (`--chiziq-kuchli` emas: u 3:1 ga yetmaydi), `--r-orta`, matn `--matn-asosiy`. Fokus: DS fokus halqasi. To'g'ri `type` va `autocomplete` (`email`, `current-password`, `new-password`). Yordamchi matn maydon ostida `--matn-ikkinchi`, `aria-describedby` bilan bog'lanadi.
  - **Xato xabari**: maydon ostida, ogohlik juftligi (`--rang-ogoh-fon` / `--rang-ogoh-matn`), `--r-kichik`, ogohlik ikonkasi (inline SVG) va matn. Maydonga `aria-invalid="true"` va `aria-describedby`. Forma yuborilganda xatolar ro'yxati tepada `role="alert"` bilan, fokus unga o'tadi. Xato faqat rang bilan ko'rsatilmaydi. Matn nima qilishni aytadi ("Email manzilida @ belgisi yo'q"), aybdor qilmaydi.
  - **Parol maydoni**: forma maydoni qoidalari + "Ko'rsatish" / "Show" tugmasi (`<button type="button">`, `aria-pressed`, maydon ichida o'ngda, 48px). Talablar (uzunlik) maydon ostida oldindan yoziladi. Nusxa qo'yish (paste) taqiqlanmaydi.
  - **Google tugmasi** (`GoogleTugma.astro`, P03B, 2026-11-09; muallif tasdiqlagan istisno): Google brend qoidalari bo'yicha (developers.google.com/identity/branding-guidelines, tekshirildi 2026-11-09), sayt palitrasidan tashqari. Rangli standart G logosi rasmiy SVG'dan o'zgarishsiz (monoxrom taqiq), 20px, matndan oldin. Ranglar faqat shu tugmada, `--google-*` tokenlari: yorug'da fon `#FFFFFF`, 1px chegara `#747775`, matn `#1F1F1F`; qorong'ida `#131314`, `#8E918F`, `#E3E3E3`. Kontrast: matn 16.5:1 / 14.5:1, chegara karta ustida 4.5:1 / 5.9:1. 48px, to'liq yumaloq (`--r-toliq`), to'liq kenglik, logo va matn orasi 10px. Hover: `--google-hover` holat qatlami (ichki soya; Google qiymati emas, o'zimizniki). Fokus: saytning umumiy fokus halqasi. Matn "Google bilan davom etish" (Google'ning "Continue with Google" varianti; o'zbekcha tarjima muallif tekshiradi). **Og'ish**: shrift Google Sans Medium 14/20 emas, sayt shrifti 500, `--matn-asosiy` (sayt tugmalari bilan bir xil o'lcham; brend qoidasidan kichik og'ish, muallif tasdiqlagan). Bosilganda "Kuting…" va o'chiq; Google'dan "Orqaga" bilan qaytilsa (`pageshow`) tiklanadi.
  - **Kvota ko'rsatkichi** (Free tarifda): Progress komponenti (8px, `--r-toliq`, to'ldirish `--floor-ui`) + matn "ishlatilgan / jami" ko'rinishida (kvota raqamlari hali belgilanmagan). Kvota tugaganda rang o'zgarmaydi; ostida matn va Pro tariflar sahifasiga `<a>` havola. `role="progressbar"` bilan `aria-valuenow`/`aria-valuemax` yoki oddiy matn.
  - **To'lov usuli tugmasi** (Click, Payme, UzCard/HUMO): radio guruhi sifatida (`<fieldset>` + `<legend>`, har biri `<input type="radio">` va `<label>`), Variant tugmasi ko'rinishida: 56px, 2px `--chiziq-kuchli`, `--r-orta`. Tanlangani 2px `--floor-ui` chegara va belgi ikonkasi. Usul nomi matn bilan yoziladi; to'lov tizimlari logotiplari faqat ularning rasmiy brend qoidalari tekshirilgandan keyin. Pastda bitta asosiy tugma "To'lash" / "Pay", summa tugma yonida yoziladi. Karta raqami Tayanch sahifasida so'ralmaydi (to'lov inPAY sahifasida).
- **SAT bo'limi inglizcha matnlari** (2026-11-08, SAT matni inglizcha): muhr ichida "TEKSHIRILGAN" o'rniga **VERIFIED** va sana; "tekshirish kerak" yorlig'i o'rniga **needs verification**; footerdagi "Natija kafolatlanmaydi" o'rniga **Results are not guaranteed**; "Namuna" o'rniga **Sample**. Ko'rinish va qoidalar o'zbekcha variant bilan bir xil. SAT sahifalarida `<html lang="en">` (qolip vazifasi). Inglizcha matnni muallif tekshiradi.
- **Menyu**: shisha ustki qator (sticky emas), logo chapda, havolalar o'ngda, "Boshlash" `btn-primary`; bo'limlarga o'tish o'rniga lift. Telefonda ikkinchi qatorga o'tadi.
- **Footer**: "Natija kafolatlanmaydi", Maxfiylik, Manba jurnali.
- **Sahifa oxiri bloki** (har sahifada, T1): rasmiy manbalar, tekshirilgan sana, keyingi tekshiruv, tekshirilmagan joylar.

## Tasvir va ikonkalar

- Ikonkalar: inline chiziqli SVG, `currentColor`, `stroke-width: 2` (DS `--icon-stroke-width` 1.75 binoda). Emoji ikonka sifatida ishlatilmaydi.
- Illyustratsiya: shisha bino (DS). Boshqasi keyin ochiq litsenziyali to'plamdan (litsenziyasi tekshirilib), so'ng o'z maskotimiz.
- Real odam surati faqat muallifniki va faqat o'zi bergan bo'lsa.

## Taqiqlar

- Studio fonidan boshqa gradient fon; gradient matn.
- Belgilangan joylardan (ustki qator, sticky panel, Lift paneli) tashqarida `backdrop-filter`; animatsiyali aks.
- Qavat rangini CTA yoki holat (xato / muvaffaqiyat) ma'nosida ishlatish.
- Chap tomonda rangli chiziqli kartalar; uchta bir xil karta qatorini odat bo'yicha qo'yish.
- Komponent CSS'ida xom rang yoki o'lcham.
- Uydirma raqam yoki sharh.
