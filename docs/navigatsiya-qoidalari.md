# Navigatsiya va joylashuv qoidalari

Maqsad: har qavatda bir xil, oldindan bilinadigan skelet. Foydalanuvchi qaysi qavatda bo'lmasin, tugma qayerda turishini taxmin qila oladi. Sayt labirint bo'lmaydi.

Tarix: muallif bilan 2026-11-13 da tamoyillar kelishildi. 2026-11-15 da "Unify Tayanch floor and section navigation" (PR #168) main'ga kirdi. 2026-11-16 da muallif qarori: **main'dagi navigatsiya qoladi**, bu hujjat shunga moslandi. Tafsilot va o'lchamlar: `DESIGN.md` (Lift, qavat yo'li).

Yangi sahifa yoki komponent qurishdan oldin shu hujjat o'qiladi.

## 1. Skelet (hamma qavat, hamma ekran)

| Joy | Nima turadi |
| --- | --- |
| Ustki qator (yopishqoq) | Logo → bo'lim bosh sahifasi; hamburger → bo'lim paneli; mavzu tugmasi. Bosh sahifada (`/uz/`) o'rtada qavatlar menyusi (`QavatMenyu`) |
| Bo'lim paneli (hamburger, o'ngdan ochiladi) | Shu qavatning bo'limlari, umumiy havolalar, "Qavatlar" ro'yxati (boshqa qavatga o'tish), hisob bandi, tashqi havolalar |
| Sahifa boshi | Qavat yo'li (qavat kirish sahifasida yo'q), sarlavha, bir qatorli tushuntirish, **bitta** asosiy tugma |
| Sahifa oxiri | Manbalar, eslatmalar (`SatEslatma`) |

- Telefonda pastki panel yo'q (2026-11-15 dan). Pastki tab bar qaytarilsa, shu hujjat va `DESIGN.md` birga yangilanadi.
- Boshqa qavatga o'tish: bo'lim panelining "Qavatlar" ro'yxati, bosh sahifada yana qavatlar menyusi. Ustki qatorda alohida joriy qavat yozuvi (Lift) yo'q: muallif qarori 2026-11-19 ("ortiqcha"). Bo'limlar ro'yxatiga boshqa qavat tugmalari aralashtirilmaydi.
- Mavzu tugmasi bitta, ustki qatorda (panel ichida takrorlanmaydi).

## 2. Bo'limlar tartibi (SAT)

Yagona manba: `satYonGuruhlar` (`src/data/satSahifalar.ts`). Bo'lim paneli va qavat yo'li shundan oladi, tartib boshqa joyda takrorlanmaydi:

1. Practice
2. Learn (Guides, Math lessons, Reading & Writing lessons)
3. Progress
4. Plan
5. Account

Qavatda bo'lim hali yo'q bo'lsa, u panelda ko'rsatilmaydi.

## 3. Qavat yo'li

- SAT'da guruhdagi sahifaning guruh nomi panel guruhidan olinadi ("Floor 3 · SAT prep › Plan › Study planner", "Floor 3 · SAT prep › Learn › Math lessons › Volume lab"), sahifa bergan `yol` dan emas. Shuning uchun yo'l satri va panel hech qachon bir-biriga zid bo'lmaydi.
- Guruhda yo'q ichki sahifalar (mashq sessiyasi, mock imtihon, huquqiy) o'z bandlarini saqlaydi.

## 4. Kirish sahifasi (har qavat)

Yuqoridan pastga: sarlavha + bitta asosiy tugma → bo'limlar → muddatlar va eslatmalar → manbalar. Asosiy tugma holatga qarab bitta joyda o'zgaradi: yangi foydalanuvchiga "Boshlash", qaytganga "Davom ettirish" (hali qurilmagan, alohida spetsifikatsiya bilan).

## 5. Har sahifada

- Bir ekranda bitta asosiy tugma, qolganlari ikkinchi darajali.
- Dars va mashq oxirida "Keyingi" tugmasi: foydalanuvchi panelga qaytmasdan davom etadi.
- Tugma faqat `<button>` yoki `<a>`.

## Ochiq

- `SatTabBar.astro` va `src/lib/sat/satTab.ts` ulanmagan: qaytariladimi yoki o'chiriladimi (muallif qarori).
- "Davom ettirish" tugmasi uchun oxirgi sahifa kaliti (`tayanch:...`): interaktiv spetsifikatsiya bilan.
- IELTS va Top Admission'da qavat yo'li hali sahifa bergan `yol` dan olinadi.
