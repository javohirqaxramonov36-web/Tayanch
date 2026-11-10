# IELTS Reading test formati (sxema v1)

Har test bitta JSON fayl: `src/data/ielts/reading-testlar/<testId>.json`.
Turlar va tekshiruvchi: `src/lib/ielts/reading/sxema.ts`. Tekshirish: `npm run validate:tests`
(shu tekshiruv `npm run build` ichida ham ishlaydi: xato bo'lsa build to'xtaydi).

Matn va savollar faqat original (`docs/kontent-siyosati.md`). Ekranda test
"IELTS formatidagi mashq, rasmiy test emas" deb ko'rsatiladi.

## Tuzilish

```json
{
  "schemaVersion": 1,
  "testId": "reading-01",
  "title": "Reading test 1",
  "durationMinutes": 60,
  "passages": [
    {
      "id": "p1",
      "difficulty": "Oson-O'rta",
      "title": "Passage sarlavhasi",
      "paragraphs": [
        { "label": "A", "text": "..." },
        { "label": "B", "text": "..." }
      ],
      "groups": [
        {
          "type": "tfng",
          "instructions": "Do the following statements agree with the information given in the passage?",
          "questions": [
            {
              "number": 1,
              "prompt": "...",
              "answer": "NOT GIVEN",
              "explanation": "...",
              "evidence": { "paragraph": "A", "quote": "..." }
            }
          ]
        }
      ]
    }
  ]
}
```

| Maydon | Izoh |
| --- | --- |
| `schemaVersion` | Hozir faqat `1`. |
| `testId` | Kichik lotin harflari, raqam va `-`. Fayl nomi bilan bir xil. `fixture` bilan boshlanmaydi. |
| `title` | Test nomi (natija va tarixda ko'rinadi). |
| `durationMinutes` | Vaqt, daqiqada (`60`). |
| `explanationLang` | Ixtiyoriy: `"en"` (standart) yoki `"uz"`. Tushuntirishlar tili; natija ekranida `lang` atributi shundan olinadi. |
| `passages[].id` | Test ichida takrorlanmaydi (`p1`, `p2`, `p3`). |
| `passages[].difficulty` | Ko'rsatiladigan daraja matni (masalan `O'rta`). |
| `passages[].paragraphs[]` | `label` (passage ichida takrorlanmaydi) va `text`. |
| `passages[].groups[]` | Bir turdagi savollar guruhi: `type`, `instructions`, `questions`. |

## Savol turlari

Hamma savolda majburiy: `prompt`, `answer`, `explanation`, `evidence`.
`evidence.paragraph` shu passage'dagi paragraf yorlig'i, `evidence.quote` o'sha paragrafdan
so'zma-so'z olingan parcha (natijada matnda shu parcha belgilanadi).

### `tfng`: True / False / Not Given
- `number`: savol raqami.
- `answer`: `"TRUE"`, `"FALSE"` yoki `"NOT GIVEN"`.
- `NOT GIVEN` savolda `evidence` javobga eng yaqin gapni ko'rsatadi (matnda aynan shu ma'lumot yo'qligini tushuntirish uchun).

### `mcq`: Multiple choice
- `options`: kamida 2 ta `{ "id": "A", "text": "..." }`.
- Bitta javob: `number` va `answer: "B"`.
- "Choose TWO": `"choose": 2`, `"numbers": [20, 21]` (ketma-ket ikki raqam), `"answer": ["A", "D"]`.
  U ikki savol raqamini egallaydi; har to'g'ri tanlangan harf 1 ball, tartib ahamiyatsiz.

```json
{
  "numbers": [20, 21],
  "choose": 2,
  "prompt": "Which TWO ... ?",
  "options": [
    { "id": "A", "text": "..." }, { "id": "B", "text": "..." },
    { "id": "C", "text": "..." }, { "id": "D", "text": "..." }
  ],
  "answer": ["A", "D"],
  "explanation": "...",
  "evidence": { "paragraph": "C", "quote": "..." }
}
```

### `matching-headings`
- Guruhda `headings`: `{ "id": "i", "text": "..." }` ro'yxati (odatda savollardan ko'p).
- Savol: `number`, `prompt` (masalan `"Paragraph B"`), `answer`: sarlavha `id` si.
- Bitta sarlavha guruh ichida faqat bitta savolning javobi bo'ladi.

### `gap-fill`
- `number`, `prompt` (bo'sh joy `______` bilan), `wordLimit` (so'zlar soni, butun son, kamida 1).
- `answer`: asosiy javob. `acceptedAnswers`: boshqa to'g'ri yozilishlar (ixtiyoriy).
- Tekshiruv: katta-kichik harf va ortiqcha bo'shliq hisobga olinmaydi; `wordLimit` dan ko'p so'z yozilsa, javob xato.
- Raqam ham bitta so'z hisoblanadi (`"40"`).

## Tekshiruvchi nimani tekshiradi

1. Savol raqamlari `1..40`: uzluksiz, takrorsiz va o'qish tartibida ("Choose TWO" ikki raqam).
2. Har savolda `answer`, `explanation` va `evidence` bor.
3. `evidence.paragraph` mavjud paragraf, `evidence.quote` o'sha paragrafda so'zma-so'z bor.
4. Paragraf yorliqlari passage ichida, passage `id` lari test ichida takrorlanmaydi.
5. `tfng` javobi uch qiymatdan biri; `mcq` javobi `options` ichida; `matching-headings` javobi `headings` ichida va takrorlanmaydi.
6. `gap-fill`: `answer` va `acceptedAnswers` `wordLimit` dan oshmaydi.
7. Fayl nomi `testId` bilan bir xil, `testId` boshqa faylda takrorlanmaydi.
8. Band jadvali (`src/data/ielts/bandJadvali.ts`) 0..40 ni bo'shliqsiz va ustma-ust tushmasdan qoplaydi.

## Fixture (sinov testi)

`tests/fixtures/ielts/reading-fixture.json`: 5 savol raqamli qisqa test (4 savol turi).
U unit testlarda ishlatiladi va saytga chiqmaydi. Lokal ko'rish uchun:

```bash
IELTS_FIXTURE=1 npm run dev
```

Oddiy `npm run build` fixture'ni umuman yuklamaydi (`dist/` ichida yo'q). Test bo'lmasa
boshlash sahifasida tugma o'chiq turadi va "Testlar hali qo'shilmagan" deb yoziladi.

## Kod xaritasi

| Fayl | Vazifa |
| --- | --- |
| `src/lib/ielts/reading/sxema.ts` | Turlar va `tekshirTest` (shu hujjatdagi qoidalar). |
| `src/lib/ielts/reading/testlarTekshir.ts` | Fayllar to'plamini tekshirish (fayl nomi, takror `testId`). |
| `src/lib/ielts/reading/testlarYukla.ts` | Node skripti uchun fayl o'quvchi (`npm run validate:tests`). |
| `src/lib/ielts/reading/saytTestlari.ts` | Astro build uchun: xato bo'lsa build to'xtaydi. |
| `src/pages/uz/ielts/mashq/reading/testlar/[testId].json.ts` | Har test uchun bitta statik JSON. |
| `src/lib/ielts/reading/turlar/` | Savol turlari: har biri alohida modul (`render`, `normalize`, `check`), `registr.ts`. |
| `src/lib/ielts/reading/{ball,band,taymer,tanlash,urinish,qulf,ombor}.ts` | Ball, band, taymer, tasodifiy tanlash, urinish, bitta tab qulfi, saqlash qatlami. |
| `src/lib/ielts/reading/ekran/` | Sahifa boshqaruvchilari: boshlash, test, natija. |
| `src/data/ielts/bandJadvali.ts` | Xom ball → taxminiy band jadvali (sozlama). |
| `src/data/ielts/readingMatn.ts` | Hamma interfeys matni (kalitlar bilan). |

Yangi savol turi qo'shish: `turlar/` da modul, `registr.ts` ga yozuv, `SAVOL_TURLARI` va
`tekshirTest` ichida tekshiruv tarmog'i, `readingMatn.ts` da `TUR_NOMI`.

## Urinish yozuvi (brauzerda)

Tarix `localStorage` da, kalit `tayanch:ielts-reading-urinishlar:v1`, faqat
`src/lib/ielts/reading/ombor.ts` orqali o'qiladi va yoziladi:

```json
{
  "id": "…", "testId": "reading-01", "schemaVersion": 1,
  "startedAt": "2026-11-10T10:00:00.000Z", "finishedAt": "2026-11-10T10:52:10.000Z",
  "answers": { "1": "TRUE", "14": "iv", "20": ["A", "D"], "27": "solar power" },
  "raw": 27, "band": 6.5,
  "perTypeStats": { "tfng": { "togri": 6, "jami": 8 } },
  "syncedAt": null
}
```

`answers` kaliti savolning birinchi raqami. `band: null` = "2.0 dan past". `syncedAt` server
sinxroni (Supabase) qo'shilguncha `null`. Davom etayotgan urinish alohida kalitda:
`tayanch:ielts-reading-faol:v1`; bitta tab qulfi: `tayanch:ielts-reading-qulf:v1`.
