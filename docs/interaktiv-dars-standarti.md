# Interaktiv dars standarti

Barcha qavatlar (SAT, IELTS, Top Admission, EYUF) uchun interaktiv dars qoidalari.
Namuna: PR #15, SAT Math darslari (`src/pages/uz/sat/qollanma/math/`). Yangi dars shu hujjatga mos bo'lmasa, PR ochilmaydi.
Umumiy qoidalar: `CLAUDE.md`, `DESIGN.md`. Bu hujjat ular bilan zid kelsa, `CLAUDE.md` va `DESIGN.md` ustun.

## 1. Dars tuzilishi

Qolip: `src/components/dars/DarsQolip.astro`. Tartib o'zgarmaydi:

1. **Maqsad**: "Bu darsdan keyin" ro'yxati (3 band) va progress (`n / jami mashq to'g'ri yechilgan`).
2. **Laboratoriya**: chapda sahna (`slot="sahna"`), o'ngda 3 qadam tablist:
   1 Animatsiya, 2 Formula yoki Qoida, 3 Sinab ko'r (`slot="animatsiya" | "formula" | "sinab"`).
   Sahna `dars:qadam` hodisasini tinglaydi (`detail.qadam`). Panel ichidan o'tish: `<button data-qadamga="sinab">`.
3. **Mashqlar**: 5 ta (PR #15 da hajm darsida 6 ta). Bittadan ko'rsatiladi, raqamli nuqtalar bilan o'tiladi.
4. **Xulosa va Xato daftari**: 4-5 qisqa qoida; shu moduldagi xatolar, "Qayta yechish", tozalash.
5. **Keyingi dars** havolasi (ixtiyoriy) va **ManbaBlok** (rasmiy manba ID, tekshirilgan sana, keyingi tekshiruv, tekshirilmagan bandlar).

Qolip prop'lari: `bolim`, `modul`, `savollar`, `yolBandlari`, `darsTuri`, `imtihon?`, `manbalar`, `tekshirilgan`,
`keyingiTekshiruv`, `keyingi?: { nomi, href }` (`href` sahifada `yol()` bilan yasaladi), matn prop'lari.
Bo'limga xos qiymat qolip ichida qattiq yozilmaydi.

## 2. Savol ma'lumoti

Turlar: `src/data/darsTurlar.ts`. Fayllar: `src/data/<bolim>Darslar/<modul>.ts`, bo'limga xos turlar o'sha papkadagi `turlar.ts` da.

```ts
{ id, modul, mavzu, qiyinlik: 'oson' | "o'rta" | 'qiyin', matn,
  variantlar: [{ matn, xato? }],  // noto'g'ri variantda xato = tipik xato nomi
  togri,                          // variantlar indeksi
  yechim, verified: false }
```

- `id` butun sayt bo'yicha yagona: `<modul>-<raqam>` (yangi bo'limlarda prefiks bilan, masalan `rw-`).
- Har noto'g'ri variant bitta tipik xatodan kelib chiqadi va o'sha xato nomi yoziladi. To'g'ri variantda `xato` bo'lmaydi.
- Variantlar takrorlanmaydi; to'g'ri javob bitta.

## 3. Savolni tekshirish

- Har savol ikkinchi, mustaqil usul bilan qayta yechiladi: `src/data/<bolim>Darslar/tekshiruv.ts`
  (`tekshiruv: BolimTekshiruv`, turlar `src/data/tekshiruvTurlar.ts`). Qiymat importlari `.ts` kengaytmasi bilan.
- Sonli savol: savoldagi formulasiz boshqa yo'l (disklar yig'indisi, sonli qidiruv, teskari tekshiruv).
  Noto'g'ri variantlardan hech biri shu natijaga teng chiqmasligi kerak.
- Sonli hisob yo'q joyda (grammatika, matn): qoida bo'yicha qayta yechib, to'g'ri variant matnini qaytaradi;
  har noto'g'ri variant nega noto'g'ri ekani `usul` matnida alohida yoziladi.
- Ikki usul mos kelmasa yoki ikki variant to'g'ri chiqsa, savol olib tashlanadi (tuzatib "o'tkazib yuborilmaydi").
- Ishga tushirish (Mac): `PATH=/opt/homebrew/bin:$PATH npm run savollar:tekshir` → 0 ta farq bo'lishi shart.
  `npm run savollar:jadval` jadvalni `docs/<bolim>-savollar-tekshiruv.md` ga yozadi (qo'lda tahrir qilinmaydi).
- College Board, IELTS (Cambridge, British Council, IDP) va boshqa rasmiy savollar nusxalanmaydi va parafraz qilinmaydi.
  Hamma matn va savol Tayanch uchun original yoziladi.

## 4. verified

- `verified: true` ni faqat muallif qo'yadi, jadvalni ko'rib chiqqandan keyin. Claude hech qachon `true` qo'ymaydi.
- `verified: false` savol saytda "tekshirilmagan" yorlig'i bilan chiqadi.

## 5. Texnika

- 3D faqat mavzu uni talab qilsa (hajm, fazoviy shakl). `three` npm paketi, nomli import (`import { Mesh } from 'three'`),
  sahifada dinamik import va `IntersectionObserver` (sahna ekranga yaqinlashganda yuklanadi). Namuna: `src/lib/hajmSahna.ts`.
- Qolgan joyda SVG yoki canvas. Sudrash: `src/lib/svgSudrash.ts`.
- Faqat o'zgarganda chizish (doimiy `requestAnimationFrame` sikli yo'q); sahna ko'rinmasa yoki tab yashirin bo'lsa to'xtaydi
  (`IntersectionObserver`, `visibilitychange`).
- Geometriya, material, tekstura va renderer `dispose` qilinadi. Pixel ratio `Math.min(devicePixelRatio, 1.5)`.
- `prefers-reduced-motion: reduce`: animatsiya yo'q, holat bir qadamda almashadi.
- Sahna holati ekran o'quvchiga `aria-live="polite"` matni bilan aytiladi. Har sudraladigan narsa klaviaturada ham
  boshqariladi (slayder yoki `role="slider"`, strelkalar, Home/End).

## 6. Telefon

- Bosiladigan nishon ekranda kamida 44px (SVG tutqichlari o'lchamga qarab qayta hisoblanadi).
- Boshqaruv (slayder, tugmalar) sahna ostida turadi, sahna ustida emas.
- `touch-action: none` faqat sudraladigan tutqichda; SVG o'zida `pan-y`. Sahifa scroll'i hech qachon tiqilib qolmaydi.
- 390px kenglikda gorizontal scroll yo'q.

## 7. Saqlash

- Faqat brauzerda. Kalitlar: `tayanch:<bolim>-dars-progress`, `tayanch:<bolim>-xato-daftari` (`darsKalitlari()`),
  boshqasi kerak bo'lsa `tayanch:<bolim>-...` va avval muallifdan so'raladi. Bitta kalit = bitta shakl:
  boshqa sahifa shu kalitni o'qisa, shaklni o'zgartirmaydi.
- Har o'qish va yozish `try/catch` ichida (`src/lib/darsSaqlash.ts`); saqlab bo'lmasa sahifa ishlaydi va buni aytadi.
- O'chirishda `confirm()` ishlatilmaydi: sahifa ichidagi tasdiq ("Ha, o'chirish" / "Bekor qilish").

## 8. Matn

- O'zbek lotin. O'nli kasr vergul bilan (`17,5`), minus "−", koordinata `(x; y)`. Yordamchi: `src/lib/sonYozuv.ts`.
- Mashqlar ustida: "Tayanch uchun yozilgan namuna savollar, rasmiy <imtihon> savoli emas. Ball hisoblanmaydi."
- Har savolda "Namuna" yorlig'i, tekshirilmagan bo'lsa "tekshirilmagan".
- Imtihon tuzilishi, vaqt, mezon haqidagi har fakt faqat `src/data/manbalar.ts` dagi rasmiy ID bilan.

## 9. PR hajmi

- Bitta PR'ga ko'pi bilan 2 ta dars moduli (`CLAUDE.md`: bir vazifa = bitta sahifa yoki komponent).
- PR oldidan: `npm run savollar:tekshir` (0 farq), `npm run build`, a11y va kontrast, 390 va 1280 kenglik, qorong'i mavzu.
