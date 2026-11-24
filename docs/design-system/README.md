Tayanch — 5 qavatli bino: 1 Navigator, 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Tizim ikki qatlamdan iborat. **Poydevor** hamma qavatda bir xil, u binoni bitta bino qilib turadi. **Qavat mini-DS'i** esa har qavatning o'z xarakteri: palitra, sarlavha shrifti, motivlar, karta shakli. Qavatlar bir-biridan kuchli farq qiladi, lekin poydevorni hech bir qavat buzmaydi.

**Repodagi nusxa (2026-11-24):** manba Claude Design artifakti https://claude.ai/artifact/MSiB7vTDiz7ri565yM2iwt dan nusxa; bundan keyin manba shu papka (`docs/design-system/`). Saytga moslashtirilgan farqlar: qorong'i `nav-line-strong` #828282, `adm-line-strong` #8A7A6F (3:1 kontrast), shrift yuklash `@fontsource`.

**Holat (2026-11-24):** poydevor va 5 qavat mini-DS'i saytga o'tkazildi (stacked PR'lar, merge kutilmoqda; merge'gacha saytda eski ko'rinish):

| Qavat | Saytga o'tdi | PR | Izoh |
| --- | --- | --- | --- |
| 1 Navigator | 2026-11-24 | #241 (merge qilingan) | laym urg'u, ʻ/ʼ, nav-* tokenlar |
| 5 EYUF | 2026-11-24 | #242 | `.t-tugma` (`eyuf-tugma--urgu`), `.eyuf-variant`, eyuf-* tokenlar, ʻ/ʼ |
| 2 Top Admission | 2026-11-24 | #244 | qo'llanma va Topshirish yo'li `.adm` da, eski taxalluslar → adm-*, `adm-tugma--urgu` |
| 4 IELTS | 2026-11-24 | #245 | `html[data-floor="4"]` qavat qatlami, Lexend, `ielts-tugma--urgu`; Codex band fayllari (`mashq/index.astro`, `ieltsSahifalar.ts`, `mashqKartalar.ts`) hali eski |
| 3 SAT | 2026-11-24 | #246 | hamma sahifa `.sat` qobig'ida, taxalluslar → sat-* (pikselma-piksel isbot), Sora, `SatSavol` |
| Umumiy tozalash | 2026-11-24 | 6-bosqich PR | ✓/✗ → SVG, width → transform, chap chiziq va dekorativ gradient olindi, Pro kartasi kontrasti |

6-qavat AI Academy DS'da yo'q, tegilmagan (qaror kutilmoqda). Eski `.tugma` (`global.css`) hali 1-qavat hisob sahifalari va umumiy `SatSinxron`, `Suhbatdosh`, `Onboarding`, `404` da ishlatiladi.

**Holat (2026-11-18):** poydevor (Liquid Glass) va 5 qavatning hammasi qoralama sifatida tayyor, ochiq dizayn savollari yopilgan (muallif qarorlari 2026-11-18, "Qarorlar" bo'limi).

## Bino qoidasi: nima umumiy, nima qavatniki

| Poydevor (o'zgarmaydi) | Qavat o'zi belgilaydi |
| --- | --- |
| Asosiy matn shrifti `sans` (Onest), `body`, `small`, `button` uslublari | Sarlavha va raqam shrifti (masalan Navigator: `display`, `mono`) |
| `space-*` shkalasi (4px tarmoq), `radius-*` | Qaysi radiusni qayerda ishlatish (Navigator: ramka `radius-none`) |
| Liquid Glass: `glass-*` sirtlar, kapsula tugma `.t-tugma` (`btn-glass-*`), maydon, tab, almashtirgich | Fon, sirtlar va bloklar (`nav-bg`, `adm-bg` …), shisha tusi (`adm-glass`) |
| Fokus: `focus-ring` 2px va oraliq | Urg'u rangi va uning shkalasi (`floor-<qavat>-500` dan) |
| Holat ranglari: `success-text`, `warning-text`, `error-text` | Motiv va bezak (yo'l, ramka, pasport detallari …) |
| Lift, yon panel, qavat yo'li, hisob bandi | Karta, ro'yxat va hero tuzilishi |
| Qavat nuri `floor-<qavat>-glow`: tugma osti va shisha orqasidagi dog' | Nurdan tashqari urg'u fill (`adm-accent` …) |
| Kontrast: matn 4.5:1, ma'noli chiziq va ikonka 3:1, har ikki mavzuda | Ikonka va rasm uslubi (poydevor chegarasida) |

Qavat tokenlari o'z prefiksi bilan nomlanadi: `nav-*` (1), keyingilari `adm-*`, `sat-*`, `ielts-*`, `eyuf-*`. Komponent boshqa qavatning tokenini ishlatmaydi.

## Matn va ovoz

- Til: 1, 2, 4, 5-qavat o'zbekcha (lotin), 3-qavat SAT hamma matni inglizcha. Kod va URL o'zbekcha lotin konventsiya bo'yicha.
- Tutuq belgilari: `oʻ`, `gʻ` (U+02BB) va tutuq `ʼ` (U+02BC). O'zbekcha matn chiqadigan har shrift ularni ko'rsatishi shart. Istisnolar "Tipografiya" bo'limida.
- Siz deb murojaat: "Qavatni tanlang", "Imtihon sanasini belgilang". Tugma matni fe'l bilan, aniq: "Boshlash", "Davom etish".
- Natija va'da qilinmaydi. Qoida, muddat va talab faqat rasmiy manbadan, manba va sana bilan.
- Uydirma raqam, sana va sharh yo'q. Savol-javob namunasi ekranda "Namuna" (`caption`) deb belgilanadi.
- Emoji ishlatilmaydi: na ikonka, na bezak sifatida.

## Rang

- Poydevor neytrallari sovuq kulrang: `bg` sahifa foni, `surface` karta, `text-primary` va `text-secondary` matn.
- Havola faqat `link`. Qavat rangi havola, CTA yoki holat (xato, muvaffaqiyat) ma'nosida ishlatilmaydi.
- Asosiy tugma har qavatda bir xil kapsula: `btn-glass-bg` ustida `btn-glass-text`, ostida qavat nuri. Shishasiz holatda (`prefers-reduced-transparency`) `action-primary-*`.
- Qavat belgi rangi `floor-<qavat>-500`: Lift, bino, chip va bezakda. Bu rang matn emas. Qavat rangidagi matn uchun `floor-<qavat>-text` yoki qavat mini-DS'idagi `*-text` tokeni ishlatiladi.
- Holat rangi har doim so'z yoki ikonka bilan birga keladi.
- 1-qavat belgi rangi 2026-11-17 dan laym (`floor-navigator-500`), oldin moviy edi.
- 4-qavat belgi rangi 2026-11-17 dan elektr ko'k (`floor-ielts-500`, muallif tanlovi), oldin qizil edi (2-qavat to'q sarig'i bilan 1.18). U SAT ko'ki bilan yaqin (1.57). Muallif qarori (2026-11-18): ikkalasi ko'k qoladi, 3 va 4-qavat rang bilan emas, shrift (Sora / Lexend), motiv (SAT plitka va tab bar / IELTS nurli obyekt va halqa) va qavat raqami bilan ajraladi. Lift va binoda rang doim qavat raqami bilan keladi; SAT va IELTS bloklari yonma-yon faqat raqam yoki nom bilan qo'yiladi.
- 5-qavat belgi rangi 2026-11-18 dan zumrad (`floor-eyuf-500` `#10895F`), oldin yashil `#3BD879` edi (laym bilan 1.07). Endi laymdan ton (158° / 68°) va yorug'lik (2.54) bilan ajraladi. 2-qavat to'q sarig'i bilan yorug'ligi yaqin (1.41): tonda farq bor, lekin qizil-yashil ko'rishi sust foydalanuvchida kam seziladi, shuning uchun Lift va binoda rang doim qavat raqami bilan keladi.

## Tipografiya

- Matn har qavatda `sans` (Onest). Uslublar: `display`, `h1`, `h2`, `h3`, `body`, `small`, `caption`, `button`. Desktop o'lchamlari har uslub izohida.
- Sarlavhalarga `text-wrap: balance`, matn qatori `measure` (68ch) gacha.
- Qavat o'z sarlavha shriftini olishi mumkin, matn shrifti esa o'zgarmaydi.
- Saytda shriftlar `@fontsource` paketlari orqali o'z serverimizdan yuklanadi: matn shrifti Onest umumiy, qavat shriftlari (Barlow Condensed, JetBrains Mono, Sora, Lexend, Playfair Display) `src/components/QavatShrifti.astro` orqali faqat o'z qavatida. Google Fonts @import va alohida `<link>` ishlatilmaydi. (Artifakt previewlaridagi `bundle.css` @import faqat artifakt uchun.)
- Tutuq belgisi tekshiruvi (2026-11-18, brauzerda kenglik o'lchovi): Onest, Barlow Condensed, Lexend, Playfair Display'da `ʻ` va `ʼ` bor. **Sora**'da ikkalasi ham yo'q: u faqat inglizcha SAT sarlavha va raqamlarida, SAT ichidagi o'zbekcha matn (`lang="uz"`) Onest'da. **JetBrains Mono**'da `ʻ` yo'q (`ʼ` bor): Navigator mono yorliqlarida tutuq zaxira shriftdan chiqadi; muallif qarori (2026-11-18) bilan shrift qoladi, mono yorliq qisqa saqlanadi.
- Raqam ustunlari `font-variant-numeric: tabular-nums` bilan; Sora'da `tnum` ishlaydi (2026-11-18 tekshirildi), Playfair'da `lining-nums` ham kerak.

## Bo'shliq, shakl, soya

- Bo'shliq faqat `space-*`: telefon chekkasi `space-4`, bo'limlar orasi `space-8` (telefon) va `space-12` (desktop).
- Radius: input `radius-md`, karta `radius-lg`, tugma va Lift raqami `radius-full`.
- Soya: `shadow-1` kichik, `shadow-2` karta. Qora sahnali qavatlarda soya o'rniga rang bloki ajratadi.
- Bosish maydoni kamida `touch-min` (44px).

## Liquid Glass (2026-11-17, muallif qarori)

Shisha endi butun tizimning asosiy materiali: karta, panel, tugma, maydon, tab, Lift. Ilhom: muallif tanlagan Liquid Glass UI to'plamlari.

- Sirt `.t-shisha`: `glass-bg`, chet `glass-border`, radius `radius-xl`, soya `glass-shadow`, `backdrop-filter: blur(glass-blur) saturate(1.6)`.
- Shisha ostida rang bo'lishi kerak: sahifa yoki bo'lim `.t-fon` (qavat nuri `floor-<qavat>-glow` dan ikki xira dog'). Bu yagona dekorativ fon; studio gradienti shu bilan almashadi.
- **Matn qoidasi**: uzun matn, forma, test va savol ekranlari faqat zich shishada (`glass-bg-strong`, qavatda `*-glass-strong`). Shaffof `glass-bg` faqat qisqa matn va belgilar uchun. Kontrast zich sirtda hisoblanadi.
- Ichma-ich blur yo'q: shisha ichidagi element tekis yoki zich sirt oladi.
- Kapsula tugma `.t-tugma`: to'q yaltiroq shisha, tepada statik aks (`glass-highlight`), ostida va soyasida `--nur`. Variantlar `--ikkinchi` (shaffof), `--ikonka`.
- `prefers-reduced-transparency` va `backdrop-filter` yo'q brauzerda hamma shisha zich yoki tekis sirtga, tugma `action-primary-*` ga o'tadi.

## Harakat

- Davomiylik 150 / 250 / 400ms. Kelish: kechikuvchi egri, ketish: tezlashuvchi egri.
- `prefers-reduced-motion` da siljish va animatsiya yo'q.

## Ikonka va rasm

- Ikonka: chiziqli inline SVG, `currentColor`, `icon-md` (20px). Emoji yo'q.
- Rasm: real foto, yuzsiz. Real odam surati faqat muallifniki va faqat o'zi bergan bo'lsa.

## Taqiqlar

- `.t-fon` nur dog'lari va tugmadagi statik aksdan boshqa dekorativ gradient, gradient matn.
- Shaffof (`glass-bg`) shishada uzun matn, forma yoki test.
- Chap tomonda rangli chiziqli kartalar. Odat bo'yicha uchta bir xil karta qatori.
- Komponent CSS'ida xom rang yoki o'lcham: hammasi tokendan.
- Bir qavat komponentida boshqa qavat tokeni.

## Qarorlar (2026-11-18, muallif)

- 3-qavat SAT va 4-qavat IELTS ikkalasi ko'k qoladi (1.57:1). Farq shrift, motiv va qavat raqami bilan.
- Navigator mono shrifti JetBrains Mono qoladi, `ʻ` zaxira shriftdan chiqishi qabul qilingan.
- Sora `bundle.css` @import'ga qo'shildi, SAT previewlardagi alohida `<link>` olindi. Ishlatilmagan `serif` oilasi (Source Serif 4, Admission v1 qoldig'i) olindi.
- Muqova besh qavatni ko'rsatadi: har qavat bloki o'z raqam shriftida.

## Qavatlar holati

| Qavat | Mini-DS | Belgi rangi |
| --- | --- | --- |
| 1 Navigator | Qoralama v1 (2026-11-17), "1-qavat Navigator" bo'limi | `floor-navigator-500` laym |
| 2 Top Admission | Qoralama v2 (2026-11-17), "2-qavat Top Admission" bo'limi | `floor-admission-500` to'q sariq, krem / issiq qora shisha |
| 3 SAT prep | Qoralama v1 (2026-11-17), "3-qavat SAT prep" bo'limi | `floor-sat-500` ko'k, asos `sat-navy` navy shisha |
| 4 IELTS prep | Qoralama v1.1 (2026-11-17), "4-qavat IELTS prep" bo'limi | `floor-ielts-500` elektr ko'k (oldin qizil), tungi navy / tong shisha. SAT bilan farq: shrift, motiv, raqam (qaror 2026-11-18) |
| 5 EYUF prep | Qoralama v1 (2026-11-18), "5-qavat EYUF prep" bo'limi | `floor-eyuf-500` zumrad, zumrad tun / fil suyagi shisha, shampan oltin bezak |
