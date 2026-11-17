# SAT haftalik reja algoritmi (P13)

Kod: `src/lib/sat/reja.ts` (sof funksiyalar), sinov: `src/lib/testlar/reja.test.ts`. Bu hujjat va kod birga o'zgaradi;
qoida o'zgarsa `QOIDA_VERSIYA` oshiriladi (`study_plans.rules_version`, brauzer yozuvida `reja.qoidaVersiya`).

Reja **qoidaga asoslangan**: AI yo'q, tasodif yo'q, bir xil kirish bir xil reja beradi. Reja faqat vaqtni taqsimlaydi:
ball oshishi formulasi yo'q, samaradorlik raqami yo'q, maqsad ball rejani o'zgartirmaydi (faqat sarlavhada ko'rinadi).
Hamma raqamlar (45 daqiqa, foizlar, chegaralar) Tayanch taxmini, rasmiy tavsiya emas.

## Kirish

| Maydon | Qoida |
| --- | --- |
| Imtihon sanasi | ixtiyoriy; bugundan keyin bo'lishi kerak, aks holda "sanasiz" |
| Maqsad ball | ixtiyoriy, 400–1600; rejaga ta'sir qilmaydi |
| Haftalik soat | 2–20, butun songa yaxlitlanadi va shu oraliqqa qisiladi |
| Zaif skill'lar | `src/data/satTaksonomiya.ts` dagi nomlar, ko'pi bilan 6 ta, takrorlar olib tashlanadi |

Hisob bilan kirganda sana va maqsad `profiles.exam_date` / `profiles.target_score` (P12) dan to'ladi.

## Haftalar va bosqichlar

N = ceil(imtihongacha kun / 7). Reja ko'pi bilan 16 haftani ko'rsatadi (`MAKS_HAFTA`): N > 16 bo'lsa bosqichlar N hafta
uchun hisoblanadi va birinchi 16 tasi olinadi (final haftalar yo'q, sahifa "rebuild later" deydi).

| N | Bosqichlar |
| --- | --- |
| 1 | Final prep |
| 2 | Diagnostic, Final prep |
| 3 | Diagnostic, Topic practice, Final prep |
| ≥ 4 | Diagnostic, o'rtadagi M = N − 2 hafta, Final prep |
| sanasiz | 4 haftalik sikl: Diagnostic, Foundations, Topic practice, Timed practice; sahifada "Add a test date" |

O'rtadagi M hafta: M ≥ 4 bo'lsa oxirida 1 ta **Mistakes and review** haftasi. Qolgan M2 hafta: M2 = 1 → Topic;
M2 = 2 → Topic, Timed; aks holda Foundations ≈ 35%, Topic ≈ 35%, Timed ≈ 30%
(timed = max(1, round(M2 × 0.30)), foundations = max(1, round(M2 × 0.35)), topic = qolgani, kamida 1).
Tartib doim: Diagnostic → Foundations → Topic → Timed → Review → Final.

Hafta k: boshi = bugun + 7(k − 1), oxiri = boshi + 6 (oxirgi hafta imtihon oldidagi kunda tugaydi).

## Hajm

- 1 topshiriq = 45 daqiqalik blok (`BLOK_DAQIQA`, Tayanch taxmini). To'liq test (Bluebook™) 180 daqiqa = 4 blok.
- Haftalik bloklar = round(soat × 60 / 45). Final haftada yarmi: max(2, ceil(bloklar / 2)).
- O'qish kunlari haftasiga: soat ≤ 3 → 3, ≤ 6 → 4, ≤ 10 → 5, aks holda 6. Har haftada kamida 1 dam kuni.
  Kunlar haftaning 7 kuniga teng yoyiladi: o'rin i = round(i × 7 / kunlar).
- Imtihon kuni va undan oldingi kun dam: shu kunlarga topshiriq qo'yilmaydi (imtihon ertaga bo'lsa reja bo'sh).
  O'qish kuni kam qolgan haftada byudjet kunlar × ceil(bloklar / kunlar) dan oshmaydi.
- Kunlarga taqsimlash: kunlik sig'im ceil(byudjet / kunlar); to'lsa keyingi kun, oxirgi kun to'lsa eng bo'sh kun.

## Bosqich mazmuni

Har hafta avval "bosh ro'yxat", keyin byudjet to'lguncha "aylana" topshiriqlar. **2-haftadan har haftada takrorlash**
(Mistake log, `/uz/sat/vosita/takrorlash/`) bosh ro'yxatda birinchi turadi.

| Bosqich | Bosh ro'yxat | Aylana |
| --- | --- | --- |
| Diagnostic | to'liq Bluebook™ testi + Test tracker tahlili (byudjetdan oshsa ham qoladi) | bo'lim aralash 20 savol (R&W / Math navbat), har 3-si lug'at |
| Foundations | takrorlash; darslar (haftasiga ko'pi bilan byudjet/2; zaif skill darslari avval, keyin qolganlari; har dars rejada bir marta); lug'at | zaif skill bo'yicha 10 savol, easy + medium |
| Topic practice | takrorlash, lug'at | zaif skill 10 savol, medium + hard; har 3-si bo'lim aralash 20 savol |
| Timed practice | takrorlash; har 2-timed haftada to'liq test + tahlil (byudjetga sig'sa) | timed 20 savol (bo'lim) va timed 10 savol (zaif skill) navbat |
| Mistakes and review | takrorlash, R&W va Math "redo" (xato javoblar), tracker tahlili | takrorlash va zaif skill 10 savol (medium) navbat |
| Final prep | takrorlash, R&W va Math "redo" | zaif skill 10 savol (easy + medium) va takrorlash navbat |

Zaif skill tanlanmagan bo'lsa "zaif skill" o'rniga bo'lim aralash to'plam (R&W / Math navbat).

## Havolalar

Har topshiriq ichki sahifaga (`/uz/...`, sahifada `yol()`):

- savol banki: `/uz/sat/mashq/bank/?section=rw|math&skills=a|b&difficulty=easy,medium&retry=1&mode=practice|timed&size=10|20`
  (skill nomi `encodeURIComponent`, ajratuvchi `|`). Bank sahifasi filtrni oldindan tanlaydi; bo'lim bor, skill yo'q bo'lsa
  bo'limning hamma skill'i. Sessiyani foydalanuvchi o'zi boshlaydi.
- darslar (`DARSLAR` ro'yxati: dars → skill moslashtirishi Tayanch'niki), lug'at, takrorlash, Test tracker (`/uz/sat/vosita/rasmiy-testlar/`).
- Server `ref` ni `^/uz/[a-z0-9/-]*/(\?[A-Za-z0-9=&%|,._~-]*)?$` (≤ 300 belgi, `//` yo'q) bilan tekshiradi; kod `REF_NAQSH`.

## Zaif skill taklifi ("Suggested")

- Hisob bilan: `plan_skill_stats()` (o'z `attempts` × `questions`): kamida 5 javob va < 60% to'g'ri; eng past ulush birinchi
  (teng bo'lsa ko'p javob), 3 tagacha.
- Hisobsiz: darslar xato daftari (`tayanch:sat-xato-daftari`): modulda ≥ 2 xato → shu dars skill'lari, ko'p xatoli modul
  birinchi, 3 tagacha.
- Taklif faqat belgilanadi, foydalanuvchi o'zi tanlaydi yoki olib tashlaydi.

## Qayta taqsimlash ("Move missed tasks")

Bajarilmagan va kuni o'tgan topshiriqlar bugundan boshlab rejadagi o'qish kunlariga (imtihon oldidagi dam kunlariga emas)
ko'chadi. Kunlik sig'im ceil(haftalik bloklar / o'qish kunlari) + 1; bo'sh kunga katta topshiriq (test) ham sig'adi.
Sig'magani o'z joyida qoladi va sahifa nechta qolganini aytadi. Qayta taqsimlash yangi reja emas: kvota sarflamaydi.

## Saqlash va kvota

- Hisobsiz: `tayanch:sat-haftalik-reja` = `{ versiya: 1, reja, yaratilgan }`. Eski `tayanch:sat-reja` o'qiladi (forma va
  "Previous plan" xulosasi), o'zgartirilmaydi, faqat foydalanuvchi o'chirsa o'chadi.
- Hisob bilan: `public.save_study_plan(p_plan, p_tasks)`: har chaqiruv `private.consume_quota(uid, 'plan_rebuilds', 1)`
  (tuzish, qayta tuzish, brauzerdagi rejani hisobga saqlash); eski faol reja `archived` bo'ladi. Limit raqami P19 da
  (`plans.limits` da kalit yo'q = cheklovsiz). Checkbox va qayta taqsimlash `plan_tasks` ni to'g'ridan yangilaydi
  (`done_at`, `due_on`, `week`, `position`), kvota sarflamaydi.
