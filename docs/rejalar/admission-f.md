# Admission F: Codex tadqiqot to'plamini saytga ko'chirish

Manba: `~/Tayanch/03-tadqiqot/top-admission-tadqiqot/2026-11-20/` (repodan tashqarida). Muallif qarori (2026-11-21): to'plamdagi hamma ma'lumot ko'chiriladi, u tekshirilgan.

## Yangi fakt holati "muallif"
- `src/lib/topAdmission/fakt.ts`: `FaktHolati` ga `muallif`. Saytda `tasdiqlangan` kabi ko'rinadi (`faktKorinadimi`).
- `sxema.ts`: `muallif` da qiymat, `source_url`, `tekshirilgan_sana` majburiy, `manba_iborasi` shart emas (to'plamda rasmiy iboralar yo'q).
- Test: `src/lib/topAdmission/testlar/f.test.ts`.

## Import (1-bosqich: davlatlar va grantlar)
- Skript: `npm run malumot:tadqiqot -- [to'plam papkasi]` (`scripts/malumot/tadqiqot-import.ts`). Qayta ishga tushirsa bir xil natija.
- Mavjud `tasdiqlangan` fakt ustidan yozilmaydi; faqat `topilmadi` bo'lsa to'plam qiymati qo'yiladi.
- 70 yangi grant, 17 mavjud grant boyitildi (20 yozuv: MEXT, GKS, KAIST ikki yozuvdan birlashtirildi), 13 yangi davlat va `yevropa-ittifoqi` (`kop_davlatli`, taqqoslashda ko'rinmaydi; Erasmus Mundus uchun).
- Grantda yangi `tadqiqot` bloki: to'plam ID'lari, qabul yili, asosiy talablar, qoladigan xarajat, shartlar. Katalog kartasida "Talablar va qoladigan xarajat" ichida.
- Davlatda yangi `xavfsizlik` (AQSH Davlat departamenti ogohlantirishi, Jahon banki WGI siyosiy barqarorlik) va `tanlov` (STEM universitet misollari, izoh, rasmiy ta'lim portali). Taqqoslash jadvaliga ikki satr qo'shildi.
- Deadline: faqat to'plamda tasdiqlangan 7 sana YYYY-MM-DD; qolganlari holat matni (countdown va kalendar yo'q). AT01 bekor, UK05 yopiq, US12 tarixiy, US19 mahalliy e'lon holatlari matnda saqlangan.
- Grant turi: hukumat, hudud va konsorsium dasturlari `davlat` (`DAVLAT_GRANTI` ro'yxati skriptda), qolgani `universitet`. "To'liq qoplaydi" belgisi qo'yilmadi (to'plamda aniq fakt yo'q).

## Ochiq
- Yangi 13 davlatda narx, til, ishlash va diplom faktlari yo'q ("Ma'lumot tekshirilmoqda").
- DAAD (barcha yo'nalishlar), Malaysia, POSTECH, CSC grantlari to'plamda yo'q, katalogda avvalgidek yashirin.
- Keyingi bosqichlar: xarajat yo'llari (6) va ochiq manbalar kutubxonasi (24), so'ng kurs (16 dars) va shablonlar (spetsifikatsiya bilan).
