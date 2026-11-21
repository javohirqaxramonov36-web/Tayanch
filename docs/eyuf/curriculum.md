# EYUF Faza 1. To‘liq o‘quv reja

`as_of: 2026-11-20`. Holat — muallif tasdig‘i uchun qoralama. Faza 0ga tasdiq olindi. Ushbu hujjat darslar tarkibi va mahsulotlarini belgilaydi.

Tayanch El-yurt umidi jamg‘armasining rasmiy platformasi emas.

## Rejani o‘qish

Manba reyestri va fakt IDlari [fact-sheet.md](fact-sheet.md) da. Ochiq masalalar [gaps.md](gaps.md) da, savol qamrovi [iq-inventory.md](iq-inventory.md) da.

Har dars yozuvida topshiriqdagi barcha maydonlar ochiq berilgan. `content_blocks` — ishlab chiqiladigan kontent bloklarining spetsifikatsiyasi. `verified: false` darsning to‘liq matni, mashqi va barcha manbalari hali yakuniy ko‘rikdan o‘tmaganini bildiradi. Faktning tekshirilganligi Faza 0dagi tegishli ID orqali saqlanadi. Dars avtomatik nashrga tayyor deb hisoblanmaydi.

`T01` — muallifning ushbu chatdagi katta topshirig‘i va Tayanch metodik reja qarorlari. Dars davomiyligi taxminiy pedagogik reja, rasmiy imtihon vaqtidan alohida. S06 tarixiy 2025-2 nusxa sifatida ishlatiladi. G01 hal bo‘lguncha 2026-2 uchun rasmiy rubrika maqomi ochiq qoladi.

## Yo‘l va yakuniy mahsulotlar

| Kurs | Modul guruhi | O‘quvchi chiqaradigan natija |
| --- | --- | --- |
| c0, kursdan oldin | Diagnostika va reja | Moslik, imtihonsiz yo‘l, test istisnosi va kunlik reja |
| c1 | Hujjatlar, universitet va esse | Universitet/soha kartasi, chek-list, ma’lumotnoma qoralamasi va esse |
| c2 | Test bosqichi | Zaif turlar profili, yechim daftari, mashq/mock hisoboti va takrorlash navbati |
| c3 | Umumiy yadro, 20 trek, simulyatsiya | Shaxsiy javoblar, soha portfeli, esse himoyasi va o‘z bahosi |
| c4 | Natija va keyingi qadamlar | Apellyatsiya nazorati, shartnoma savollari, majburiyat taqvimi va B reja |

Har ikki daraja umumiy yadrodan foydalanadi. Magistr testida ilmiy-tadqiqot modullari alohida ustuvor. Testdan ozodlik tasdiqlansa c2ni ixtiyoriy mashq sifatida qoldirish mumkin. Imtihonsiz yo‘l bo‘yicha moslik kvota asosidagi g‘oliblik qaroridan alohida ko‘rsatiladi. Ma’lumot yetishmasa natija “aniqlashtirish kerak” bo‘ladi.

## Soha treklari tartibi

Faza 2da tartib `quotas.json`dagi tanlov, daraja va ochiq kvota qiymatlaridan olinadi. Musbat bakalavr kvotasi bor 15 soha avval, qolgan 5 soha keyin. Ichida kvota kamayishi bo‘yicha, teng bo‘lsa rasmiy jadval tartibi saqlanadi. AKTdagi qo‘shimcha AI o‘rinlari alohida metadata, umumiy qator bilan ikki marta yig‘ilmaydi. Quyidagi tartib 2026-2 snapshoti asosida. Nol bakalavr kvotali besh trekning barcha darslari hozir `master` bilan belgilangan. Keyingi tanlovda teglar qayta ko‘riladi.

| Trek moduli | Soha | bachelor ochiq | master ochiq |
| --- | --- | --- | --- |
| trek-muhandislik | Muhandislik ishi | 10 | 11 |
| trek-arxitektura | Arxitektura va qurilish | 10 | 9 |
| trek-ishlab-chiqarish | Ishlab chiqarish va ishlov berish | 9 | 9 |
| trek-akt | Axborot-kommunikatsiya texnologiyalari | 9 | 7 |
| trek-fizika | Fizika va tabiiy fanlar | 9 | 11 |
| trek-matematika | Matematika va statistika | 8 | 11 |
| trek-biologiya | Biologik va turdosh fanlar | 7 | 5 |
| trek-xizmat | Xizmat ko‘rsatish | 4 | 13 |
| trek-atrof-muhit | Atrof-muhit | 3 | 6 |
| trek-qishloq | Qishloq, o‘rmon, baliq xo‘jaligi | 3 | 10 |
| trek-transport | Transport xizmatlari | 3 | 9 |
| trek-biznes | Biznes va boshqaruv | 3 | 5 |
| trek-veterinariya | Veterinariya | 2 | 4 |
| trek-ijtimoiy | Ijtimoiy va xulq-atvor fanlari | 2 | 7 |
| trek-jurnalistika | Jurnalistika va axborot | 2 | 5 |
| trek-huquq | Huquq | 0 | 5 |
| trek-sogliq | Sog‘liqni saqlash va ijtimoiy ta’minot | 0 | 15 |
| trek-talim | Ta’lim | 0 | 6 |
| trek-sanat | San’at | 0 | 3 |
| trek-tillar | Tillar | 0 | 2 |

## Hudud kartalari

`c3-yadro-11` ichida Qoraqalpog‘iston Respublikasi, Andijon, Buxoro, Farg‘ona, Jizzax, Xorazm, Namangan, Navoiy, Qashqadaryo, Samarqand, Sirdaryo, Surxondaryo, Toshkent viloyati va Toshkent shahri kartalari rejalashtiriladi. Har birida tarix, shaxslar, sanoat, sana va birlamchi manba kataklari bo‘ladi. Faktlar G14 bo‘yicha yig‘iladi, hozir `verified: false`.

## Interaktiv ishlar bo‘yicha reja chegaralari

Bu bandlar Faza 3 oldidan tasdiqlanadigan xatti-harakat spetsifikatsiyasiga kirish ma’lumotidir.

- Progress uchun `tayanch:eyuf-kurs-progress:v1`, diagnostika/reja uchun `tayanch:eyuf-reja:v1` taklif qilinadi. Mavjud `tayanch:eyuf-iq:v1` holati uchun moslik rejasi Faza 2da yoziladi. Har saqlash/o‘qishda try/catch, buzilgan ma’lumot va saqlash taqiqlanganda sessiya ichida davom etish holati kerak.
- Hujjatlarning fayllari va pasport/sudlanganlik kabi sezgir dalillar yuklanmaydi. Diagnostika uchun zarur javoblarni minimal saqlash, alohida tozalash va foydalanuvchi roziligi taklif qilinadi. Esse qoralamasini doimiy saqlash alohida opt-in bilan kelishiladi.
- Ovoz lokal yoziladi. Standart rejada tab yopilgach saqlanib qolishi va’da qilinmaydi. Foydalanuvchi yuklab olishi mumkin. MediaRecorder ruxsati rad etilsa yozma mashq davom etadi. Brauzerda doimiy audio saqlash alohida qaror talab qiladi.
- IQda A–F varianti manbaga qarab, A/B/C/D klavishlari va mavjud E/F uchun ham tegishli klavishlar, mobil katta nishonlar, zoom va Escape talab qilinadi. Mashq izohi darhol, mock izohi yakunda chiqadi. Mockka faqat tasdiqlangan savol kiradi.
- Mavjud XP/combo qoidasidan qayta foydalaniladi. Badge, 60 soniyalik sprint, kunlik 10 savol streaki, tur mahorati va interval takrorlash parametrlari G15 bo‘yicha kelishiladi. “Kub ustasi”, “Ketma-ketlik ovchisi” nomlari muallif taklifi sifatida saqlanadi. Mukofotni qayta-qayta olishning oldi olinishi kerak.
- Yangilik har safar sana va manbasi bilan ko‘rsatiladi. Bekor qilingan yoki o‘rnini yangi hujjat olgan yozuv arxivga bog‘lanadi. Vaqtga asoslangan eskirish muddati G15 bo‘yicha kelishiladi.
- Ikkinchi bosqichdagi `interviewEngine` uchun sessiyani boshlash, savol olish, javobni qabul qilish, fikr olish va yakunlash operatsiyalari, xato/bekor qilish holatlari rejalashtiriladi. Hozirgi statik kartalar shu almashinuvni ta’minlashga mos tuziladi. AI rejimi keyingi bosqich belgisi bilan joy oladi, API kalitlari server chegarasida qoladi.
- B reja havolasi mavjud `/uz/top-admission/` kirishiga `yol()` bilan boradi. Filtr, taymer, mikrofon, diagrammaning matnli ekvivalenti va saqlash xatolari klaviatura, 360px va qorong‘i mavzu sinoviga kiritiladi.

## Dars yozuvlari

Quyidagi katalogda c3ning umumiy yadrosi, so‘ng 20 trek va simulyatsiya joylashgan. O‘quvchi o‘z darajasiga mos tanlangan trekdan keyin simulyatsiyaga o‘tadi. c4 natija bosqichida davom etadi.


### c0 / diagnostika. Diagnostika va shaxsiy reja

Modul natijasi — Moslik, imtihonsiz yo‘l, test istisnosi va kunlik reja haqidagi to‘rt qismli hisobot.

#### c0-diagnostika-01 · Profil va dalillar

```json
{
  "id": "c0-diagnostika-01",
  "course": "c0",
  "module": "diagnostika",
  "title": "Profil va dalillar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tanlovdagi holatini dalillari bilan qayd etadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tanlovdagi holatini dalillari bilan qayd etadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Daraja, soha, universitet, reyting tizimi va nashri, qabul xati, IELTS, SAT/GRE/GMAT/A-Level, yosh, hudud va qolgan kunlarni kiritish.",
  "output": "Shaxsiy tayyorgarlik profili.",
  "sources": [
    "S01 F01–F20",
    "S03",
    "S05",
    "S07",
    "G08–G09",
    "G13",
    "G16",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c0-diagnostika-02 · Moslik va istisnolar xaritasi

```json
{
  "id": "c0-diagnostika-02",
  "course": "c0",
  "module": "diagnostika",
  "title": "Moslik va istisnolar xaritasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi o‘z holatini Nizomdagi shartlarga solishtiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi o‘z holatini Nizomdagi shartlarga solishtiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Fuqarolik, staj, xorijda avval o‘qish, grant qamrovi, maktab turi va o‘qish shakli bo‘yicha savollarga javob berish.",
  "output": "Moslik hisoboti, imtihonsiz yo‘l va test istisnosi alohida, noaniq bandlari bilan.",
  "sources": [
    "S01 F01–F20",
    "S03",
    "S05",
    "S07",
    "G08–G09",
    "G13",
    "G16",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c0-diagnostika-03 · Muddatga mos reja

```json
{
  "id": "c0-diagnostika-03",
  "course": "c0",
  "module": "diagnostika",
  "title": "Muddatga mos reja",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qolgan vaqt va zaifliklariga mos ishlarni tanlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi qolgan vaqt va zaifliklariga mos ishlarni tanlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Kunlik ajratiladigan vaqt, test/suhbat sanasi va mavjud mahsulotlarni belgilab rejani tahrirlash.",
  "output": "Kunlik vazifalar, ustuvor modullar va qayta ko‘rish sanasi.",
  "sources": [
    "S01 F01–F20",
    "S03",
    "S05",
    "S07",
    "G08–G09",
    "G13",
    "G16",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c1 / yol. EYUF va ta’lim yo‘li

Modul natijasi — Moslik hisoboti va universitet/soha tanlash varag‘i.

#### c1-yol-01 · EYUF nima va qanday majburiyat bor?

```json
{
  "id": "c1-yol-01",
  "course": "c1",
  "module": "yol",
  "title": "EYUF nima va qanday majburiyat bor?",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qoplanadigan xarajat va majburiyatlarni bir sahifada jamlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi qoplanadigan xarajat va majburiyatlarni bir sahifada jamlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Xarajat va majburiyat kartalarini tegishli guruhga joylash.",
  "output": "Manbali imkoniyat va majburiyat varag‘i.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-yol-02 · Men mos kelamanmi?

```json
{
  "id": "c1-yol-02",
  "course": "c1",
  "module": "yol",
  "title": "Men mos kelamanmi?",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi darajasiga tegishli talablarni dalillar bilan tekshiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi darajasiga tegishli talablarni dalillar bilan tekshiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Diagnostika hisobotidagi har bandga tasdiq yoki yetishmagan dalil qo‘shish.",
  "output": "Yangilangan moslik hisoboti.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-yol-03 · Olti bosqich va imtihonsiz yo‘llar

```json
{
  "id": "c1-yol-03",
  "course": "c1",
  "module": "yol",
  "title": "Olti bosqich va imtihonsiz yo‘llar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi o‘ziga tegishli saralash yo‘lini ajratadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi o‘ziga tegishli saralash yo‘lini ajratadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Hujjat, uch imtihonsiz yo‘l, test va suhbatni shartlari bilan bog‘lash.",
  "output": "Shaxsiy tanlov yo‘li xaritasi.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-yol-04 · Universitet, reyting va xarajat chegarasi

```json
{
  "id": "c1-yol-04",
  "course": "c1",
  "module": "yol",
  "title": "Universitet, reyting va xarajat chegarasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi universitetni daraja, global reyting va xarajat manbasiga solishtiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi universitetni daraja, global reyting va xarajat manbasiga solishtiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "QS/THE nashri, universitetning aynan qaysi kampusi va dasturi, Jamg‘arma ro‘yxati hamda tuition chegarasini solishtirish.",
  "output": "Manbasi va tekshiruv sanasi bor universitet kartasi.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-yol-05 · Foundation yo‘lini tekshirish

```json
{
  "id": "c1-yol-05",
  "course": "c1",
  "module": "yol",
  "title": "Foundation yo‘lini tekshirish",
  "level": [
    "bachelor"
  ],
  "goal": "O‘quvchi foundation va bakalavrning umumiy muddatini tekshiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi foundation va bakalavrning umumiy muddatini tekshiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Foundation va bakalavr muddatlarini kiritib Kengash qarori kerak bo‘lgan bandlarni ajratish.",
  "output": "Foundation bo‘yicha savollar va dalillar varag‘i.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-yol-06 · Kvota va ustuvor mutaxassislik qidiruvi

```json
{
  "id": "c1-yol-06",
  "course": "c1",
  "module": "yol",
  "title": "Kvota va ustuvor mutaxassislik qidiruvi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi soha va mutaxassisligini tegishli tanlov jadvalidan topadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi soha va mutaxassisligini tegishli tanlov jadvalidan topadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Daraja va tanlov filtri, lotincha/kirillcha nom bo‘yicha qidiruv, AI qo‘shimcha qatorini ajratish.",
  "output": "Tanlov davri, ochiq/imtihonsiz kvota va mutaxassislik manbasi ko‘rsatilgan tanlov varag‘i.",
  "sources": [
    "S01 F01–F17",
    "S03",
    "S04",
    "S13",
    "G08",
    "G12–G13",
    "G17",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c1 / hujjat. Hujjatlar to‘plami

Modul natijasi — Darajaga mos chek-list va ma’lumotnoma qoralamasi.

#### c1-hujjat-01 · Bakalavr hujjatlari

```json
{
  "id": "c1-hujjat-01",
  "course": "c1",
  "module": "hujjat",
  "title": "Bakalavr hujjatlari",
  "level": [
    "bachelor"
  ],
  "goal": "O‘quvchi bakalavr hujjatlarini tayyorlik holati bilan tekshiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi bakalavr hujjatlarini tayyorlik holati bilan tekshiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Har hujjatga tayyor, yetishmaydi yoki aniqlashtirish kerak holatini qo‘yish.",
  "output": "Bakalavr chek-listi.",
  "sources": [
    "S01 F11–F16",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-hujjat-02 · Magistr hujjatlari

```json
{
  "id": "c1-hujjat-02",
  "course": "c1",
  "module": "hujjat",
  "title": "Magistr hujjatlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi magistr hujjatlarini ish staji va mavjud maqolalari bilan tekshiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi magistr hujjatlarini ish staji va mavjud maqolalari bilan tekshiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Diplom ilovasi, mehnat ma’lumoti, mavjud maqolalar va esse bandlarini belgilash.",
  "output": "Magistr chek-listi.",
  "sources": [
    "S01 F11–F16",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-hujjat-03 · Jamg‘arma shaklidagi ma’lumotnoma

```json
{
  "id": "c1-hujjat-03",
  "course": "c1",
  "module": "hujjat",
  "title": "Jamg‘arma shaklidagi ma’lumotnoma",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi shaxsiy, akademik va kasbiy yutuqlarini dalillari bilan tuzadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi shaxsiy, akademik va kasbiy yutuqlarini dalillari bilan tuzadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanch ish varag‘ida yutuq, sana, rol va dalilni kiritish, rasmiy blankaga moslashtirish uchun bo‘sh joylarni belgilash.",
  "output": "Rasmiy blankaga solishtirish kutilayotgan ma’lumotnoma qoralamasi.",
  "sources": [
    "S01 F11",
    "G11",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c1 / esse. Motivatsion esse ustaxonasi

Modul natijasi — Esse rejasi, muallifning o‘z ovozidagi qoralama va tahrirlangan esse.

#### c1-esse-01 · Esse tavsiyalari va tuzilma

```json
{
  "id": "c1-esse-01",
  "course": "c1",
  "module": "esse",
  "title": "Esse tavsiyalari va tuzilma",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi maslahat va joriy majburiy talablarni ajratadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi maslahat va joriy majburiy talablarni ajratadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "S08dagi hajm, tuzilma, shrift va haqiqiylik tavsiyalarini joriy topshirish talabi bilan solishtirish.",
  "output": "Manba maqomi ko‘rsatilgan esse tekshiruv varag‘i.",
  "sources": [
    "S01 F13–F14 F28",
    "S08 E01–E06",
    "S09 xona1 savol44",
    "G03",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-esse-02 · G‘oya, tajriba va uch dalil

```json
{
  "id": "c1-esse-02",
  "course": "c1",
  "module": "esse",
  "title": "G‘oya, tajriba va uch dalil",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi maqsadini uchta shaxsiy tajriba bilan asoslaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi maqsadini uchta shaxsiy tajriba bilan asoslaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Vaziyat, o‘z hissasi, natija va dalilni yozib eng tegishli uchalasini tanlash.",
  "output": "Uch dalilli esse rejasi.",
  "sources": [
    "S01 F13–F14 F28",
    "S08 E01–E06",
    "S09 xona1 savol44",
    "G03",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-esse-03 · Yozish, tahrir va suhbatga bog‘lash

```json
{
  "id": "c1-esse-03",
  "course": "c1",
  "module": "esse",
  "title": "Yozish, tahrir va suhbatga bog‘lash",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi esse da’volarini tekshirib himoya qilishga tayyorlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi esse da’volarini tekshirib himoya qilishga tayyorlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Kirish/asosiy qism/xulosa yozish, da’vo–dalil–mumkin bo‘lgan suhbat savoli jadvalini to‘ldirish.",
  "output": "Tahrirlangan esse va himoya savollari varag‘i.",
  "sources": [
    "S01 F13–F14 F28",
    "S08 E01–E06",
    "S09 xona1 savol44",
    "G03",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c1-esse-04 · Magistr essesi va tadqiqot bog‘liqligi

```json
{
  "id": "c1-esse-04",
  "course": "c1",
  "module": "esse",
  "title": "Magistr essesi va tadqiqot bog‘liqligi",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ish tajribasi va ilmiy qiziqishini esse maqsadiga bog‘laydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ish tajribasi va ilmiy qiziqishini esse maqsadiga bog‘laydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tadqiqot savoli, mavjud maqola va tajribadagi o‘z hissasini da’volarga moslash.",
  "output": "Magistr esse rejasi va himoya dalillari.",
  "sources": [
    "S01 F14 F28",
    "S08",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c1 / topshirish. Arizani yakunlash

Modul natijasi — Muddatli topshirish rejasi va yakuniy nazorat chek-listi.

#### c1-topshirish-01 · Platformada topshirish va tanlov grafigi

```json
{
  "id": "c1-topshirish-01",
  "course": "c1",
  "module": "topshirish",
  "title": "Platformada topshirish va tanlov grafigi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arizani tegishli davr va talablar bilan nazorat qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi arizani tegishli davr va talablar bilan nazorat qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Rasmiy platforma ketma-ketligini manbadan tekshirish, fayl mosligi, qabul xati, grant qamrovi va oxirgi sanani nazorat qilish.",
  "output": "Topshirish nazorat varag‘i va tasdiqni saqlash rejasi.",
  "sources": [
    "S01 F16",
    "S07",
    "G13",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c2 / kirish. Test formati va boshlang‘ich o‘lchov

Modul natijasi — Darajaga mos test xaritasi va zaif turlar profili.

#### c2-kirish-01 · Test nimani o‘lchaydi?

```json
{
  "id": "c2-kirish-01",
  "course": "c2",
  "module": "kirish",
  "title": "Test nimani o‘lchaydi?",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi darajasiga mos bloklar, vaqt va ballni izohlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi darajasiga mos bloklar, vaqt va ballni izohlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Bakalavr va magistr bloklarini ajratish, 40 savol/60 daqiqa formatini kitobdagi 20 savollik mashq bilan solishtirish.",
  "output": "Darajaga mos format varag‘i.",
  "sources": [
    "S01 F18–F20",
    "S05 F21–F26",
    "S11",
    "S12",
    "G02",
    "G09",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-kirish-02 · Testdan ozod bo‘lish

```json
{
  "id": "c2-kirish-02",
  "course": "c2",
  "module": "kirish",
  "title": "Testdan ozod bo‘lish",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi amaldagi sertifikat dalilini Nizom shartiga solishtiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi amaldagi sertifikat dalilini Nizom shartiga solishtiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "SAT/GRE/GMAT/A-Level shartlari va noaniq formatlarni belgilash, mos kelsa kursni ixtiyoriy mashq sifatida qoldirish.",
  "output": "Sertifikat tekshiruvi varag‘i va kursni o‘tish/o‘tkazish tanlovi.",
  "sources": [
    "S01 F18–F20",
    "S05 F21–F26",
    "S11",
    "S12",
    "G02",
    "G09",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-kirish-03 · Diagnostik test

```json
{
  "id": "c2-kirish-03",
  "course": "c2",
  "module": "kirish",
  "title": "Diagnostik test",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tasdiqlangan savollar orqali boshlang‘ich zaifliklarini topadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tasdiqlangan savollar orqali boshlang‘ich zaifliklarini topadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Darajaga mos tasdiqlangan bankdan boshlang‘ich mashq, xato turi va vaqtni qayd etish.",
  "output": "Tur bo‘yicha boshlang‘ich natija va ustuvor mashqlar.",
  "sources": [
    "S01 F18–F20",
    "S05 F21–F26",
    "S11",
    "S12",
    "G02",
    "G09",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c2 / trenajyor. Mantiq turlari va tadqiqot

Modul natijasi — Tur bo‘yicha yechim usullari va shaxsiy tuzoqlar daftari.

#### c2-trenajyor-01 · Son ketma-ketligi

```json
{
  "id": "c2-trenajyor-01",
  "course": "c2",
  "module": "trenajyor",
  "title": "Son ketma-ketligi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi son ketma-ketligi turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi son ketma-ketligi turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`son-ketma-ketligi` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Son ketma-ketligi uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-02 · Ortiqcha son

```json
{
  "id": "c2-trenajyor-02",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ortiqcha son",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ortiqcha son turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ortiqcha son turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`ortiqcha-son` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Ortiqcha son uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-03 · Sonli jadval va matritsa

```json
{
  "id": "c2-trenajyor-03",
  "course": "c2",
  "module": "trenajyor",
  "title": "Sonli jadval va matritsa",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi sonli jadval va matritsa turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi sonli jadval va matritsa turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`sonli-jadval-matritsa` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Sonli jadval va matritsa uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-04 · Figuradagi sonlar

```json
{
  "id": "c2-trenajyor-04",
  "course": "c2",
  "module": "trenajyor",
  "title": "Figuradagi sonlar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi figuradagi sonlar turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi figuradagi sonlar turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`figuradagi-son` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Figuradagi sonlar uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-05 · Raqamli kod almashtirish

```json
{
  "id": "c2-trenajyor-05",
  "course": "c2",
  "module": "trenajyor",
  "title": "Raqamli kod almashtirish",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi raqamli kod almashtirish turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi raqamli kod almashtirish turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`raqamli-kod` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Raqamli kod almashtirish uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-06 · Tarozi va muvozanat

```json
{
  "id": "c2-trenajyor-06",
  "course": "c2",
  "module": "trenajyor",
  "title": "Tarozi va muvozanat",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tarozi va muvozanat turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tarozi va muvozanat turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`tarozi-muvozanat` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Tarozi va muvozanat uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-07 · Figurada yetishmayotgan qism

```json
{
  "id": "c2-trenajyor-07",
  "course": "c2",
  "module": "trenajyor",
  "title": "Figurada yetishmayotgan qism",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi figurada yetishmayotgan qism turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi figurada yetishmayotgan qism turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`yetishmayotgan-qism` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Figurada yetishmayotgan qism uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-08 · Ortiqcha figura

```json
{
  "id": "c2-trenajyor-08",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ortiqcha figura",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ortiqcha figura turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ortiqcha figura turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`ortiqcha-figura` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Ortiqcha figura uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-09 · Shakllar analogiyasi

```json
{
  "id": "c2-trenajyor-09",
  "course": "c2",
  "module": "trenajyor",
  "title": "Shakllar analogiyasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi shakllar analogiyasi turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi shakllar analogiyasi turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`analogiya` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Shakllar analogiyasi uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-10 · Keyingi shakl

```json
{
  "id": "c2-trenajyor-10",
  "course": "c2",
  "module": "trenajyor",
  "title": "Keyingi shakl",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi keyingi shakl turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi keyingi shakl turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`keyingi-shakl` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Keyingi shakl uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-11 · Qalqon va naqsh munosabatlari

```json
{
  "id": "c2-trenajyor-11",
  "course": "c2",
  "module": "trenajyor",
  "title": "Qalqon va naqsh munosabatlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qalqon va naqsh munosabatlari turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi qalqon va naqsh munosabatlari turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`qalqon-naqsh-munosabati` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Qalqon va naqsh munosabatlari uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-12 · Kub yoyilmasi

```json
{
  "id": "c2-trenajyor-12",
  "course": "c2",
  "module": "trenajyor",
  "title": "Kub yoyilmasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi kub yoyilmasi turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi kub yoyilmasi turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`kub-yoyilmasi` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Kub yoyilmasi uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-13 · Bo‘laklardan kvadrat

```json
{
  "id": "c2-trenajyor-13",
  "course": "c2",
  "module": "trenajyor",
  "title": "Bo‘laklardan kvadrat",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi bo‘laklardan kvadrat turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi bo‘laklardan kvadrat turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`bolaklardan-kvadrat` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Bo‘laklardan kvadrat uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-14 · Chiziq, doira va figura sanash

```json
{
  "id": "c2-trenajyor-14",
  "course": "c2",
  "module": "trenajyor",
  "title": "Chiziq, doira va figura sanash",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi chiziq, doira va figura sanash turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi chiziq, doira va figura sanash turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`figura-sanash` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Chiziq, doira va figura sanash uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-15 · Harf ketma-ketligi

```json
{
  "id": "c2-trenajyor-15",
  "course": "c2",
  "module": "trenajyor",
  "title": "Harf ketma-ketligi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi harf ketma-ketligi turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi harf ketma-ketligi turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`harf-ketma-ketligi` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Harf ketma-ketligi uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-16 · Harf kodlari

```json
{
  "id": "c2-trenajyor-16",
  "course": "c2",
  "module": "trenajyor",
  "title": "Harf kodlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi harf kodlari turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi harf kodlari turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`harf-kodi` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Harf kodlari uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-17 · Matematik-mantiqiy masalalar

```json
{
  "id": "c2-trenajyor-17",
  "course": "c2",
  "module": "trenajyor",
  "title": "Matematik-mantiqiy masalalar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematik-mantiqiy masalalar turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi matematik-mantiqiy masalalar turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`matematik-masala` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "Matematik-mantiqiy masalalar uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-18 · So‘z, tushuncha va anagramma

```json
{
  "id": "c2-trenajyor-18",
  "course": "c2",
  "module": "trenajyor",
  "title": "So‘z, tushuncha va anagramma",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi so‘z, tushuncha va anagramma turidagi yechimni bosqichma-bosqich tushuntiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi so‘z, tushuncha va anagramma turidagi yechimni bosqichma-bosqich tushuntiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "`soz-mantiqi` bo‘yicha tekshirilgan savollarni yechish, darhol izohni o‘qish va xato sababini belgilash.",
  "output": "So‘z, tushuncha va anagramma uchun yechim yozuvi va bir shaxsiy tuzoq.",
  "sources": [
    "S05 kodifikator",
    "S11",
    "S12",
    "iq-inventory.md",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-19 · Ilmiy-tadqiqot metodlari

```json
{
  "id": "c2-trenajyor-19",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ilmiy-tadqiqot metodlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ilmiy-tadqiqot metodlari bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ilmiy-tadqiqot metodlari bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Ilmiy-tadqiqot metodlari bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-20 · Metodologik yondashuvlar

```json
{
  "id": "c2-trenajyor-20",
  "course": "c2",
  "module": "trenajyor",
  "title": "Metodologik yondashuvlar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi metodologik yondashuvlar bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi metodologik yondashuvlar bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Metodologik yondashuvlar bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-21 · Ilmiy adabiyot izlash va tahlil

```json
{
  "id": "c2-trenajyor-21",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ilmiy adabiyot izlash va tahlil",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ilmiy adabiyot izlash va tahlil bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ilmiy adabiyot izlash va tahlil bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Ilmiy adabiyot izlash va tahlil bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-22 · Ilmiy maqola yozish metodologiyasi

```json
{
  "id": "c2-trenajyor-22",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ilmiy maqola yozish metodologiyasi",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ilmiy maqola yozish metodologiyasi bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ilmiy maqola yozish metodologiyasi bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Ilmiy maqola yozish metodologiyasi bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-23 · Ilmiy tadqiqot va innovatsiya

```json
{
  "id": "c2-trenajyor-23",
  "course": "c2",
  "module": "trenajyor",
  "title": "Ilmiy tadqiqot va innovatsiya",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ilmiy tadqiqot va innovatsiya bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ilmiy tadqiqot va innovatsiya bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Ilmiy tadqiqot va innovatsiya bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-trenajyor-24 · Tadqiqot va axborot texnologiyalari

```json
{
  "id": "c2-trenajyor-24",
  "course": "c2",
  "module": "trenajyor",
  "title": "Tadqiqot va axborot texnologiyalari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tadqiqot va axborot texnologiyalari bo‘yicha tushunchani misolga qo‘llaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tadqiqot va axborot texnologiyalari bo‘yicha tushunchani misolga qo‘llaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Tayanchning original, tasdiqlanishi kerak bo‘lgan vaziyatlarini tahlil qilish va dalil tanlash.",
  "output": "Tadqiqot va axborot texnologiyalari bo‘yicha ishlangan vaziyat varag‘i.",
  "sources": [
    "S05 F26",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c2 / barqarorlik. Ijod va vaqt bosimi

Modul natijasi — Ijodiy yechimlar varag‘i va xatodan keyin tiklanish rejasi.

#### c2-barqarorlik-01 · Ijodiy fikrlash

```json
{
  "id": "c2-barqarorlik-01",
  "course": "c2",
  "module": "barqarorlik",
  "title": "Ijodiy fikrlash",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi bir muammoga turli yechimlar ishlab chiqadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi bir muammoga turli yechimlar ishlab chiqadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Alternativ qo‘llash va uch yechim topshirig‘ini dolzarblik, xilma-xillik va amalga oshirish bo‘yicha o‘zi baholash.",
  "output": "Uch yechim va tanlash asoslari.",
  "sources": [
    "S01 F18",
    "G07",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-barqarorlik-02 · Vaqt bosimi va xatodan tiklanish

```json
{
  "id": "c2-barqarorlik-02",
  "course": "c2",
  "module": "barqarorlik",
  "title": "Vaqt bosimi va xatodan tiklanish",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi bosim ostida ishni davom ettirish usulini mashq qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi bosim ostida ishni davom ettirish usulini mashq qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Qisqa vaqtli mashqdan keyin to‘xtash, nafasni me’yorlash, savolni o‘tkazish va qaytish rejasini sinash.",
  "output": "Shaxsiy tiklanish va vaqtni taqsimlash kartasi.",
  "sources": [
    "S01 F18",
    "G07",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c2 / rejimlar. Mashq, o‘yin va takrorlash

Modul natijasi — Tasdiqlangan mashq natijalari va takrorlash navbati.

#### c2-rejimlar-01 · Sprint va combo

```json
{
  "id": "c2-rejimlar-01",
  "course": "c2",
  "module": "rejimlar",
  "title": "Sprint va combo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tezlik bilan aniqlik orasidagi nisbatni kuzatadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tezlik bilan aniqlik orasidagi nisbatni kuzatadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "60 soniyalik sprint va ketma-ket to‘g‘ri javob zanjirini sinab xato turini qayd etish.",
  "output": "Tezlik/aniqlik hisoboti.",
  "sources": [
    "S05",
    "S11",
    "S12",
    "iq-inventory.md",
    "G15",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-rejimlar-02 · Kunlik o‘n savol va mahorat xaritasi

```json
{
  "id": "c2-rejimlar-02",
  "course": "c2",
  "module": "rejimlar",
  "title": "Kunlik o‘n savol va mahorat xaritasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tur bo‘yicha muntazam mashq holatini kuzatadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tur bo‘yicha muntazam mashq holatini kuzatadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Kunlik 10 savol, mavjud XP/combo bilan progress, tur bosqichlari va kelishiladigan badge shartlarini ko‘rish.",
  "output": "Kunlik mashq yozuvi va tur bo‘yicha progress.",
  "sources": [
    "S05",
    "S11",
    "S12",
    "iq-inventory.md",
    "G15",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-rejimlar-03 · Kitob to‘plamlari va to‘liq mock

```json
{
  "id": "c2-rejimlar-03",
  "course": "c2",
  "module": "rejimlar",
  "title": "Kitob to‘plamlari va to‘liq mock",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi formatga mos sinovda vaqtini boshqaradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi formatga mos sinovda vaqtini boshqaradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "PREP_1 besh to‘plami va tekshirilgan PREP_2ni mashq qilish, yetarli darajaviy qamrov bo‘lsa 40 savol/60 daqiqali mock, izohni yakunda ko‘rish.",
  "output": "Mashq yoki mock ekanligi belgilangan ball/vaqt hisoboti.",
  "sources": [
    "S05",
    "S11",
    "S12",
    "iq-inventory.md",
    "G15",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c2-rejimlar-04 · Xatolar daftari va oraliq takrorlash

```json
{
  "id": "c2-rejimlar-04",
  "course": "c2",
  "module": "rejimlar",
  "title": "Xatolar daftari va oraliq takrorlash",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xatosini sabab bilan qayta yechadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi xatosini sabab bilan qayta yechadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Xato savolni navbatga olish, oraliqda qayta yechish va tushuntirish, natijaga qarab qiyinlikni moslashtirish.",
  "output": "Sabab teglari bilan takrorlash navbati.",
  "sources": [
    "S05",
    "S11",
    "S12",
    "iq-inventory.md",
    "G15",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / yadro. Suhbatning umumiy yadrosi

Modul natijasi — Shaxsiy javoblar portfeli va esse himoyasi.

#### c3-yadro-01 · Suhbat formati va baholash

```json
{
  "id": "c3-yadro-01",
  "course": "c3",
  "module": "yadro",
  "title": "Suhbat formati va baholash",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi rasmiy talab, davri cheklangan rubrika va norasmiy xona modelini ajratadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi rasmiy talab, davri cheklangan rubrika va norasmiy xona modelini ajratadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Til, komissiya, 61/100, yozuv/ovozli efir, onlayn istisno va apellyatsiyani manbalar bilan moslash.",
  "output": "Manba maqomi yozilgan suhbat xaritasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-02 · Javob texnikasi

```json
{
  "id": "c3-yadro-02",
  "course": "c3",
  "module": "yadro",
  "title": "Javob texnikasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi javobini aniq misol bilan qisqa tuzadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi javobini aniq misol bilan qisqa tuzadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "PREP/STAR orqali 60–90 soniyalik javob, ovoz tezligi, tana tili, Zoom etiketi va hayajonni boshqarishni mashq qilish.",
  "output": "Tuzilgan javob va o‘z kuzatuvlari.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-03 · Shaxsiy hikoya va motivatsiya

```json
{
  "id": "c3-yadro-03",
  "course": "c3",
  "module": "yadro",
  "title": "Shaxsiy hikoya va motivatsiya",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tanishtirish, yutuq, loyiha va kuchli/zaif tomonlarini dalillaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tanishtirish, yutuq, loyiha va kuchli/zaif tomonlarini dalillaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "1-xona 1–7,31,36,39–43,46–51 bo‘yicha kartalarni o‘z tajribasi bilan to‘ldirish.",
  "output": "Shaxsiy hikoya va loyiha dalillari banki.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-04 · Universitet va davlat

```json
{
  "id": "c3-yadro-04",
  "course": "c3",
  "module": "yadro",
  "title": "Universitet va davlat",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tanlovini dastur va shaxsiy maqsadga bog‘laydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tanlovini dastur va shaxsiy maqsadga bog‘laydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Reyting, kreditlar, professorlar, bitiruvchilar, o‘quv reja, shahar va iqlimni universitetning birlamchi manbasidan tekshirish.",
  "output": "Universitet tadqiqot kartasi va javob rejasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-05 · Esse himoyasi

```json
{
  "id": "c3-yadro-05",
  "course": "c3",
  "module": "yadro",
  "title": "Esse himoyasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi essedagi har da’voni dalil bilan himoya qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi essedagi har da’voni dalil bilan himoya qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Esse matnidagi da’volarni o‘zi belgilash va qoida asosidagi savol andozalariga moslash.",
  "output": "Da’vo–dalil–savol jadvali.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-06 · Vatan, qaytish va majburiyat

```json
{
  "id": "c3-yadro-06",
  "course": "c3",
  "module": "yadro",
  "title": "Vatan, qaytish va majburiyat",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qaytish rejasini shartnomadagi majburiyatga bog‘laydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi qaytish rejasini shartnomadagi majburiyatga bog‘laydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "1-xona 35,37,49,50 va 2-xona 32,35 orqali vaziyatlarni tahlil qilish.",
  "output": "Manbali qaytish va mehnat rejasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-07 · Ma’naviyat va madaniyat

```json
{
  "id": "c3-yadro-07",
  "course": "c3",
  "module": "yadro",
  "title": "Ma’naviyat va madaniyat",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tushunchalarni o‘z hayotidan misol bilan farqlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tushunchalarni o‘z hayotidan misol bilan farqlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "2-xona 1–4,10,16–18,22,26,33 bo‘yicha ta’rif va qarama-qarshi misollar yozish.",
  "output": "Manbasi tekshiriladigan tushuncha kartalari.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-08 · Tarix, davlatchilik va ramzlar

```json
{
  "id": "c3-yadro-08",
  "course": "c3",
  "module": "yadro",
  "title": "Tarix, davlatchilik va ramzlar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tarixiy savollarga tekshirilgan manba bilan javob tayyorlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tarixiy savollarga tekshirilgan manba bilan javob tayyorlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Davlat ramzlari, madhiya yodlash, 31-avgust, BMT/UNESCO, jadidlar va Yosh buxoroliklar bo‘yicha manba kartalarini to‘ldirish.",
  "output": "Tarix va ramzlar bo‘yicha manbali javob varag‘i.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-09 · Adabiyot va kitob tahlili

```json
{
  "id": "c3-yadro-09",
  "course": "c3",
  "module": "yadro",
  "title": "Adabiyot va kitob tahlili",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi o‘qigan asarini mazmun va shaxsiy xulosa bilan tahlil qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi o‘qigan asarini mazmun va shaxsiy xulosa bilan tahlil qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Muallif, g‘oya, qahramonlar va menga nima berdi shabloni, Navoiy/Nodirabegim hamda yod she’r bilan mashq.",
  "output": "Kitob tahlili va yodlash rejasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-10 · Zamonaviy O‘zbekiston

```json
{
  "id": "c3-yadro-10",
  "course": "c3",
  "module": "yadro",
  "title": "Zamonaviy O‘zbekiston",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi yangilikni sana, birlamchi manba va sohaga ta’siri bilan tahlil qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi yangilikni sana, birlamchi manba va sohaga ta’siri bilan tahlil qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Taraqqiyot strategiyasi, O‘zbekiston–2030, milliy g‘oya va yangi islohot uchun manba kartasini tekshirish.",
  "output": "Sana va arxiv holati bor yangilik tahlili.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-11 · Hududim haqida

```json
{
  "id": "c3-yadro-11",
  "course": "c3",
  "module": "yadro",
  "title": "Hududim haqida",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi hududini tarix, shaxslar va sanoat bilan dalillab tanishtiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi hududini tarix, shaxslar va sanoat bilan dalillab tanishtiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "14 hudud orasidan o‘zinikini tanlash va manbali karta asosida javob tuzish.",
  "output": "Hudud bo‘yicha javob kartasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-12 · Chet tilidagi qo‘shimcha mashq

```json
{
  "id": "c3-yadro-12",
  "course": "c3",
  "module": "yadro",
  "title": "Chet tilidagi qo‘shimcha mashq",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi asosiy hikoyasini ingliz tilida ifodalaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi asosiy hikoyasini ingliz tilida ifodalaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Asosiy savollarning inglizcha versiyasiga javob yozish/aytish va ma’noni solishtirish.",
  "output": "Ikki tildagi shaxsiy javoblar.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-yadro-13 · Qiyin va provokatsion savollar

```json
{
  "id": "c3-yadro-13",
  "course": "c3",
  "module": "yadro",
  "title": "Qiyin va provokatsion savollar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi murakkab savolga haqiqiy tajriba bilan javob beradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi murakkab savolga haqiqiy tajriba bilan javob beradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Yolg‘on, tanlanmaslik sababi, xorijda ish va stipendiyasiz reja vaziyatlarida tuzoq hamda javob tuzilmasini tahlil qilish.",
  "output": "To‘rtta vaziyatga asoslangan javob rejasi.",
  "sources": [
    "S01 F27–F40",
    "S06 H01–H03 davri 2025-2",
    "S09",
    "S10 norasmiy",
    "G01",
    "G04–G06",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-muhandislik. Muhandislik ishi treki

Modul natijasi — Muhandislik ishi uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-muhandislik-01 · Muhandislik ishi. Soha asoslari

```json
{
  "id": "c3-trek-muhandislik-01",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-02 · Muhandislik ishi. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-muhandislik-02",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-03 · Muhandislik ishi. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-muhandislik-03",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-04 · Muhandislik ishi. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-muhandislik-04",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-05 · Muhandislik ishi. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-muhandislik-05",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-06 · Muhandislik ishi. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-muhandislik-06",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-07 · Muhandislik ishi. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-muhandislik-07",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-08 · Muhandislik ishi. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-muhandislik-08",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-muhandislik-09 · Muhandislik ishi. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-muhandislik-09",
  "course": "c3",
  "module": "trek-muhandislik",
  "title": "Muhandislik ishi. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi muhandislik ishi bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-arxitektura. Arxitektura va qurilish treki

Modul natijasi — Arxitektura va qurilish uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-arxitektura-01 · Arxitektura va qurilish. Soha asoslari

```json
{
  "id": "c3-trek-arxitektura-01",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "S04 PDF4, 145–177 guruhidagi arxitektura, shaharsozlik, qurilish, zilzilabardoshlik va geotexnika nomlari",
    "Tayanch ish varag‘i. Bino–inshoot–infratuzilma tushunchalarini o‘quvchi tekshiradigan lug‘at",
    "Tanlangan universitet fanini mutaxassislik va shaxsiy maqsad bilan bog‘lash"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-02 · Arxitektura va qurilish. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-arxitektura-02",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Muammo 1. [Rasmiy manba va sana kutilmoqda]",
    "Muammo 2. [Rasmiy manba va sana kutilmoqda]",
    "Muammo 3. [Rasmiy manba va sana kutilmoqda]",
    "Har biriga dalil, kimga ta’sir qiladi va qanday bilim kerak kataklari"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-03 · Arxitektura va qurilish. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-arxitektura-03",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "[Amaldagi qurilish/shaharsozlik hujjati havolasi va bandi kutilmoqda]",
    "Ish varag‘ida hujjat maqsadi, loyihaga ta’siri va javobdagi qo‘llanishi",
    "Nashr sanasi va amaldagi tahrirni tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-04 · Arxitektura va qurilish. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-arxitektura-04",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "[President.uzdagi aniq nutq va sana kutilmoqda]",
    "[Tekshirilgan qisqa iqtibos matni kutilmoqda]",
    "Iqtibos mazmuni, loyiha bilan bog‘liqligi va nomzodning o‘z fikri alohida"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-05 · Arxitektura va qurilish. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-arxitektura-05",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "[Milliy birlamchi talab ko‘rsatkichi kutilmoqda]",
    "[Taqqoslanadigan xalqaro birlamchi ko‘rsatkich kutilmoqda]",
    "Davr, hudud, o‘lchov va cheklovlarni bir jadvalga yozish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-06 · Arxitektura va qurilish. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-arxitektura-06",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "O‘quvchi tanlagan yo‘nalishda baza holat manbasi",
    "Besh–olti yillik shaxsiy ssenariyda taxminlar va o‘z hissasini ajratish",
    "Natijani tekshirish ko‘rsatkichi, kafolatlangan prognoz maqomi berilmaydi"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-07 · Arxitektura va qurilish. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-arxitektura-07",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "[Aniq tashkilot va uning rasmiy vazifasi kutilmoqda]",
    "[Aniq lavozim va ochiq malaka talabi kutilmoqda]",
    "O‘qiladigan fan–ko‘nikma–vazifa–qaytish rejasini bog‘lash"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-08 · Arxitektura va qurilish. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-arxitektura-08",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04 PDF4, 145–177 mutaxassisliklar guruhidan tanlash, lotinlashtirish qayta tekshiriladi",
    "S09 19–34. Soha asosi, uch muammo, islohot, talab, istiqbol va qaytgach ish haqidagi norasmiy savollar",
    "Ish varag‘ida savol–dalil–qisqa javob–takomillashtirish kataklari"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-arxitektura-09 · Arxitektura va qurilish. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-arxitektura-09",
  "course": "c3",
  "module": "trek-arxitektura",
  "title": "Arxitektura va qurilish. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi arxitektura va qurilish bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Qurilish/arxitektura bo‘yicha shaxsiy tadqiqot savoli va uning dolzarbligi",
    "O‘quvchining mavjud maqolasi yoki ish loyihasidagi o‘z hissasi",
    "Metod, tekshiriladigan natija va O‘zbekistonda qo‘llash rejasi"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-ishlab-chiqarish. Ishlab chiqarish va ishlov berish treki

Modul natijasi — Ishlab chiqarish va ishlov berish uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-ishlab-chiqarish-01 · Ishlab chiqarish va ishlov berish. Soha asoslari

```json
{
  "id": "c3-trek-ishlab-chiqarish-01",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-02 · Ishlab chiqarish va ishlov berish. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-ishlab-chiqarish-02",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-03 · Ishlab chiqarish va ishlov berish. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-ishlab-chiqarish-03",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-04 · Ishlab chiqarish va ishlov berish. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-ishlab-chiqarish-04",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-05 · Ishlab chiqarish va ishlov berish. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-ishlab-chiqarish-05",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-06 · Ishlab chiqarish va ishlov berish. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-ishlab-chiqarish-06",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-07 · Ishlab chiqarish va ishlov berish. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-ishlab-chiqarish-07",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-08 · Ishlab chiqarish va ishlov berish. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-ishlab-chiqarish-08",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ishlab-chiqarish-09 · Ishlab chiqarish va ishlov berish. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-ishlab-chiqarish-09",
  "course": "c3",
  "module": "trek-ishlab-chiqarish",
  "title": "Ishlab chiqarish va ishlov berish. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ishlab chiqarish va ishlov berish bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-akt. Axborot-kommunikatsiya texnologiyalari treki

Modul natijasi — Axborot-kommunikatsiya texnologiyalari uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-akt-01 · Axborot-kommunikatsiya texnologiyalari. Soha asoslari

```json
{
  "id": "c3-trek-akt-01",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-02 · Axborot-kommunikatsiya texnologiyalari. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-akt-02",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-03 · Axborot-kommunikatsiya texnologiyalari. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-akt-03",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-04 · Axborot-kommunikatsiya texnologiyalari. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-akt-04",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-05 · Axborot-kommunikatsiya texnologiyalari. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-akt-05",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-06 · Axborot-kommunikatsiya texnologiyalari. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-akt-06",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-07 · Axborot-kommunikatsiya texnologiyalari. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-akt-07",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-08 · Axborot-kommunikatsiya texnologiyalari. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-akt-08",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-akt-09 · Axborot-kommunikatsiya texnologiyalari. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-akt-09",
  "course": "c3",
  "module": "trek-akt",
  "title": "Axborot-kommunikatsiya texnologiyalari. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi axborot-kommunikatsiya texnologiyalari bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-fizika. Fizika va tabiiy fanlar treki

Modul natijasi — Fizika va tabiiy fanlar uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-fizika-01 · Fizika va tabiiy fanlar. Soha asoslari

```json
{
  "id": "c3-trek-fizika-01",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-02 · Fizika va tabiiy fanlar. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-fizika-02",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-03 · Fizika va tabiiy fanlar. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-fizika-03",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-04 · Fizika va tabiiy fanlar. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-fizika-04",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-05 · Fizika va tabiiy fanlar. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-fizika-05",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-06 · Fizika va tabiiy fanlar. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-fizika-06",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-07 · Fizika va tabiiy fanlar. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-fizika-07",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-08 · Fizika va tabiiy fanlar. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-fizika-08",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-fizika-09 · Fizika va tabiiy fanlar. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-fizika-09",
  "course": "c3",
  "module": "trek-fizika",
  "title": "Fizika va tabiiy fanlar. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi fizika va tabiiy fanlar bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-matematika. Matematika va statistika treki

Modul natijasi — Matematika va statistika uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-matematika-01 · Matematika va statistika. Soha asoslari

```json
{
  "id": "c3-trek-matematika-01",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-02 · Matematika va statistika. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-matematika-02",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-03 · Matematika va statistika. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-matematika-03",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-04 · Matematika va statistika. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-matematika-04",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-05 · Matematika va statistika. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-matematika-05",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-06 · Matematika va statistika. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-matematika-06",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-07 · Matematika va statistika. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-matematika-07",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-08 · Matematika va statistika. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-matematika-08",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-matematika-09 · Matematika va statistika. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-matematika-09",
  "course": "c3",
  "module": "trek-matematika",
  "title": "Matematika va statistika. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi matematika va statistika bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-biologiya. Biologik va turdosh fanlar treki

Modul natijasi — Biologik va turdosh fanlar uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-biologiya-01 · Biologik va turdosh fanlar. Soha asoslari

```json
{
  "id": "c3-trek-biologiya-01",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-02 · Biologik va turdosh fanlar. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-biologiya-02",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-03 · Biologik va turdosh fanlar. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-biologiya-03",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-04 · Biologik va turdosh fanlar. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-biologiya-04",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-05 · Biologik va turdosh fanlar. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-biologiya-05",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-06 · Biologik va turdosh fanlar. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-biologiya-06",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-07 · Biologik va turdosh fanlar. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-biologiya-07",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-08 · Biologik va turdosh fanlar. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-biologiya-08",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biologiya-09 · Biologik va turdosh fanlar. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-biologiya-09",
  "course": "c3",
  "module": "trek-biologiya",
  "title": "Biologik va turdosh fanlar. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi biologik va turdosh fanlar bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-xizmat. Xizmat ko‘rsatish treki

Modul natijasi — Xizmat ko‘rsatish uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-xizmat-01 · Xizmat ko‘rsatish. Soha asoslari

```json
{
  "id": "c3-trek-xizmat-01",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-02 · Xizmat ko‘rsatish. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-xizmat-02",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-03 · Xizmat ko‘rsatish. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-xizmat-03",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-04 · Xizmat ko‘rsatish. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-xizmat-04",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-05 · Xizmat ko‘rsatish. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-xizmat-05",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-06 · Xizmat ko‘rsatish. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-xizmat-06",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-07 · Xizmat ko‘rsatish. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-xizmat-07",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-08 · Xizmat ko‘rsatish. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-xizmat-08",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-xizmat-09 · Xizmat ko‘rsatish. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-xizmat-09",
  "course": "c3",
  "module": "trek-xizmat",
  "title": "Xizmat ko‘rsatish. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi xizmat ko‘rsatish bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-atrof-muhit. Atrof-muhit treki

Modul natijasi — Atrof-muhit uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-atrof-muhit-01 · Atrof-muhit. Soha asoslari

```json
{
  "id": "c3-trek-atrof-muhit-01",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-02 · Atrof-muhit. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-atrof-muhit-02",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-03 · Atrof-muhit. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-atrof-muhit-03",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-04 · Atrof-muhit. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-atrof-muhit-04",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-05 · Atrof-muhit. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-atrof-muhit-05",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-06 · Atrof-muhit. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-atrof-muhit-06",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-07 · Atrof-muhit. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-atrof-muhit-07",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-08 · Atrof-muhit. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-atrof-muhit-08",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-atrof-muhit-09 · Atrof-muhit. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-atrof-muhit-09",
  "course": "c3",
  "module": "trek-atrof-muhit",
  "title": "Atrof-muhit. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi atrof-muhit bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-qishloq. Qishloq, o‘rmon, baliq xo‘jaligi treki

Modul natijasi — Qishloq, o‘rmon, baliq xo‘jaligi uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-qishloq-01 · Qishloq, o‘rmon, baliq xo‘jaligi. Soha asoslari

```json
{
  "id": "c3-trek-qishloq-01",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-02 · Qishloq, o‘rmon, baliq xo‘jaligi. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-qishloq-02",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-03 · Qishloq, o‘rmon, baliq xo‘jaligi. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-qishloq-03",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-04 · Qishloq, o‘rmon, baliq xo‘jaligi. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-qishloq-04",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-05 · Qishloq, o‘rmon, baliq xo‘jaligi. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-qishloq-05",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-06 · Qishloq, o‘rmon, baliq xo‘jaligi. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-qishloq-06",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-07 · Qishloq, o‘rmon, baliq xo‘jaligi. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-qishloq-07",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-08 · Qishloq, o‘rmon, baliq xo‘jaligi. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-qishloq-08",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-qishloq-09 · Qishloq, o‘rmon, baliq xo‘jaligi. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-qishloq-09",
  "course": "c3",
  "module": "trek-qishloq",
  "title": "Qishloq, o‘rmon, baliq xo‘jaligi. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi qishloq, o‘rmon, baliq xo‘jaligi bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-transport. Transport xizmatlari treki

Modul natijasi — Transport xizmatlari uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-transport-01 · Transport xizmatlari. Soha asoslari

```json
{
  "id": "c3-trek-transport-01",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-02 · Transport xizmatlari. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-transport-02",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-03 · Transport xizmatlari. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-transport-03",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-04 · Transport xizmatlari. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-transport-04",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-05 · Transport xizmatlari. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-transport-05",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-06 · Transport xizmatlari. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-transport-06",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-07 · Transport xizmatlari. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-transport-07",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-08 · Transport xizmatlari. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-transport-08",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-transport-09 · Transport xizmatlari. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-transport-09",
  "course": "c3",
  "module": "trek-transport",
  "title": "Transport xizmatlari. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi transport xizmatlari bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-biznes. Biznes va boshqaruv treki

Modul natijasi — Biznes va boshqaruv uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-biznes-01 · Biznes va boshqaruv. Soha asoslari

```json
{
  "id": "c3-trek-biznes-01",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-02 · Biznes va boshqaruv. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-biznes-02",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-03 · Biznes va boshqaruv. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-biznes-03",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-04 · Biznes va boshqaruv. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-biznes-04",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-05 · Biznes va boshqaruv. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-biznes-05",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-06 · Biznes va boshqaruv. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-biznes-06",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-07 · Biznes va boshqaruv. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-biznes-07",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-08 · Biznes va boshqaruv. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-biznes-08",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-biznes-09 · Biznes va boshqaruv. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-biznes-09",
  "course": "c3",
  "module": "trek-biznes",
  "title": "Biznes va boshqaruv. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi biznes va boshqaruv bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-veterinariya. Veterinariya treki

Modul natijasi — Veterinariya uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-veterinariya-01 · Veterinariya. Soha asoslari

```json
{
  "id": "c3-trek-veterinariya-01",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-02 · Veterinariya. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-veterinariya-02",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-03 · Veterinariya. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-veterinariya-03",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-04 · Veterinariya. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-veterinariya-04",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-05 · Veterinariya. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-veterinariya-05",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-06 · Veterinariya. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-veterinariya-06",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-07 · Veterinariya. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-veterinariya-07",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-08 · Veterinariya. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-veterinariya-08",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-veterinariya-09 · Veterinariya. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-veterinariya-09",
  "course": "c3",
  "module": "trek-veterinariya",
  "title": "Veterinariya. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi veterinariya bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-ijtimoiy. Ijtimoiy va xulq-atvor fanlari treki

Modul natijasi — Ijtimoiy va xulq-atvor fanlari uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-ijtimoiy-01 · Ijtimoiy va xulq-atvor fanlari. Soha asoslari

```json
{
  "id": "c3-trek-ijtimoiy-01",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-02 · Ijtimoiy va xulq-atvor fanlari. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-ijtimoiy-02",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-03 · Ijtimoiy va xulq-atvor fanlari. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-ijtimoiy-03",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-04 · Ijtimoiy va xulq-atvor fanlari. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-ijtimoiy-04",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-05 · Ijtimoiy va xulq-atvor fanlari. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-ijtimoiy-05",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-06 · Ijtimoiy va xulq-atvor fanlari. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-ijtimoiy-06",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-07 · Ijtimoiy va xulq-atvor fanlari. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-ijtimoiy-07",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-08 · Ijtimoiy va xulq-atvor fanlari. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-ijtimoiy-08",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-ijtimoiy-09 · Ijtimoiy va xulq-atvor fanlari. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-ijtimoiy-09",
  "course": "c3",
  "module": "trek-ijtimoiy",
  "title": "Ijtimoiy va xulq-atvor fanlari. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ijtimoiy va xulq-atvor fanlari bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-jurnalistika. Jurnalistika va axborot treki

Modul natijasi — Jurnalistika va axborot uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-jurnalistika-01 · Jurnalistika va axborot. Soha asoslari

```json
{
  "id": "c3-trek-jurnalistika-01",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Soha asoslari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-02 · Jurnalistika va axborot. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-jurnalistika-02",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. O‘zbekistondagi holat va uch muammo",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-03 · Jurnalistika va axborot. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-jurnalistika-03",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Islohotlar va qonunchilik",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-04 · Jurnalistika va axborot. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-jurnalistika-04",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Prezidentning soha haqidagi fikrlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-05 · Jurnalistika va axborot. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-jurnalistika-05",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Dunyo va O‘zbekistonda talab",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-06 · Jurnalistika va axborot. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-jurnalistika-06",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Besh–olti yillik istiqbol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-07 · Jurnalistika va axborot. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-jurnalistika-07",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Qaytgach ish joyi va rol",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-08 · Jurnalistika va axborot. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-jurnalistika-08",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-jurnalistika-09 · Jurnalistika va axborot. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-jurnalistika-09",
  "course": "c3",
  "module": "trek-jurnalistika",
  "title": "Jurnalistika va axborot. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi jurnalistika va axborot bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-huquq. Huquq treki

Modul natijasi — Huquq uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-huquq-01 · Huquq. Soha asoslari

```json
{
  "id": "c3-trek-huquq-01",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Soha asoslari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-02 · Huquq. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-huquq-02",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. O‘zbekistondagi holat va uch muammo",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-03 · Huquq. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-huquq-03",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Islohotlar va qonunchilik",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-04 · Huquq. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-huquq-04",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Prezidentning soha haqidagi fikrlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-05 · Huquq. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-huquq-05",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Dunyo va O‘zbekistonda talab",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-06 · Huquq. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-huquq-06",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Besh–olti yillik istiqbol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-07 · Huquq. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-huquq-07",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Qaytgach ish joyi va rol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-08 · Huquq. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-huquq-08",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-huquq-09 · Huquq. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-huquq-09",
  "course": "c3",
  "module": "trek-huquq",
  "title": "Huquq. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi huquq bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-sogliq. Sog‘liqni saqlash va ijtimoiy ta’minot treki

Modul natijasi — Sog‘liqni saqlash va ijtimoiy ta’minot uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-sogliq-01 · Sog‘liqni saqlash va ijtimoiy ta’minot. Soha asoslari

```json
{
  "id": "c3-trek-sogliq-01",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Soha asoslari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-02 · Sog‘liqni saqlash va ijtimoiy ta’minot. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-sogliq-02",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. O‘zbekistondagi holat va uch muammo",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-03 · Sog‘liqni saqlash va ijtimoiy ta’minot. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-sogliq-03",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Islohotlar va qonunchilik",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-04 · Sog‘liqni saqlash va ijtimoiy ta’minot. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-sogliq-04",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Prezidentning soha haqidagi fikrlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-05 · Sog‘liqni saqlash va ijtimoiy ta’minot. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-sogliq-05",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Dunyo va O‘zbekistonda talab",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-06 · Sog‘liqni saqlash va ijtimoiy ta’minot. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-sogliq-06",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Besh–olti yillik istiqbol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-07 · Sog‘liqni saqlash va ijtimoiy ta’minot. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-sogliq-07",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Qaytgach ish joyi va rol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-08 · Sog‘liqni saqlash va ijtimoiy ta’minot. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-sogliq-08",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sogliq-09 · Sog‘liqni saqlash va ijtimoiy ta’minot. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-sogliq-09",
  "course": "c3",
  "module": "trek-sogliq",
  "title": "Sog‘liqni saqlash va ijtimoiy ta’minot. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi sog‘liqni saqlash va ijtimoiy ta’minot bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-talim. Ta’lim treki

Modul natijasi — Ta’lim uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-talim-01 · Ta’lim. Soha asoslari

```json
{
  "id": "c3-trek-talim-01",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Soha asoslari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-02 · Ta’lim. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-talim-02",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. O‘zbekistondagi holat va uch muammo",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-03 · Ta’lim. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-talim-03",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Islohotlar va qonunchilik",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-04 · Ta’lim. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-talim-04",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Prezidentning soha haqidagi fikrlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-05 · Ta’lim. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-talim-05",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Dunyo va O‘zbekistonda talab",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-06 · Ta’lim. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-talim-06",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Besh–olti yillik istiqbol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-07 · Ta’lim. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-talim-07",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Qaytgach ish joyi va rol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-08 · Ta’lim. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-talim-08",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-talim-09 · Ta’lim. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-talim-09",
  "course": "c3",
  "module": "trek-talim",
  "title": "Ta’lim. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi ta’lim bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-sanat. San’at treki

Modul natijasi — San’at uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-sanat-01 · San’at. Soha asoslari

```json
{
  "id": "c3-trek-sanat-01",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Soha asoslari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-02 · San’at. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-sanat-02",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. O‘zbekistondagi holat va uch muammo",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-03 · San’at. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-sanat-03",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Islohotlar va qonunchilik",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-04 · San’at. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-sanat-04",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Prezidentning soha haqidagi fikrlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-05 · San’at. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-sanat-05",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Dunyo va O‘zbekistonda talab",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-06 · San’at. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-sanat-06",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Besh–olti yillik istiqbol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-07 · San’at. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-sanat-07",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Qaytgach ish joyi va rol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-08 · San’at. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-sanat-08",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-sanat-09 · San’at. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-sanat-09",
  "course": "c3",
  "module": "trek-sanat",
  "title": "San’at. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi san’at bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / trek-tillar. Tillar treki

Modul natijasi — Tillar uchun tushunchalar, uch muammo, qonunchilik, iqtibos, talab, ssenariy, rol va savollar portfeli.

#### c3-trek-tillar-01 · Tillar. Soha asoslari

```json
{
  "id": "c3-trek-tillar-01",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Soha asoslari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha asosiy tushunchalarni misolda qo‘llaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Asosiy tushunchalar lug‘ati, manbalar kelgach ishlangan vaziyat",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tushunchani o‘z dasturidagi fan bilan moslash",
  "output": "Asosiy tushunchalar va o‘quv fanlari kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-02 · Tillar. O‘zbekistondagi holat va uch muammo

```json
{
  "id": "c3-trek-tillar-02",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. O‘zbekistondagi holat va uch muammo",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha uch muammoni dalil va sana bilan ajratadi.",
  "duration_min": 25,
  "content_blocks": [
    "Uch muammo uchun muammo–dalil–oqibat kataklari, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy hisobotdan dalil topib har muammoga manba qo‘shish",
  "output": "Uchta manbali muammo kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-03 · Tillar. Islohotlar va qonunchilik

```json
{
  "id": "c3-trek-tillar-03",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Islohotlar va qonunchilik",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha amaldagi hujjatning sohaga ta’sirini izohlaydi.",
  "duration_min": 25,
  "content_blocks": [
    "Hujjat sanasi, amaldaligi va o‘qilgan band, faktlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Lex.uz yoki tegishli idora manbasidan bandni tanlash",
  "output": "Qonun yoki islohot tahlil varag‘i",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-04 · Tillar. Prezidentning soha haqidagi fikrlari

```json
{
  "id": "c3-trek-tillar-04",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Prezidentning soha haqidagi fikrlari",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha iqtibosning aniq manbasi va kontekstini tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Nutq sanasi, rasmiy manba va kontekst, iqtibos matni manba kelguncha bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Rasmiy nutqdan qisqa iqtibosni tekshirib o‘z izohini alohida yozish",
  "output": "Manbali iqtibos kartasi yoki manba kutilmoqda holati",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-05 · Tillar. Dunyo va O‘zbekistonda talab

```json
{
  "id": "c3-trek-tillar-05",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Dunyo va O‘zbekistonda talab",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha talab haqidagi da’voni ko‘rsatkich bilan tekshiradi.",
  "duration_min": 25,
  "content_blocks": [
    "Talab ko‘rsatkichi, metodologiya va cheklov, raqamlar G14 bo‘yicha kutilmoqda",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Xalqaro va milliy birlamchi manbalar davrlarini solishtirish",
  "output": "Talab bo‘yicha dalillar jadvali",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-06 · Tillar. Besh–olti yillik istiqbol

```json
{
  "id": "c3-trek-tillar-06",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Besh–olti yillik istiqbol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha istiqbolni taxminlari ochiq ssenariy sifatida tuzadi.",
  "duration_min": 25,
  "content_blocks": [
    "Baza holat, o‘zgarish omili va ssenariy, tasdiqlanmagan prognoz raqamlari bo‘sh",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Ikki ssenariy yozib faraz va manbali faktlarni ajratish",
  "output": "Farazlari yozilgan rivojlanish ssenariysi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-07 · Tillar. Qaytgach ish joyi va rol

```json
{
  "id": "c3-trek-tillar-07",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Qaytgach ish joyi va rol",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha maqsad lavozimini amaliy vazifa bilan bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tashkilot, bo‘lim, rol va kirish shartlari, aniq nomlar rasmiy manba bilan kiritiladi",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Tashkilotning rasmiy sahifasi asosida rol kartasi tayyorlash",
  "output": "Manbali tashkilot/lavozim va qaytish rejasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-08 · Tillar. Soha savol banki va ustuvor mutaxassisliklar

```json
{
  "id": "c3-trek-tillar-08",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Soha savol banki va ustuvor mutaxassisliklar",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha o‘z mutaxassisligini dalilli javoblar bilan himoya qiladi.",
  "duration_min": 25,
  "content_blocks": [
    "S04dagi tegishli guruh, S09 soha savollari va o‘quvchining dalillari",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mutaxassislik qidiruvi va tasodifiy soha savoliga javob",
  "output": "Mutaxassislik tanlovi va soha javoblari portfeli",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-trek-tillar-09 · Tillar. Magistr tadqiqoti, maqola va tajriba

```json
{
  "id": "c3-trek-tillar-09",
  "course": "c3",
  "module": "trek-tillar",
  "title": "Tillar. Magistr tadqiqoti, maqola va tajriba",
  "level": [
    "master"
  ],
  "goal": "O‘quvchi tillar bo‘yicha tadqiqot savolini ish tajribasidagi muammoga bog‘laydi.",
  "duration_min": 25,
  "content_blocks": [
    "Tadqiqot savoli, metod, mavjud maqola va shaxsiy hissa",
    "Soha va shaxsiy tajribaga bog‘langan mashq",
    "Manba va javob dalillarini tekshirish"
  ],
  "activity": "Mavjud ish yoki maqolada o‘z hissasini ajratib suhbat javobini tayyorlash",
  "output": "Tadqiqot mavzusi va tajriba himoyasi kartasi",
  "sources": [
    "S04 tegishli guruh",
    "S09 xona1 savollar19–34",
    "S01 F14 F28",
    "G14",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c3 / simulyatsiya. Suhbat mashqi va simulyatsiya

Modul natijasi — Ovozli mashq yozuvi, o‘z bahosi va qayta tayyorgarlik rejasi.

#### c3-simulyatsiya-01 · Taymerli savol kartalari

```json
{
  "id": "c3-simulyatsiya-01",
  "course": "c3",
  "module": "simulyatsiya",
  "title": "Taymerli savol kartalari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi tasodifiy yoki tanlangan mavzuda javob mashq qiladi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi tasodifiy yoki tanlangan mavzuda javob mashq qiladi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Xona/soha filtri va tasodifiy kartada javob vaqtini kuzatish.",
  "output": "Kartalar bo‘yicha mashq qaydi.",
  "sources": [
    "S01 F27–F32",
    "S06 davri 2025-2",
    "S09",
    "S10",
    "G01",
    "G04",
    "G06",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-simulyatsiya-02 · Ovozni yozish va qayta eshitish

```json
{
  "id": "c3-simulyatsiya-02",
  "course": "c3",
  "module": "simulyatsiya",
  "title": "Ovozni yozish va qayta eshitish",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi o‘z javobidagi aniqlik va dalillarni tinglab baholaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi o‘z javobidagi aniqlik va dalillarni tinglab baholaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "MediaRecorder ruxsati bilan lokal yozish, eshitish, o‘chirish yoki yuklab olish, ruxsat bo‘lmasa yozma mashq.",
  "output": "Shaxsiy ovoz yozuvi va tahrir qaydlari.",
  "sources": [
    "S01 F27–F32",
    "S06 davri 2025-2",
    "S09",
    "S10",
    "G01",
    "G04",
    "G06",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-simulyatsiya-03 · O‘z-o‘zini baholash rubrikasi

```json
{
  "id": "c3-simulyatsiya-03",
  "course": "c3",
  "module": "simulyatsiya",
  "title": "O‘z-o‘zini baholash rubrikasi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi javobini dalillar bilan mezonlarga solishtiradi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi javobini dalillar bilan mezonlarga solishtiradi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "S06dagi tarixiy 30/30/40 rubrikasi maqomini ko‘rib o‘z bahosiga misol yozish, joriy rubrika tasdiqlansa versiyasini tanlash.",
  "output": "Rasmiy natijadan alohida o‘z bahosi va yaxshilash vazifalari.",
  "sources": [
    "S01 F27–F32",
    "S06 davri 2025-2",
    "S09",
    "S10",
    "G01",
    "G04",
    "G06",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c3-simulyatsiya-04 · Mock suhbat va natija

```json
{
  "id": "c3-simulyatsiya-04",
  "course": "c3",
  "module": "simulyatsiya",
  "title": "Mock suhbat va natija",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi ikki xona mashq modelini izchil yakunlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi ikki xona mashq modelini izchil yakunlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "15–20 daqiqali Tayanch mock, yakunda mezonlar diagrammasi va matnli jadval, zaif banddan qayta mashq.",
  "output": "Suhbat portfeli, o‘z bahosi va takrorlash rejasi.",
  "sources": [
    "S01 F27–F32",
    "S06 davri 2025-2",
    "S09",
    "S10",
    "G01",
    "G04",
    "G06",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```


### c4 / natija. Natija, shartnoma va B reja

Modul natijasi — Natija nazorati, majburiyatlar taqvimi va muqobil reja.

#### c4-natija-01 · Natija va apellyatsiya

```json
{
  "id": "c4-natija-01",
  "course": "c4",
  "module": "natija",
  "title": "Natija va apellyatsiya",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi individual natija sanasidan apellyatsiya ishlarini rejalaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi individual natija sanasidan apellyatsiya ishlarini rejalaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Rasmiy natija manbasini saqlash, 3 ish kunlik topshirish va 5 ish kunlik ko‘rib chiqishni jadvaldan ajratish.",
  "output": "Natija va apellyatsiya nazorat varag‘i.",
  "sources": [
    "S01 F32–F40",
    "S07",
    "G10",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c4-natija-02 · G‘oliblikdan keyingi hujjatlar

```json
{
  "id": "c4-natija-02",
  "course": "c4",
  "module": "natija",
  "title": "G‘oliblikdan keyingi hujjatlar",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi kafolat va shartnoma tomonlarining vazifasini ajratadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi kafolat va shartnoma tomonlarining vazifasini ajratadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Ish beruvchi kafolati, moliyaviy kafillar, to‘rt tomonlama shartnoma va moliyaviy oqibat bandlarini o‘qib savollar belgilash.",
  "output": "Shartnoma oldi savollari va hujjat chek-listi.",
  "sources": [
    "S01 F32–F40",
    "S07",
    "G10",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c4-natija-03 · Stipendiatning majburiyatlari

```json
{
  "id": "c4-natija-03",
  "course": "c4",
  "module": "natija",
  "title": "Stipendiatning majburiyatlari",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi o‘qish va qaytish davridagi ishlarini muddat bilan belgilaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi o‘qish va qaytish davridagi ishlarini muddat bilan belgilaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Konsullik, hisobot, ish cheklovi, qaytish va ishlab berishni shaxsiy shartnoma bilan bog‘lash.",
  "output": "Majburiyatlar taqvimi.",
  "sources": [
    "S01 F32–F40",
    "S07",
    "G10",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c4-natija-04 · Stipendiya bekor qilinishi

```json
{
  "id": "c4-natija-04",
  "course": "c4",
  "module": "natija",
  "title": "Stipendiya bekor qilinishi",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi bekor qilishga olib keluvchi shartlarni manbadan topadi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi bekor qilishga olib keluvchi shartlarni manbadan topadi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Shartsiz qabul va o‘qish boshlanishi muddatlari hamda shartnomadagi boshqa bandlar bo‘yicha vaziyatlarni tekshirish.",
  "output": "Oldini olish nazorat ro‘yxati.",
  "sources": [
    "S01 F32–F40",
    "S07",
    "G10",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

#### c4-natija-05 · B reja

```json
{
  "id": "c4-natija-05",
  "course": "c4",
  "module": "natija",
  "title": "B reja",
  "level": [
    "bachelor",
    "master"
  ],
  "goal": "O‘quvchi natijadan keyin muqobil tayyorgarlik yo‘lini tanlaydi.",
  "duration_min": 20,
  "content_blocks": [
    "O‘quvchi natijadan keyin muqobil tayyorgarlik yo‘lini tanlaydi.",
    "Manbaga tayangan ishlangan namuna va chegaralar",
    "Mustaqil mashq va yakuniy tekshiruv"
  ],
  "activity": "Keyingi tanlovda yaxshilanadigan bandlar va boshqa grantlarni solishtirib Top Admission kirish havolasiga o‘tish.",
  "output": "Keyingi tanlov yoki boshqa grant uchun shaxsiy reja.",
  "sources": [
    "S01 F32–F40",
    "S07",
    "G10",
    "T01"
  ],
  "verified": false,
  "as_of": "2026-11-20"
}
```

## Arxitektura va qurilish namunasini qabul qilish

Trekdagi sakkiz umumiy va bitta magistr darsi yuqorida barcha majburiy maydonlari bilan ochilgan. Har darsning ish varag‘i va aniq mahsuloti bor. Soha holati, iqtibos, talab va ish joylariga tegishli fakt joylari manba kutilmoqda deb qoldirilgan. Shuning uchun bu pedagogik jihatdan to‘liq namuna reja, faktlar to‘ldirilgan tayyor kurs maqomi keyingi ko‘rikdan o‘tadi.

## Keyingi faza uchun qabul chegarasi

Muallif kurs/modul/dars tartibi, daraja teglari, taxminiy davomiyliklar va modul mahsulotlarini ko‘rib chiqadi. Faza 2da ma’lumot sxemalari, manba/davr/rasmiylik holatlari, kitob kontentini o‘chirgich va PREP_1 birinchi testi namunasi tayyorlanadi. Shu bosqichga o‘tish uchun alohida tasdiq kutiladi.
