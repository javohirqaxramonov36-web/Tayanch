# 005. Bino qoidasi: poydevor va qavat mini-DS'i, Liquid Glass qaytadi

- **Holat**: qabul qilingan. Muallif 2026-11-17 da qavatlar "kuchli farq" qilishini va Liquid Glass poydevorini tanladi, 2026-11-18 da o'tkazish rejasini va shishaning qaytishini tasdiqladi ("Ha, PR 1 dan boshla").
- **Manba**: Claude Design artifakti "Tayanch Design System" https://claude.ai/artifact/MSiB7vTDiz7ri565yM2iwt, versiya 15 (2026-11-18): `README.md`, `tokens.json`, `components/bundle.css`, `qavat-1-navigator.md` … `qavat-5-eyuf.md`.
- **Almashtiradi**: `DESIGN.md` dagi "besh qavat bir xil ko'rinadi, faqat urg'u rangi farq qiladi" g'oyasi va "Sirtlar (shishasiz)" qarori (2026-11-13).
- **Bog'liq**: `DESIGN.md` "Bino qoidasi", "Sirtlar", "Taqiqlar".

## Kontekst

2026-11-13 da glassmorphism saytdan butunlay olib tashlangan edi. Bu dizayn qarori edi, tezlik muammosi tasdiqlanmagan. 2026-11-17 da muallif yo'nalishni o'zgartirdi. Endi bitta bosh tizim (poydevor) bor, har qavatning esa o'z kuchli mini-DS'i: palitra, sarlavha shrifti, motiv va karta shakli. Shisha poydevorning asosiy materiali bo'ladi. Beshala qavat artifaktda qoralama sifatida qurildi va ikkala mavzuda tekshirildi.

## Qaror

1. **Ikki qatlam.** Poydevor hamma qavatda bir xil: Onest matni, `space-*`, `radius-*`, fokus, holat ranglari, Lift, yon panel, hisob bandi, kontrast qoidasi va Liquid Glass materiali. Qavat o'zi belgilaydi: sarlavha va raqam shrifti, fon, urg'u, motiv, karta va hero tuzilmasi.
2. **Liquid Glass qaytadi**, himoya qoidalari bilan:
   - uzun matn, forma, test va savol ekrani faqat zich shishada;
   - ichma-ich blur yo'q;
   - `prefers-reduced-transparency` bo'lsa yoki `backdrop-filter` yo'q bo'lsa, sirt zich yoki tekis bo'ladi;
   - kontrast eng yomon holatda hisoblanadi: shaffof shisha nur dog'i markazida turganda.
3. **Qavat tokenlari prefiks bilan**: `nav-*`, `adm-*`, `sat-*`, `ielts-*`, `eyuf-*`. Bir qavat komponenti boshqa qavat tokenini ishlatmaydi.
4. **Qavat belgi ranglari** (`floor-*-500`):

   | Qavat | Rang | Holat |
   | --- | --- | --- |
   | 1 | laym `#B8D02C` | yangi |
   | 2 | to'q sariq `#FF5A0C` | yangi |
   | 3 | ko'k `#2F86FF` | o'zgarmaydi |
   | 4 | elektr ko'k `#2760DE` | yangi |
   | 5 | zumrad `#10895F` | yangi |

   3 va 4-qavat ikkalasi ko'k (farq 1.57:1, muallif qarori 2026-11-18). Ular shrift (Sora / Lexend), motiv va qavat raqami bilan ajraladi. Lift va binoda rang doim raqam bilan keladi.
5. **Shriftlar.** Matn hamma joyda Onest. Har qavatning sarlavha shrifti:

   | Qavat | Shrift |
   | --- | --- |
   | 1 | Barlow Condensed va JetBrains Mono |
   | 2 | Onest 800 |
   | 3 | Sora |
   | 4 | Lexend |
   | 5 | Playfair Display |

   Shriftlar saytning o'zidan (`@fontsource`) yuklanadi, har qavat faqat o'z shriftini oladi.
   - Sora'da `ʻ`/`ʼ` yo'q, shuning uchun u faqat inglizcha SAT matnida ishlatiladi.
   - JetBrains Mono'da `ʻ` yo'q, belgi zaxira shriftdan chiqadi. Muallif buni qabul qildi (2026-11-18), mono yorliq qisqa saqlanadi.
6. **Asosiy tugma.**
   - Poydevorda bu to'q kapsula `.t-tugma`, ostida qavat nuri.
   - Qavat mini-DS'i bitta urg'u kapsula varianti berishi mumkin. U o'z tokenidan oladi (`adm-accent`, `sat-blue-fill`, `ielts-accent`, `eyuf-accent`) va sahifada bitta bo'ladi.
   - `floor-*-500` CTA, havola yoki holat rangi bo'lmaydi.

## O'tkazish (har biri alohida PR, ketma-ket)

| # | Branch | Mazmun |
| --- | --- | --- |
| 1 | `ds-bino-qoidasi` | Shu ADR, `DESIGN.md`, `CLAUDE.md` (faqat hujjat) |
| 2 | `ds-poydevor-shisha` | `glass-*`, `btn-glass-*`, `floor-*-glow` tokenlari va `.t-fon`, `.t-shisha`, `.t-tugma` stillari. Sahifalar hali ishlatmaydi |
| 3 | `ds-qavat-ranglari` | 1, 2, 4, 5-qavat shkalalari yangi tusga, Lift va bino kontrasti |
| 4 | `ds-shriftlar` | `@fontsource` shriftlari, qavat bo'yicha yuklash |
| 5a–5d | `ds-sat-*` | SAT: kirish, vositalar, savol ekranlari, tab bar |
| 6 | `ds-navigator` | 1-qavat |
| 7 | `ds-top-admission` | 2-qavat |
| 8 | `ds-ielts` | 4-qavat |
| 9 | `ds-eyuf` | 5-qavat |

To'liq reja PR 1 tavsifida. Qavat o'z PR'iga yetguncha uning sahifalari hozirgi shishasiz ko'rinishda qoladi.

## Ochiq (keyingi PR'larda)

- **Telefonda tezlik.** `backdrop-filter` past darajali Android'da sinalmagan. PR 2 dan boshlab haqiqiy telefonda tekshiriladi, tekshirilmaguncha "sinalmagan" deb yoziladi.
- **Harakat davomiyligi.** Artifakt README'sida 150 / 250 / 400ms yozilgan, saytda esa 120–200ms (2026-11-13). Saytdagi qiymat amal qiladi, artifakt shunga moslanadi.
- **Kontrast hisobi.** Artifaktdagi raqamlar repoga o'tkazilganda node bilan qayta hisoblanadi (`contrast`).

## Muqobillar (tanlanmadi)

- **Bitta umumiy ko'rinish, qavat faqat urg'u rangi bilan** (2026-11-09 dan 2026-11-17 gacha amalda bo'lgan). Muallif qavatlar kuchliroq farq qilishini xohladi.
- **4-qavat IELTS binafshaga o'tkazish** (SAT bilan farq 2.16). Muallif ko'kni saqladi.
