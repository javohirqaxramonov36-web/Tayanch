# Admission E-seriya: holat

| Qism | Nomi | Status | Sana | Izoh |
|---|---|---|---|---|
| E0 | (BOSHQARUVCHI tayyorgarligi) | tugadi | 2026-11-20 | Reja va holat fayllari, CLAUDE.md bloki |
| E1 | Sxema va UI: Q9 javoblari | tugadi | 2026-11-20 | Yangi ixtiyoriy maydonlar, "kamida" xarajat, IELTS holati, foundation, ehtiyoj izohi, muddat o'tgan matni, grant.izoh Fakt; haqiqiy fakt yozilmagan |
| E2 | Universitetlar: yangi maydonlar + 7 ta bloklangan sayt | kutilmoqda | | |
| E3 | Grantlar: bloklangan va bo'sh faktlar, CSC kartasi | kutilmoqda | | |
| E4 | Qo'llanma shabloni | kutilmoqda | | |
| E5 | Qo'llanma: Stipendium Hungaricum | kutilmoqda | | |
| E6 | Qo'llanma: GKS | kutilmoqda | | |
| E7 | Qo'llanma: Xitoy hukumati granti (CSC) | kutilmoqda | | |
| E8 | Qo'llanma: MEXT | kutilmoqda | | |
| E9 | Boshqa bakalavr full ride grantlarini izlash | kutilmoqda | | |
| E10 | Yakuniy tekshiruv va hisobot | kutilmoqda | | |

## Keyingi agent uchun eslatma
- BOSHQARUVCHI (E0, 2026-11-20): ish papkasi worktree `Tayanch-SAT prep/.claude/worktrees/admission-d` (branch `admission-d`). Asosiy checkout'ga `cd` qilma, branch almashtirma. Build: `PATH=/opt/homebrew/bin:$PATH npm run build`.

- E1 (2026-11-20). O'zgargan fayllar: `src/lib/topAdmission/{sxema,fakt,universitetMoslik,grantKatalog,davlatTaqqos}.ts`, `src/components/topAdmission/UniKarta.astro`, yangi `src/components/topAdmission/GrantYoqIzoh.astro`, `src/pages/uz/top-admission/{universitetlar,grantlar,davlatlar}/index.astro`, yangi test `src/lib/topAdmission/testlar/e1.test.ts` (13 test, soxta fixture). Tekshiruv: build o'tdi, `npm test` 385/385, `malumot:tekshir` 0 xato, `npm run check` faqat eski 4 xato (SAT/navigator fayllari). Soxta tasdiqlangan qiymat bilan vaqtincha build qilib HTML tekshirildi, keyin `git checkout` bilan qaytarildi. Brauzerda 375/1280px ko'rilmagan (sinalmagan).
- E2/E3 kontent agentlari uchun konventsiyalar (E1 da qurilgan):
  - `kontrakt_eng_past` (sonFakt) universitetning `valyuta` sida yoziladi. "Kamida" rejimi faqat `davlat` = `buyuk-britaniya` yoki `janubiy-koreya` VA shu maydon mavjud bo'lsa yoqiladi; unda `yillik_xarajat` filtrda ishlatilmaydi. Davlat qismi = davlat faylidagi `narx.viza_yashash_summasi` (davlat `narx.valyuta` sida). Ikkalasi tasdiqlanmaguncha universitet "Ma'lumot tekshirilmoqda" guruhida.
  - `ielts_holati`: yo'q bo'lsa "minimum" deb olinadi (`min_ielts`). "tavsiya" bo'lsa `ielts_tavsiya` (son, 0–9) to'ldirilsin; "talab_qilinmaydi" ning dalili `imtihonlar` faktida (manba_iborasi rasmiy matndagi IELTS talab qilinmasligi haqidagi gap bo'lsin). Dalil fakti tasdiqlanmaguncha universitet "tekshirilmoqda".
  - `foundation_kerak`: Fakt, qiymat "ha" | "yo'q" | "dasturga_qarab". Faqat tasdiqlangan "ha" "Foundation yili kerak" belgisini beradi.
  - `toliq_ehtiyoj: true` (oddiy boolean, universitet va grant fayllarida): kartada "Yordam miqdori oila daromadi asosida hisoblanadi; oila hissasi talab qilinishi mumkin." izohi (universitetda faqat `xalqaro_yordam_turi` tasdiqlangan bo'lsa). Sxema `toliq_ehtiyoj: true` + `toliq_qoplaydi.qiymat: true` ni XATO deb to'xtatadi. KAIST va Berea'ga `toliq_ehtiyoj` qo'ymang (ular "to'liq qoplaydi").
  - Davlat `grant.izoh`: endi Fakt (eski oddiy matn ham o'tadi, lekin ko'rsatilmaydi). Kartadagi matn qat'iy: "Rasmiy manbalarda o'zbek fuqarosi uchun davlat granti topilmadi (tekshirildi: SANA)" + havola; SANA = `tekshirilgan_sana`, havola = `source_url`. Faqat `davlat_grantlari` bo'sh va fakt tasdiqlangan bo'lsa chiqadi. `qiymat` ga shu jumlani yozing, `manba_iborasi` ga tekshirilgan sahifadagi aynan ibora.
  - Muddat o'tgan belgisi (grant va universitet): "Bu yilgi muddat o'tgan, keyingisi hali e'lon qilinmagan" tasdiqlangan YYYY-MM-DD deadline bugundan oldin bo'lsa avtomatik. Keyingi sana rasmiy e'lon qilinsa, deadline faktini yangi sana bilan yangilash kifoya.

## Muallif uchun savollar

