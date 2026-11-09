# SAT progressini sinxronlash qoidalari

Holat: kod `sat-progress-sinxron` branch'ida (P04). Hisob moduli (P03) va Supabase sxemasi (P02) hali `main` da emas, shuning uchun adapter serverga hali ulanmagan: hisobsiz foydalanuvchi uchun hamma narsa avvalgidek ishlaydi.

## Fayllar

| Fayl | Vazifasi |
| --- | --- |
| `src/lib/holat.ts` | Saqlash adapteri: `holatOqi`, `holatYoz`, `holatOchir`; hisob bilan ulash (`ulash`, `uzish`), import, navbat |
| `src/lib/holatBirlashtir.ts` | Kalitlar ro'yxati va sof birlashtirish funksiyalari (brauzer API'si yo'q) |
| `src/lib/holatSupabase.ts` | `user_state` jadvali bilan ishlovchi server (supabase-js mijozini hisob moduli beradi) |
| `src/components/SatSinxron.astro` | "Import this device's progress?" dialogi (BolimQobiq `bolim="sat"` va SatFokus) |
| `scripts/sinxron-test.ts` | Soxta server bilan sinov: `npm run sinxron:tekshir` |

Yozish nuqtalari adapterga ulangan: `darsSaqlash.oqi/yoz` (dars progressi, xato daftari, takrorlash, reja), `mashq/test` (javoblar), `mashq/lugat` (lug'at), o'chirish tugmalari (`vosita/natijalar`, `vosita/reja`, `vosita/takrorlash`). Boshqa bo'limlar (IELTS, Top Admission) kalitlari faqat localStorage'da qoladi: adapter ularni kuzatmaydi.

## Kalit → jadval xaritasi

Hamma SAT kaliti `public.user_state` ga yoziladi (bitta qator = bitta kalit, `primary key (user_id, key)`, RLS: faqat o'z qatorlari).

| Brauzer kaliti | Shakl (localStorage) | Yozuv id'si | `user_state.key` |
| --- | --- | --- | --- |
| `tayanch:sat-javoblar` | `Javob[]`, yangisi birinchi, 500 tagacha | `Javob.id` (savol id + vaqt) | xuddi shu |
| `tayanch:sat-dars-progress` | `{ modul: { savolId: 'togri' \| 'xato' } }` | `modul` + TAB + `savolId` | xuddi shu |
| `tayanch:sat-xato-daftari` | `XatoYozuv[]`, 300 tagacha | `XatoYozuv.id` | xuddi shu |
| `tayanch:sat-takrorlash` | `{ versiya: 1, savollar: { id: { quti, keyingi, xatoSana } } }` | savol id | xuddi shu |
| `tayanch:sat-reja` | bitta obyekt yoki yo'q | `reja` (bitta yozuv) | xuddi shu |
| `tayanch:sat-lugat` | `{ soz: 'bilaman' \| 'organ' }` | so'z | xuddi shu |
| — | — | — | `tayanch:sat-import`: profil bayrog'i `{ versiya, migrated, birinchi, oxirgi, soni }` |

`user_state.value` shakli: `{ versiya: 1, qiymat, t, o }`. `qiymat` brauzerdagi qiymatning o'zi, `t` har yozuvning oxirgi o'zgarish vaqti (ms), `o` o'chirilgan yozuvlar (tombstone, ms; har kalitda eng yangi 1000 tasi).

**Nega `review_queue` emas:** `review_queue.question_id` `public.questions(id)` (uuid) ga bog'langan, darslardagi savol id'lari esa matn va bazada yo'q; mijozda bu jadvalga insert huquqi ham yo'q. Shuning uchun darslar takrorlashi (Leitner) `user_state` ga ko'chadi; `quti` va `keyingi` sanasi o'zgarishsiz saqlanadi, demak 1, 3, 7, 14 kunlik oraliqlar ham saqlanadi. `review_queue` savol banki (P02 `questions`) uchun qoladi.

**Nega bayroq `profiles` da emas:** `profiles` da bu ustun yo'q va mijoz faqat ruxsat berilgan ustunlarni yangilay oladi. Yangi migratsiyasiz yechim: `user_state` dagi `tayanch:sat-import` yozuvi (profil darajasida, hamma qurilmaga bitta).

## Brauzerdagi yordamchi kalitlar

| Kalit | Saqlash | Ma'nosi |
| --- | --- | --- |
| `tayanch:sat-sinxron-vaqt` | localStorage | Har kalit uchun `{ t, o }` (yozuv vaqtlari, tombstone). Hisobsiz holatda ham yuritiladi, faqat brauzerda. |
| `tayanch:sat-sinxron-navbat` | localStorage | Serverga yuborilmagan kalitlar (oflayn navbat) |
| `tayanch:sat-sinxron` | localStorage | Shu qurilmaning qarori: `{ foydalanuvchi, holat: 'ulangan' \| 'mahalliy' }` |
| `tayanch:sat-sinxron-keyin` | sessionStorage | "Not now" (shu sessiyada qayta so'ralmaydi) |

## Rozilik

1. Hisobsiz: serverga hech narsa yuborilmaydi, dialog chiqmaydi.
2. Hisob bilan kirilganda (`ulash`): shu qurilma shu foydalanuvchi uchun "ulangan" bo'lsa sinxron yoqiladi. Brauzerda SAT ma'lumoti umuman yo'q bo'lsa ham yoqiladi: yuboriladigan eski ma'lumot yo'q, keyingi mashqlar hisobga yoziladi.
3. Aks holda dialog sonlar bilan so'raydi. **Import**: birlashtirib yuboradi. **Not now**: shu sessiyada so'ramaydi. **Don't ask again**: shu qurilma shu hisob uchun faqat brauzerda qoladi (sinxron ham yo'q). Qaytarish uchun `importniQaytaTaklif()` (profil sahifasi uchun, hali tugmasi yo'q).
4. Esc = Not now. Import paytida dialog yopilmaydi.

## Birlashtirish qoidalari

- Yozuvlar id bo'yicha birlashadi; bir id ikki marta bo'lmaydi.
- Ikkala tomonda bo'lsa yangiroq `t` yutadi; teng bo'lsa (masalan eski yozuvlarda ikkalasi 0) server yutadi.
- **Import** rejimida hech narsa o'chirilmaydi: serverda tombstone bo'lsa ham brauzerdagi yozuv qoladi va vaqti tombstone + 1 bo'ladi.
- **Sinxron** rejimida (importdan keyingi kundalik ish) tombstone faqat yozuvdan qat'iy yangiroq bo'lsa o'chiradi. Shunda darsdagi to'g'ri javob xato daftaridan olib tashlagan yozuv boshqa qurilmada qaytib chiqmaydi, ya'ni darslar xatti-harakati o'zgarmaydi.
- Ro'yxat chegaralari (javoblar 500, xato daftari 300) birlashgandan keyin ham saqlanadi: eng yangilari qoladi.
- Idempotent: takror import yoki takror sinxron natijani o'zgartirmaydi, serverga faqat farq bo'lsa yoziladi.
- Server xatosida brauzer o'zgarmaydi. Import avval serverga yozadi, keyin brauzerga.
- Birlashtirish paytida foydalanuvchi shu kalitga yozsa, brauzerdagi yangi qiymat ustidan yozilmaydi; kalit navbatda qoladi va keyingi urinishda birlashadi.

## Yuborish

- Yozishdan keyin 2 soniya kutiladi (debounce), so'ng: serverdan o'qish → birlashtirish → brauzerga yozish → farq bo'lsa `upsert`.
- Xato yoki oflayn: navbat localStorage'da qoladi; 2 s, 10 s, keyin har 60 s qayta urinadi; `online` hodisasida darhol yuboradi; sahifa yashirinayotganda bir urinish.
- Serverdan yangi ma'lumot kelsa `tayanch:holat-yangilandi` hodisasi chiqadi. Hozirgi sahifalar uni tinglamaydi: yangilik sahifa qayta ochilganda ko'rinadi.
- Xato matni va qiymatlar console'ga yozilmaydi.

## Mahalliy nusxa

- Importdan keyin brauzerdagi nusxa qoladi (zaxira).
- **Clear local copy** (dialogning yakuniy qadamida, tasdiq bilan): brauzerdagi 6 ta SAT kaliti va yordamchi kalitlarni o'chiradi, hisobdagi nusxaga tegmaydi (tombstone qo'yilmaydi). Yuborilmagan o'zgarish bo'lsa o'chirmaydi. Hisob bilan kirilgan holatda keyingi SAT sahifasida nusxa serverdan qayta yuklanadi.
- 1-qavatdagi "brauzer ma'lumotlarini o'chirish" tugmasi ham faqat brauzerni tozalaydi.

## Ma'lum cheklovlar

- Qurilma soatlari farq qilsa "yangiroq" noto'g'ri tanlanishi mumkin (vaqt brauzer soatidan olinadi).
- Bir vaqtda ikki tab: har biri o'z navbatini yuboradi, birlashtirish idempotent bo'lgani uchun ma'lumot yo'qolmaydi, lekin ortiqcha so'rov bo'lishi mumkin.
- `user_state` qatori 256 KB bilan cheklangan; hozirgi chegaralar (500 javob, 300 xato, 1000 tombstone) bilan bu yetarli bo'lishi kerak, haqiqiy hajm tekshirilmagan.
- Hisob ulanmaguncha (P03 merge) server qismi faqat soxta server bilan sinalgan.

## P03 bilan ulash (keyingi qadam)

Hisob moduli sessiya bo'lganda chaqiradi:

```ts
import { ulash, uzish } from '../lib/holat';
import { supabaseServer } from '../lib/holatSupabase';
// sessiya bor: ulash(supabaseServer(hisobMijoz(), session.user.id), session.user.id);
// chiqish (SIGNED_OUT): uzish();
```
