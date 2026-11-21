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

## Admission G (2-bosqich)
- `src/data/topAdmission/arzonYollar.json` (6 yo'l, faktlar `muallif`, sarlavhalar o'zbekcha skriptdagi `YOL_NOMI` dan) va `ochiqManbalar.json` (24 manba, guruh `RESURS_GURUH` dan). Ikkalasi ham shu import skripti bilan yoziladi.
- Sahifalar statik, JS yo'q: `/uz/top-admission/arzon-yollar/`, `/uz/top-admission/manbalar/`. Yon panel "Qo'llanmalar" guruhida.

## Admission H (3-bosqich, 1-qism: kurs va 1–8-darslar)
- Spetsifikatsiya muallif tomonidan tasdiqlangan (2026-11-21): DarsQolip (test darslari) o'rniga yozish ustaxonasi formati.
- Ma'lumot `src/data/topAdmission/kurs.ts` (16 dars, 4 modul, bakalavr va magistratura yo'llari). To'plamda yo'q misol, mezon va keyingi qadam original yozilgan, `qoshilgan` maydonida belgilangan (muallif ko'rigi uchun).
- Sahifalar `/uz/top-admission/kurs/` va `/uz/top-admission/kurs/<slug>/` (hozir 1–8). Mezonlar checkbox, progress `tayanch:top-admission-kurs-progress` (`src/lib/topAdmission/kursProgress.ts`, testlar `kurs.test.ts`).
- 2-qism (Admission I): 9–16-darslar `kurs.ts` ga qo'shildi; 16-darsda to'plamdagi "Mustaqil baholash" rubrikasi. Hamma 16 dars sahifasi bor.
- Keyingi: 3-qism shablonlar va namunalar.

## Ochiq
- Yangi 13 davlatda narx, til, ishlash va diplom faktlari yo'q ("Ma'lumot tekshirilmoqda").
- DAAD (barcha yo'nalishlar), Malaysia, POSTECH, CSC grantlari to'plamda yo'q, katalogda avvalgidek yashirin.
- Keyingi bosqich: kurs (16 dars) va shablonlar (12, original namunalar "Namuna" belgisi bilan); interaktiv bo'lsa avval spetsifikatsiya.
