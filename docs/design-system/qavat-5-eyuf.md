# 5-qavat EYUF prep

EYUF prep — "El-yurt umidi" jamg'armasi dasturlariga tayyorgarlik qavati. Uning tili **zumrad va oltin**: chuqur zumrad tun (yoki fil suyagi kun), zich shisha panellar, ingichka shampan-oltin chiziqlar va serif sarlavhalar. Kayfiyat: nufuzli, xotirjam, rasmiy hujjatdek ishonchli. Boshqa qavatlar sans-serif, EYUF esa binodagi yagona serif qavat.

Ilhom (muallif tanladi, 2026-11-18): Pinterest'dagi qorong'i zumrad "premium" bank ilovasi (ref/10, pin 996280748848205489): zumrad-qora fon, zumrad nurli shisha kartalar, oltin halqa, serif raqamlar, doira ikonkali ro'yxat, donut ko'rsatkich. Faqat g'oya va o'lchangan ranglar olingan; tasvir, matn, bank mavzusi ko'chirilmagan.

## Palitra

- Qorong'i mavzu asosiy: fon `eyuf-night` (`#0A1A14`, ref/10 o'lchovi `#0B1B15`), matn `eyuf-text`. Yorug' mavzu "fil suyagi": fon `eyuf-ivory`, matn `eyuf-ink`. Ikkalasi `eyuf-bg` / `eyuf-text` orqali.
- Urg'u faqat bitta: `eyuf-accent` zumrad fill (asosiy tugma, joriy bosqich). Ustida doim `eyuf-on-accent` oq (5.3 / 5.1:1).
- Oddiy o'lchamdagi zumrad matn, ikonka va halqa ko'rsatkich `eyuf-accent-text`.
- **Oltin urg'u emas, material.** `eyuf-gold` serif raqam, kursiv urg'u so'z va yulduzcha uchun (kichik matnda ham 5:1+). `eyuf-gold-line` orbita, yorliq chizig'i, ikkinchi tugma va doira cheti uchun, faqat bezak. Oltin tugma, havola yoki holat rangi bo'lmaydi.
- Shisha: `eyuf-glass` (hero, bosqich kartasi, qisqa matn), `eyuf-glass-strong` (ro'yxat, ko'rsatkich, matnli panel, forma), chet `eyuf-glass-border` (qorong'ida shampan tusli), doira foni `eyuf-tile`.
- Nur: orqa fon dog'lari `floor-eyuf-glow`, orbita ichidagi xira nur `eyuf-halo`. Bezak.
- **Belgi rangi yangilandi**: `floor-eyuf-500` `#3BD879` dan zumrad `#10895F` ga. Navigator laymi bilan yorug'lik farqi 1.07 dan 2.54 ga oshdi, ton 158° / 68°. 2-qavat to'q sarig'i bilan yorug'lik farqi 1.41: qizil-yashil ko'rishi sust foydalanuvchida kam seziladi, shuning uchun Lift va binoda rang doim qavat raqami bilan keladi. SAT va IELTS ko'kidan ton bilan ajraladi (1.25).

## Tipografiya

- Sarlavha va raqam: **Playfair Display** (`eyuf` oilasi), 600, oddiy registr. Urg'u so'z kursiv va `eyuf-gold`. Uslublar `eyuf-hero`, `eyuf-h2`, `eyuf-raqam`.
- Boshqa qavatlardan farqi: Navigator Barlow Condensed, Admission Onest 800, SAT Sora, IELTS Lexend; hammasi sans. EYUF yagona serif.
- `oʻ`, `gʻ` (U+02BB) va `ʼ` (U+02BC) Playfair Display'da bor: brauzerda kenglik o'lchovi bilan tekshirildi (2026-11-18). Fraunces, DM Serif Display, Newsreader, Instrument Serif'da bu belgi yo'q (fallback chiqdi), shuning uchun olinmadi.
- Yorliq `eyuf-yorliq` (Onest 600, 12px, katta harflar, 0.14em), oldida 20px oltin chiziq. Matn poydevordagi `body`.
- Raqamlar `lining-nums tabular-nums` (Playfair'ning standart raqamlari eski uslubda).

## Motiv

- **Oltin orbita** (`.eyuf-orbita`): asosiy obyekt (diplom, qalpoq, pasport) atrofida -14° qiya, 1.5px oltin ellips, ichida xira zumrad nur. IELTS halqasidan farqi: nur bermaydi, obyektni o'rab oladi. Ekranda bitta, faqat hero.
- **Yulduzcha** (`.eyuf-yulduz`): to'rt nurli oltin SVG yulduz, sarlavha yonida yoki orbitada. Ekranda ko'pi bilan ikkita.

## Tuzilma

- **Hero** (`EyufHero`): desktopda ikki ustun (chapda matn, o'ngda orbita), telefonda ustma-ust; matn chapga tekislangan.
- **Bosqichlar** (`EyufBosqich`): gorizontal kartalar, katta oltin serif raqam, holat chipi so'z bilan.
- **Tayyorlik** (`EyufTayyorlik`): zich shishada halqa ko'rsatkich va bandlar ro'yxati.
- **Ro'yxat** (`EyufRoyxat`): zich shisha ichida doira ikonkali qatorlar, holat so'zi, o'ngda chevron.
- Radius: panel `radius-xl`, karta `radius-lg`, qator `radius-md`, doira va tugma `radius-full`. Ajratish shisha va ingichka chiziq bilan, qattiq soya yo'q.
- Tugma, maydon, tab, Lift poydevordan; 5-qavatda nur zumrad (`data-floor="5"`). Asosiy tugma `.t-tugma.eyuf-tugma--urgu`, ikkinchisi oltin chetli `.t-tugma--ikkinchi`.

## Qilinmaydi

- Ikkinchi urg'u rangi: oltin faqat raqam, kursiv so'z va bezak chizig'i.
- Oltin yoki zumrad gradient matn, oltin metall tekstura.
- Orbitani har kartaga qo'yish.
- Uzun matn, test yoki forma shaffof `eyuf-glass` da.
- Manbasiz qoida, muddat, kvota yoki stipendiya miqdori: faqat jamg'armaning rasmiy manbasidan, manba va sana bilan; aks holda "Namuna".
- Jamg'arma logotipi, gerb, bayroq yoki rasmiy hujjat tasviri; odam yuzi bor foto.

## Saytga o'tkazish (keyingi bosqich)

- `tokens.css`: `--color-floor-eyuf-*` shkalasini zumradga o'zgartirish, `eyuf-*` tokenlarini qo'shish; Lift va bino kontrastini qayta tekshirish.
- Playfair Display'ni sayt shrift yuklashiga qo'shish (400 kerak emas: 500, 600, kursiv 500/600).
- 5-qavat sahifalari hali qurilmagan: avval rasmiy talablar `manba-tekshiruvchi` bilan yig'iladi.
