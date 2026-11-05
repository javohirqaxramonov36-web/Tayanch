# Tayanch

Chet elda o'qishni xohlovchi o'zbek yoshlari uchun ochiq, interaktiv yo'riqnoma sayti.
Astro, GitHub Pages (GitHub Actions orqali). Manzil: https://javohirqaxramonov36-web.github.io/Tayanch/

## Bo'limlar

Tayanch bitta sayt, ichida to'rt bo'lim. Har bo'lim alohida sayt emas, shu repodagi papka:

| Bo'lim | Manzil | Holat |
| --- | --- | --- |
| Top Admission | `/uz/top-admission/` | tez orada |
| IELTS | `/uz/ielts/` | ochiq |
| SAT | `/uz/sat/` | ochiq |
| El-Yurt Umidi | `/uz/eyuf/` | tez orada |

Holat `src/data/bolimlar.ts` da. "ochiq" bo'lim bosh sahifa kartasida, menyuda va har bo'lim yon panelidagi "Tayanch bo'limlari" guruhida havola bo'ladi.
Yangi bo'lim: sahifalarni `src/pages/uz/<bolim>/` ga qo'shing, `BolimQobiq` qolipini ishlating, keyin holatni "ochiq" ga o'tkazing.

## Ishga tushirish

```sh
npm install
npm run dev      # lokal ko'rish
npm run build    # dist/ ga qurish
```

## Tuzilma

| Joy | Nima uchun |
| --- | --- |
| `DESIGN.md` | Dizayn tizimi: ranglar, shrift, o'lchamlar, komponentlar |
| `astro.config.mjs` | `site` va `base` ("/Tayanch", harf katta-kichikligiga sezgir) |
| `src/styles/tokens.css` | DESIGN.md dagi tokenlar. Kodda xom qiymat yozilmaydi |
| `src/layouts/Asosiy.astro` | Umumiy qolip: menyu, sahifa oxiri bloki, footer |
| `src/components/` | Menyu, Footer, SahifaOxiri, DeadlineRoyxati, MaqsadTesti |
| `src/data/bolimlar.ts` | 4 bo'lim va holati (`ochiq` yoki `tez-orada`) |
| `src/data/manbalar.ts` | Manba jurnali |
| `src/data/deadline.ts` | Deadline kalendari |
| `src/pages/uz/` | O'zbekcha sahifalar |
| `.github/workflows/deploy.yml` | `main` ga push bo'lganda saytni qurib joylaydi |

## Qoidalar

- Ichki havolalar faqat `yol()` orqali yoziladi (`src/lib/yol.ts`).
- Saytda qoida, talab yoki muddat faqat "rasmiy" darajadagi manba bilan chiqadi.
- Repo ochiq: ichki qoralamalar (`grants-qoralama.json`), `inbox/`, `.env` bu yerga qo'yilmaydi.
- Foydalanuvchi kiritgan narsa faqat uning brauzerida saqlanadi. Formalar va to'lov yo'q.
- Natija kafolatlanmaydi.

## Har sahifaning maydonlari (T1)

`Asosiy` qolipiga beriladi: `title`, `description`, `turi`, `bolim`, `holat`, `tekshirilgan`, `keyingiTekshiruv`, `manbalar` (manba ID lari), `tekshirilmagan`.
Qoralama sahifa `src/pages/` ga qo'yilmaydi, shuning uchun saytga chiqmaydi.
