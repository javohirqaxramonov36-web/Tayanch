# EYUF Faza 0. IQ savollar inventari

`as_of: 2026-11-20`. Asosiy repo snapshoti `0aaa799059b573c5e33443a590018d3c5f1444a0`.

Tayanch El-yurt umidi jamg‘armasining rasmiy platformasi emas.

Manba IDlari [fact-sheet.md](fact-sheet.md) da. Bu hujjat savol soni, betlar va ma’lumot to‘liqligini qayd etadi. PREP_1ning 27 ochiq javobini mustaqil yechish boshqa chatda davom etmoqda. Bu branch savol fayllarini tahrir qilmaydi. Undagi keyingi natijalar bu snapshotdagi 73/27 nisbatini yangilashi mumkin.

## Faza 2 yangilanishi, 2026-11-21

PR #200 (`05d0a0104d441fce4a821247b58255911bbc9f06`) bilan asos yangilandi. 100 savoldan 88 javob tasdiqlangan, 12 ochiq. Birinchi test 19/20, ochiq savol `iq-1-09`. Qolgan ochiqlar 2-test 4,7,8,19; 3-test 13,15; 4-test 2; 5-test 4,6,17,20. Pastdagi 73/27 jadvali Faza 0 tarixiy snapshoti sifatida qoladi. Faza 2 namunasi `data/eyuf/questions-iq.json`da, 20 savol va 24 mavjud rasm qismi.

## Hisoblash chegarasi

| Manba | PDF betlari | Savol nomzodlari | Javob holati |
| --- | --- | --- | --- |
| S11, PREP_1 | 48 | 5 × 20 = 100 mavjud savol yozuvi | Snapshotda 73 tasdiqlangan, 27 ochiq |
| S12, PREP_2, C bloklari | 49 bet ichida 14 blok | C1–C10 bo‘yicha 140 pozitsiya, dastlabki inventar | 140 javobning barchasi mustaqil tekshirilmagan |
| S12, PREP_2, A/B | Shu PDFdagi chekka qismlar | 30 A va 18 B, jami 48 to‘liq ko‘rinadigan nomzod, dastlabki inventar | 48 javobning barchasi mustaqil tekshirilmagan |
| S12, PREP_2, parchalar | Quyidagi jadvalda | 8 A parchasi va 8 oldingi B/raqamsiz parcha | Yetishmagan qismlar to‘ldirilguncha importga tayyorligi `verified: false` |

Shunday qilib PREP_2 uchun **188 to‘liq ko‘rinadigan savol nomzodi va 16 parcha** dastlabki hisobga olindi. `inventory_verified: false`. OCRga tayangan chegara hisoblari har savolni kesishda vizual tasdiqlanadi. Ikki manba bo‘yicha 100 + 188 = 288 yozuv nomzodi — dublikatlari ajratilmagan hisob. Noyob bank soni hozircha aniqlanmagan. PREP_2ning keyingi barcha qatorlari uchun `verified: false`.

Kitob testlari rasmiy EYUF imtihon varianti sifatida belgilanmaydi. S05da haqiqiy format 40 savol va 60 daqiqa. PREP_1ning har bir 20 savollik to‘plami IQ mashq to‘plami. To‘liq mock yig‘ish uchun darajaga mos ikkala bo‘lim qamrovi kerak.

## PREP_1 betlari va kalitlari

| Test | Savollar PDF betlari | Kalit PDF beti | Kalit bosma beti | Snapshotda true / false |
| --- | --- | --- | --- | --- |
| 1 | 1–10 | 47 | 317 | 18 / 2 |
| 2 | 11–20 | 47 | 317 | 13 / 7 |
| 3 | 21–30 | 48 | 318 | 15 / 5 |
| 4 | 31–37 | 48 | 318 | 17 / 3 |
| 5 | 38–46 | 48 | 318 | 10 / 10 |

Kalitlarning bosma/PDF bet farqi bu sessiyada tasvirda qayta tekshirildi. 47-betda boshqa `C10-test` kaliti ham bor. U ushbu 5 ta IQ testga qo‘shilmaydi. QR-kodlar va video manzillari mahsulotga olinmaydi.

## PREP_1 dastlabki tur taqsimoti

Tasnif mavjud yechim izohlariga asoslangan ishchi guruhlash. `type_verified: false`. Bu belgi javobning `tekshirilgan` holatidan alohida. Tasnifni savol tasviri bilan yakunlash Faza 2 vazifasi.

| Katta guruh | Soni |
| --- | --- |
| fazoviy | 10 |
| figurali | 41 |
| harfli | 5 |
| matematik | 1 |
| sonli | 43 |
| **Jami** | **100** |

| type | Soni |
| --- | --- |
| `yetishmayotgan-qism` | 14 |
| `figura-sanash` | 3 |
| `analogiya` | 4 |
| `ortiqcha-figura` | 7 |
| `qalqon-naqsh-munosabati` | 9 |
| `keyingi-shakl` | 7 |
| `sonli-jadval-matritsa` | 17 |
| `son-ketma-ketligi` | 10 |
| `figuradagi-son` | 8 |
| `raqamli-kod` | 4 |
| `ortiqcha-son` | 2 |
| `tarozi-muvozanat` | 2 |
| `harf-ketma-ketligi` | 2 |
| `harf-kodi` | 3 |
| `bolaklardan-kvadrat` | 2 |
| `kub-yoyilmasi` | 5 |
| `matematik-masala` | 1 |

PREP_2 uchun quyi tur taqsimoti hali ajratilmagan. C guruhi 140 mantiqiy savol, A/B guruhi 48 matematik yoki matematik-mantiqiy nomzod sifatida sanaldi. Bular batafsil `type` teglari emas. Tasvir, OCR va takrorlarni birgalikda tekshirmay aniq subtip foizi chiqarilmaydi.

## PREP_1 savollar kesimida

`source.book: S11`, `contentSource: "book"`, `as_of: 2026-11-20`. Quyida `source.test`, `source.number`, PDF betlari va ishchi `type` berilgan. `answer_verified` joriy snapshotdagi qiymat, bu sessiyada yangidan yechilganlikni bildirmaydi. `type_verified: false` barcha qatorlarga tegishli.

| id | test / number | source.page, PDF | Ishchi type | answer_verified |
| --- | --- | --- | --- | --- |
| `iq-1-01` | 1 / 1 | 1 | `yetishmayotgan-qism` | true |
| `iq-1-02` | 1 / 2 | 1, 2 | `figura-sanash` | true |
| `iq-1-03` | 1 / 3 | 2, 3 | `analogiya` | true |
| `iq-1-04` | 1 / 4 | 3 | `ortiqcha-figura` | true |
| `iq-1-05` | 1 / 5 | 4 | `figura-sanash` | true |
| `iq-1-06` | 1 / 6 | 4 | `ortiqcha-figura` | true |
| `iq-1-07` | 1 / 7 | 5 | `sonli-jadval-matritsa` | true |
| `iq-1-08` | 1 / 8 | 5 | `son-ketma-ketligi` | true |
| `iq-1-09` | 1 / 9 | 5, 6 | `qalqon-naqsh-munosabati` | false |
| `iq-1-10` | 1 / 10 | 6 | `ortiqcha-figura` | true |
| `iq-1-11` | 1 / 11 | 7 | `figuradagi-son` | true |
| `iq-1-12` | 1 / 12 | 7 | `raqamli-kod` | true |
| `iq-1-13` | 1 / 13 | 7 | `son-ketma-ketligi` | true |
| `iq-1-14` | 1 / 14 | 8 | `son-ketma-ketligi` | true |
| `iq-1-15` | 1 / 15 | 8 | `ortiqcha-figura` | true |
| `iq-1-16` | 1 / 16 | 8 | `sonli-jadval-matritsa` | false |
| `iq-1-17` | 1 / 17 | 9 | `sonli-jadval-matritsa` | true |
| `iq-1-18` | 1 / 18 | 9 | `figuradagi-son` | true |
| `iq-1-19` | 1 / 19 | 9, 10 | `ortiqcha-figura` | true |
| `iq-1-20` | 1 / 20 | 10 | `sonli-jadval-matritsa` | true |
| `iq-2-01` | 2 / 1 | 11 | `keyingi-shakl` | true |
| `iq-2-02` | 2 / 2 | 11 | `keyingi-shakl` | true |
| `iq-2-03` | 2 / 3 | 12 | `sonli-jadval-matritsa` | true |
| `iq-2-04` | 2 / 4 | 12, 13 | `qalqon-naqsh-munosabati` | false |
| `iq-2-05` | 2 / 5 | 13, 14 | `analogiya` | true |
| `iq-2-06` | 2 / 6 | 14 | `sonli-jadval-matritsa` | true |
| `iq-2-07` | 2 / 7 | 14 | `harf-ketma-ketligi` | false |
| `iq-2-08` | 2 / 8 | 14, 15 | `bolaklardan-kvadrat` | false |
| `iq-2-09` | 2 / 9 | 15 | `raqamli-kod` | true |
| `iq-2-10` | 2 / 10 | 15, 16 | `qalqon-naqsh-munosabati` | true |
| `iq-2-11` | 2 / 11 | 16 | `ortiqcha-son` | true |
| `iq-2-12` | 2 / 12 | 16, 17 | `yetishmayotgan-qism` | false |
| `iq-2-13` | 2 / 13 | 17 | `yetishmayotgan-qism` | false |
| `iq-2-14` | 2 / 14 | 18 | `kub-yoyilmasi` | true |
| `iq-2-15` | 2 / 15 | 18 | `son-ketma-ketligi` | true |
| `iq-2-16` | 2 / 16 | 19 | `qalqon-naqsh-munosabati` | false |
| `iq-2-17` | 2 / 17 | 19 | `son-ketma-ketligi` | true |
| `iq-2-18` | 2 / 18 | 20 | `figuradagi-son` | true |
| `iq-2-19` | 2 / 19 | 20 | `figuradagi-son` | false |
| `iq-2-20` | 2 / 20 | 20 | `raqamli-kod` | true |
| `iq-3-01` | 3 / 1 | 21 | `sonli-jadval-matritsa` | true |
| `iq-3-02` | 3 / 2 | 21, 22 | `matematik-masala` | true |
| `iq-3-03` | 3 / 3 | 22 | `keyingi-shakl` | true |
| `iq-3-04` | 3 / 4 | 23 | `qalqon-naqsh-munosabati` | true |
| `iq-3-05` | 3 / 5 | 23 | `figuradagi-son` | true |
| `iq-3-06` | 3 / 6 | 24 | `yetishmayotgan-qism` | true |
| `iq-3-07` | 3 / 7 | 24 | `analogiya` | true |
| `iq-3-08` | 3 / 8 | 25 | `qalqon-naqsh-munosabati` | true |
| `iq-3-09` | 3 / 9 | 25, 26 | `yetishmayotgan-qism` | true |
| `iq-3-10` | 3 / 10 | 26 | `keyingi-shakl` | true |
| `iq-3-11` | 3 / 11 | 27 | `kub-yoyilmasi` | false |
| `iq-3-12` | 3 / 12 | 27 | `sonli-jadval-matritsa` | true |
| `iq-3-13` | 3 / 13 | 28 | `tarozi-muvozanat` | false |
| `iq-3-14` | 3 / 14 | 28 | `figuradagi-son` | false |
| `iq-3-15` | 3 / 15 | 28, 29 | `sonli-jadval-matritsa` | false |
| `iq-3-16` | 3 / 16 | 29 | `son-ketma-ketligi` | true |
| `iq-3-17` | 3 / 17 | 29 | `harf-ketma-ketligi` | true |
| `iq-3-18` | 3 / 18 | 29 | `son-ketma-ketligi` | true |
| `iq-3-19` | 3 / 19 | 30 | `sonli-jadval-matritsa` | true |
| `iq-3-20` | 3 / 20 | 30 | `kub-yoyilmasi` | false |
| `iq-4-01` | 4 / 1 | 31 | `yetishmayotgan-qism` | true |
| `iq-4-02` | 4 / 2 | 31 | `ortiqcha-figura` | false |
| `iq-4-03` | 4 / 3 | 32 | `harf-kodi` | true |
| `iq-4-04` | 4 / 4 | 32 | `harf-kodi` | true |
| `iq-4-05` | 4 / 5 | 32 | `sonli-jadval-matritsa` | true |
| `iq-4-06` | 4 / 6 | 32 | `ortiqcha-son` | true |
| `iq-4-07` | 4 / 7 | 33 | `analogiya` | true |
| `iq-4-08` | 4 / 8 | 33 | `sonli-jadval-matritsa` | true |
| `iq-4-09` | 4 / 9 | 33 | `son-ketma-ketligi` | true |
| `iq-4-10` | 4 / 10 | 33 | `son-ketma-ketligi` | true |
| `iq-4-11` | 4 / 11 | 33, 34 | `kub-yoyilmasi` | true |
| `iq-4-12` | 4 / 12 | 34 | `qalqon-naqsh-munosabati` | true |
| `iq-4-13` | 4 / 13 | 35 | `tarozi-muvozanat` | true |
| `iq-4-14` | 4 / 14 | 35, 36 | `yetishmayotgan-qism` | true |
| `iq-4-15` | 4 / 15 | 36 | `yetishmayotgan-qism` | true |
| `iq-4-16` | 4 / 16 | 36 | `yetishmayotgan-qism` | false |
| `iq-4-17` | 4 / 17 | 36 | `son-ketma-ketligi` | true |
| `iq-4-18` | 4 / 18 | 37 | `figuradagi-son` | false |
| `iq-4-19` | 4 / 19 | 37 | `yetishmayotgan-qism` | true |
| `iq-4-20` | 4 / 20 | 37 | `ortiqcha-figura` | true |
| `iq-5-01` | 5 / 1 | 38 | `figura-sanash` | false |
| `iq-5-02` | 5 / 2 | 38 | `figuradagi-son` | true |
| `iq-5-03` | 5 / 3 | 38 | `raqamli-kod` | true |
| `iq-5-04` | 5 / 4 | 39 | `keyingi-shakl` | false |
| `iq-5-05` | 5 / 5 | 39 | `yetishmayotgan-qism` | false |
| `iq-5-06` | 5 / 6 | 39, 40 | `bolaklardan-kvadrat` | false |
| `iq-5-07` | 5 / 7 | 40 | `yetishmayotgan-qism` | true |
| `iq-5-08` | 5 / 8 | 41 | `qalqon-naqsh-munosabati` | true |
| `iq-5-09` | 5 / 9 | 41 | `qalqon-naqsh-munosabati` | true |
| `iq-5-10` | 5 / 10 | 42 | `yetishmayotgan-qism` | true |
| `iq-5-11` | 5 / 11 | 42 | `sonli-jadval-matritsa` | true |
| `iq-5-12` | 5 / 12 | 43 | `kub-yoyilmasi` | false |
| `iq-5-13` | 5 / 13 | 43 | `sonli-jadval-matritsa` | true |
| `iq-5-14` | 5 / 14 | 44 | `keyingi-shakl` | false |
| `iq-5-15` | 5 / 15 | 44 | `keyingi-shakl` | false |
| `iq-5-16` | 5 / 16 | 45 | `harf-kodi` | true |
| `iq-5-17` | 5 / 17 | 45 | `sonli-jadval-matritsa` | false |
| `iq-5-18` | 5 / 18 | 45 | `sonli-jadval-matritsa` | true |
| `iq-5-19` | 5 / 19 | 45, 46 | `yetishmayotgan-qism` | false |
| `iq-5-20` | 5 / 20 | 46 | `sonli-jadval-matritsa` | false |

## PREP_1 ochiq javoblar

`verified: false`, `source: S11` va snapshotdagi `src/lib/eyuf/iq/tekshiruv.md`.

| Test | Savol raqamlari | Soni |
| --- | --- | --- |
| 1 | 9, 16 | 2 |
| 2 | 4, 7, 8, 12, 13, 16, 19 | 7 |
| 3 | 11, 13, 14, 15, 20 | 5 |
| 4 | 2, 16, 18 | 3 |
| 5 | 1, 4, 5, 6, 12, 14, 15, 17, 19, 20 | 10 |

5-test 17-savolda uchinchi variant harfi PDFda takror D bosilgan. Joriy UI uchinchi variantni C, to‘rtinchisini D sifatida ko‘rsatadi. Bu nuqta va yechim tekshiruvi ochiq. Mavjud 116 rasm qismi ayrim savollarning betlararo davom etishini hisobga oladi. Ularni qayta kesishdan oldin mavjud kesimlar tekshiriladi.

## PREP_2 C bo‘limlarining bet xaritasi

`source.book: S12`, `contentSource: "book"`, `verified: false`. `prep2-01` kabi nomlar inventar identifikatori. Ular kitobdagi rasmiy test nomi sifatida ishlatilmaydi. Savol raqamlari har blok ichida C1–C10. Kalit keyingi tur sarlavhasidan oldin turadi, keyingi sarlavhani oldingi kalitga biriktirish xato bo‘ladi.

| Inventar bloki | Savollar PDF betlari | Bosma betlar | Kalit PDF beti | Savollar |
| --- | --- | --- | --- | --- |
| prep2-01 | 1–3 | 10–12 | 3 | C1–C10 |
| prep2-02 | 4–6 | 17–19 | 6 | C1–C10 |
| prep2-03 | 7–9 | 28–30 | 9 | C1–C10 |
| prep2-04 | 10–13 | 38–41 | 13 | C1–C10 |
| prep2-05 | 14–17 | 50–53 | 17 | C1–C10 |
| prep2-06 | 18–20 | 62–64 | 20 | C1–C10 |
| prep2-07 | 21–24 | 73–76 | 24 | C1–C10 |
| prep2-08 | 25–28 | 84–87 | 28 | C1–C10 |
| prep2-09 | 29–31 | 96–98 | 31 | C1–C10 |
| prep2-10 | 32–35 | 107–110 | 35 | C1–C10 |
| prep2-11 | 36–38 | 118–120 | 38 | C1–C10 |
| prep2-12 | 39–42 | 128–131 | 42 | C1–C10 |
| prep2-13 | 43–46 | 138–141 | 46 | C1–C10 |
| prep2-14 | 47–49 | 149–151 | 49 | C1–C10 |

**Tekshirilmagan javoblar ro‘yxati** — yuqoridagi 14 blokning har birida C1–C10, jami 140. Kitob kaliti mavjudligi `verified: true`ga yetarli asos emas. Mazkur sessiyada bu savollarga yangi yechim yozilmadi.

## PREP_2 A/B nomzodlari va parchalar

`source.book: S12`, `verified: false`. Bu jadvalda savolning to‘liq ko‘rinishi va javobning to‘g‘riligi alohida. “To‘liq nomzod” kesish, variantlar va kalit mosligini yakuniy tekshiruvdan o‘tkazilishi kerakligini bildiradi. A/B kalitlari jadvalda bo‘lsa ham shu PDFda barcha A/B shartlari mavjud emas.

| PDF beti | To‘liq ko‘rinadigan nomzodlar | Ochiq parcha |
| --- | --- | --- |
| 4 | — | Oldingi raqamsiz masalaning ruscha davomi va variantlari |
| 6 | A1 | — |
| 7 | — | Oldingi raqamsiz masalaning ruscha davomi va variantlari |
| 9 | A1–A4 | A5 sharti, variant/davomi yetishmaydi |
| 10 | B9–B10 | Oldingi savolning faqat variantlari |
| 13 | A1–A2 | — |
| 14 | B10 | Oldingi raqamsiz g‘isht masalasining davomi |
| 17 | A1–A2 | — |
| 18 | B10 | — |
| 21 | B10 | Oldingi raqamsiz harf/son masalasining davomi |
| 24 | A1–A3 | A4 sharti, variant/davomi yetishmaydi |
| 25 | B8–B10 | — |
| 28–29 | A1–A2, A2 variantlari keyingi betda | — |
| 31 | A1–A2 | A3 sharti, variant/davomi yetishmaydi |
| 32 | — | Oldingi raqamsiz halqalar masalasining davomi |
| 35 | A1–A3 | A4 sharti, variant/davomi yetishmaydi |
| 36 | B9–B10 | — |
| 38 | A1 | A2 sharti, variant/davomi yetishmaydi |
| 39 | B9–B10 | Oldingi raqamsiz perimetr masalasining davomi |
| 42 | A1–A3 | A4 sharti, variant/davomi yetishmaydi |
| 43 | B7–B10 | — |
| 46 | A1–A4 | A5 sharti, variant/davomi yetishmaydi |
| 47 | B9–B10 | Oldingi raqamsiz navbat masalasining davomi |
| 49 | A1–A3 | A4 sharti, variant/davomi yetishmaydi |

**Tekshirilmagan javoblar ro‘yxati** — jadvaldagi barcha 48 to‘liq A/B nomzod. Bet oralig‘i ularning vaqtinchalik manba identifikatori. Tur nomi va kalitga mosligi tasdiqlanguncha yangi doimiy savol IDsi berilmaydi. 16 parcha alohida qoladi.

## Keyingi import oldidan

- `source`ga kitob, haqiqiy test/tur, PDF bet va savol raqami kiritiladi. Bosma bet metadata sifatida alohida saqlanadi.
- Rasm faqat savol va variantlarni qamraydi. Ayniqsa PREP_2da kalit bilan yonma-yon QR mavjud. Kalit/QR/video qismlari rasmga kirmaydi.
- Kitoblararo takrorlar tekshiriladi. PREP_1dagi ayrim harfli, tarozi va kub savollari PREP_2dagi ayrim C bloklariga o‘xshaydi. Dublikat ko‘rilmasdan “yangi 188 savol” deb nashr qilinmaydi.
- Sonli va harfli shart/variantlar accessibility uchun matnga ko‘chiriladi. Figuralar uchun ma’noli alt va yaqinlashtirish kerak.
- Yechim, qadamlar va tur tuzog‘i mustaqil tekshiriladi. `verified: true` faqat yechim va kalit mosligi tasdiqlangach qo‘yiladi.
- Mock uchun tasdiqlangan savollar saralanadi. Yetarli va darajaga mos qamrov bo‘lmasa mock ochilmaydi.
- Barcha kitob materialiga `contentSource: "book"` umumiy o‘chirgichi qo‘llanadi. Bu sxema va migratsiya Faza 2da kelishiladi.
