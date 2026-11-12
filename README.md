# Tayanch

Chet elda o'qishni xohlovchi o'zbek yoshlari uchun ochiq, interaktiv yo'riqnoma sayti.
Astro, GitHub Pages (GitHub Actions orqali). Manzil: https://javohirqaxramonov36-web.github.io/Tayanch/

## Tayanch binosi: 5 qavat

Tayanch bitta sayt, 5 qavatli bino. Har qavat alohida sayt emas, shu repodagi papka:

| Qavat | Nomi | Manzil | Holat |
| --- | --- | --- | --- |
| 1 | Navigator (bosh sahifa, muddatlar, manbalar) | `/uz/` | ochiq |
| 2 | Top Admission | `/uz/top-admission/` | qurilmoqda |
| 3 | SAT prep | `/uz/sat/` | ochiq |
| 4 | IELTS prep | `/uz/ielts/` | ochiq |
| 5 | EYUF prep | `/uz/eyuf/` | qurilmoqda |

Qavatlar `src/data/qavatlar.ts` da, 2–5 qavat holati `src/data/bolimlar.ts` dan olinadi.
Qavatlar orasida o'tish: **Lift** (kompyuterda yon panel yoki menyuda, telefonda pastki panel), **Qavat yo'li** (sahifa tepasida) va **Zina** (qavat kirish sahifasi pastida). Tafsilot: `DESIGN.md`.
Yangi qavat: sahifalarni `src/pages/uz/<bolim>/` ga qo'shing, `BolimQobiq` qolipini ishlating, keyin `bolimlar.ts` da holatni "ochiq" ga o'tkazing.

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
| `src/components/` | Menyu, Footer, SahifaOxiri, DeadlineRoyxati, MaqsadTesti, Lift, QavatYoli, Zina, BolimYon |
| `src/data/bolimlar.ts` | 4 bo'lim va holati (`ochiq` yoki `tez-orada`) |
| `src/data/manbalar.ts` | Manba jurnali |
| `src/data/deadline.ts` | Deadline kalendari |
| `src/pages/uz/` | O'zbekcha sahifalar |
| `.github/workflows/deploy.yml` | `main` ga push bo'lganda saytni qurib joylaydi |

## Qoidalar

- Ichki havolalar faqat `yol()` orqali yoziladi (`src/lib/yol.ts`).
- Saytda qoida, talab yoki muddat faqat "rasmiy" darajadagi manba bilan chiqadi.
- Ichki qoralamalar (`grants-qoralama.json`), `inbox/`, `.env`, kalit va tokenlar repoga qo'yilmaydi. Repo hozircha ochiq qoladi (HANDOFF §5, 11-savol).
- Hisob butun sayt uchun bitta (Supabase Auth: email va Google). To'lov (inPAY) va tariflar (Free, Pro, Max) hozircha faqat SAT bo'limida. Batafsil: `docs/qarorlar/001-hisob-tolov-server.md`.
- Hisob bilan kirgan foydalanuvchi ma'lumoti Supabase'da, hisobsiz holatda faqat brauzerda (`tayanch:` kalitlari). Hisob va to'lov formalaridan boshqa forma yo'q.
- Brauzerda faqat Supabase ochiq (publishable/anon) kaliti bo'lishi mumkin; qolgan hamma kalit Supabase secrets va lokal `.env` da.
- SAT bo'limi matni inglizcha, URL va kod nomlari o'zbekcha.
- Savollar faqat original; College Board materiallari saytga qo'yilmaydi. Batafsil: [kontent siyosati](docs/kontent-siyosati.md), lokal fayllar: [lokal ish tartibi](docs/lokal-ish-tartibi.md). Commit oldidan: `npm run repo:tekshir`.
- Natija kafolatlanmaydi.

## Har sahifaning maydonlari (T1)

`Asosiy` qolipiga beriladi: `title`, `description`, `turi`, `bolim`, `holat`, `tekshirilgan`, `keyingiTekshiruv`, `manbalar` (manba ID lari), `tekshirilmagan`.
Qoralama sahifa `src/pages/` ga qo'yilmaydi, shuning uchun saytga chiqmaydi.
