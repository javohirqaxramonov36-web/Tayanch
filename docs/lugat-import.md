# Lug'at so'zlarini yuklash (P15)

So'zlar Supabase `vocab_words` jadvalida. Lug'at sahifasi (`/uz/sat/mashq/lugat/`) faqat `status = 'verified'` so'zlarni ko'rsatadi. Bazada so'z yo'q bo'lsa sahifa `satNamuna.ts` dagi namuna kartalarni "Sample" yorlig'i bilan ko'rsatadi.

## CSV

Shablon: `docs/lugat-shablon.csv` (faqat sarlavha). UTF-8, vergul bilan ajratiladi, vergul yoki qo'shtirnoq bor maydon `"..."` ichida yoziladi.

| Ustun | Majburiy | Qoida |
| --- | --- | --- |
| `word` | ha | lotin harflari, bo'shliq, `-`, `'`; 80 belgigacha; takrorlanmaydi (harf katta-kichikligi hisobga olinmaydi) |
| `part_of_speech` | ha | noun, verb, adjective, adverb, preposition, conjunction, pronoun, phrase |
| `definition` | ha | inglizcha, 300 belgigacha, **muallifning o'z so'zlari** |
| `example` | ha | 300 belgigacha, muallifning o'z gapi |
| `difficulty` | ha | easy, medium, hard |
| `topic` | ha | 40 belgigacha (masalan "Science", "Argument") |
| `uzbek` | yo'q | o'zbekcha tarjima, 120 belgigacha (kartaning orqa yuzida "Uzbek:") |

Ta'rif va misol boshqa lug'at, sayt yoki "must-know" ro'yxatlardan ko'chirilmaydi. So'zlar soni sahifada bazadagi haqiqiy son bilan ko'rsatiladi.

## Buyruqlar

```bash
npm run lugat:import -- ~/Tayanch-lugat/sozlar.csv
```

Faqat tekshiradi (dry-run): xatolar (qator raqami bilan), ogohlar (ta'rifda so'zning o'zi, misolda so'z yo'q), qiyinlik va mavzu bo'yicha sonlar. Xato bo'lsa chiqish kodi 1.

```bash
npm run lugat:import -- ~/Tayanch-lugat/sozlar.csv --apply --tasdiqlovchi "Ism"
```

Yozadi: yangi so'z qo'shiladi, mavjudi yangilanadi, CSV da yo'q so'z o'chirilmaydi (faqat soni aytiladi). `--apply` uchun lokal `.env` da `SUPABASE_URL` va `SUPABASE_SERVICE_ROLE_KEY` bo'lishi kerak (muallif o'zi qo'yadi; qiymati chiqarilmaydi, repoga tushmaydi). CSV faylni repodan tashqarida saqlang.

Sinov: `npm run lugat:sinov` (20 ta soxta "SINOV" so'zli to'plam).

## Kvota va tarif bayrog'i

- Kunlik yangi so'z: `plans.limits` ga `{"new_words": {"max": N, "per": "day"}}`. Kalit yo'q = cheklov yo'q (P19 qarori 2026-11-11: hozircha cheklovsiz). Faqat birinchi marta baholangan so'z hisoblanadi; takrorlash cheklanmaydi; davr Toshkent sanasi bo'yicha.
- O'z so'zlarim: tarifning `plans.features` massiviga `{"flag": "vocab_my_words"}` obyekti. Tarif sahifasi features dan faqat satrlarni ko'rsatadi, bayroq ekranga chiqmaydi.
