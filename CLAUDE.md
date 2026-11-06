# Tayanch: ish qoidalari

Til: javoblar o'zbekcha (lotin), qisqa. Kod va fayl nomlari o'z holicha.

## Joriy holat (2026-11-06)
Yangi sessiyada avval `HANDOFF.md` ni o'qi: nima qurilgan, nima qurilmagan, qarorlar, ochiq savollar, nomlash va texnik eslatmalar.
- Qurilgan va saytda: 1-qavat (bosh sahifa), 3-qavat SAT (PR #7), 4-qavat IELTS (PR #8), Lift (PR #10), Topshirish yo'li vositasi (PR #11, qoralama).
- Qilindi, merge kutilmoqda: PR #12, 2-qavat Top Admission kirish sahifasi (`/uz/top-admission/`, maket A, branch `top-admission-kirish`); `bolimlar.ts` da Top Admission `ochiq`.
- Top Admission'da qolganlari (maket: https://claude.ai/artifact/1zP2rnjMp46RgY9WpD84GF):
  1. Chiptadagi qolgan kun (muddat kartalarida hozir "oxirgi kun"): skript, avval spetsifikatsiya.
  2. "Mening yo'lim" bloki (Topshirish yo'li javobidan kirish sahifasida kichik blok): skript, avval spetsifikatsiya.
  3. Türkiye Bursları yo'nalish sahifasi (`/uz/top-admission/turkiye-burslari/`, maket B "Burslar*"). Kirish sahifasidagi kartada hozir "sahifa tez orada".
  4. Top Admission yon paneli: `BolimYon` ga `bolim="top-admission"` (maket "LiftSidebar"); shundan keyin kirish va vosita `BolimQobiq` ga o'tadi.
- Merge kutilmoqda: PR #17, SAT mashq 1-bosqich (`/uz/sat/mashq/`, savol o'ynatgich, xato daftari; branch `sat-mashq-oynatgich`). Savollar banki bo'sh, savollarni muallif beradi. Ochiq savollar: HANDOFF.md 5-bo'lim, 5-band.
- Boshqa qurilmagan: 5-qavat EYUF (dizayn yo'q).
- Build: `PATH=/opt/homebrew/bin:$PATH npm run build` (standart Node 22 Astro 7 uchun eski).

## Loyiha
- Astro, statik sayt, GitHub Pages. `astro.config.mjs`: base "/Tayanch" (harf katta-kichikligiga sezgir), `trailingSlash: 'always'`.
- Sayt 5 qavatli bino: 1 Navigator, 2 Top Admission, 3 SAT prep, 4 IELTS prep, 5 EYUF prep. Sahifalar `src/pages/uz/<bolim>/`, qolip `BolimQobiq`.
- Dizayn: `DESIGN.md` (tokenlar, komponentlar, "Taqiqlar" bo'limi). Qiymatlar faqat `src/styles/tokens.css` dan, xom rang/o'lcham yozilmaydi.
- Ichki havola faqat `yol()` orqali (`src/lib/yol.ts`). Ma'lumotlar: `src/data/` (`qavatlar.ts`, `bolimlar.ts`, `manbalar.ts`, `deadline.ts`).
- Formalar, to'lov, hisob yo'q. Foydalanuvchi ma'lumoti faqat brauzerda, kalitlar `tayanch:` bilan boshlanadi.
- Repo ochiq: `grants-qoralama.json`, `inbox/`, `.env`, token va parollarni repoga qo'shma.
- Natija kafolatlanmaydi. Qoida, talab va muddat faqat rasmiy manbadan, manba va sana bilan.

## Har vazifada tartib (majburiy, men skill nomini yozmasam ham)
1. **Aniqla.** Qaysi qavat/bo'lim va sahifa ekanini aniqla. Aniq bo'lmasa, ko'pi bilan 3 ta savol ber. Faqat kerakli fayllarni o'qi.
2. **Spetsifikatsiya.** Interaktiv funksiya bo'lsa, kod yozishdan oldin 5-8 qatorli xatti-harakat spetsifikatsiyasi yoz (holatlar, hodisalar, klaviatura va telefon xatti-harakati, `localStorage` kaliti `tayanch:...`) va tasdig'imni kut.
3. **Qur.** Pastdagi jadvaldan mos skillni o'zing tanla va ishlat. Katta ishni kichik, mustaqil bosqichlarga bo'l.
4. **Tekshir.** `a11y-check` va `contrast`, so'ng `npm run build`. Telefon va qorong'i mavzuda tekshir.
5. **Hisobot.** Qisqa: nima o'zgardi, qaysi faylda, nima sinalmagan, keyingi qadam.

## Skill tanlash
Bir vazifada bitta asosiy skill. Bir nechta dizayn skillini aralashtirma. Mos skill bo'lmasa, o'zing davom et; skill nomini o'ylab topma.

| Vazifa | Skill |
| --- | --- |
| Yangi sahifa yoki komponent kodi | `frontend-design` |
| Tugma, forma, kartochka kabi interaktiv elementlar xatti-harakati | `interaction-design` |
| Foydalanuvchi yo'li (masalan "Topshirish yo'li") | `journey-mapping` |
| Tayyor sahifani dizayn jihatdan baholash | `design-critique` |
| Qulaylik (a11y) tekshiruvi, kontrast | `a11y-check`, `contrast` |
| Sahifa ishonchliligi va sifati | `website-quality-checker` |
| Tugma va xabar matni (UX yozuvi) | `ux-writing` (o'zbekcha matnni men tekshiraman) |
| Kod tekshiruvi, nosozlik, test rejasi | `code-review`, `debug`, `testing-strategy` |
| Joylashdan oldin | `deploy-checklist` |
| Limit sarfi diagnostikasi | `token-doctor`, `inspect-context`, `find-bloat`: faqat men so'raganimda |

Ishlatma (loyihaga mos emas yoki DESIGN.md bilan zid): `liquid-glass`, `code-to-figma`, `figma-to-code`, `handoff-to-code`, `chrome-*`, PDF Viewer, Productivity, `standup`, `incident-response`. Dizayn uslubi faqat DESIGN.md dan olinadi: gradient, glassmorphism yo'q.

## Limitni tejash
- Fayllarni to'liq o'qima: avval qidir (Grep), keyin kerakli qismini o'qi.
- Hech qachon o'qima: `package-lock.json`. Dizayn maketlari (HTML): faqat men aytgan ekranni.
- Bir vazifa = bitta sahifa yoki komponent.
- Men so'ramasam, subagent va chuqur tadqiqotni ishlatma.
- Javob qisqa.

## Sifat
- "Tayyor" deyishdan oldin `npm run build` natijasini ko'rsat.
- Sinab ko'rmaganingni "sinalgan" dema, "sinalmagan" deb yoz. Aniq bilmagan texnik faktni "tekshirish kerak" deb belgila.
- Tugma faqat `<button>` yoki `<a>`, ikonka emoji emas.
- Uydirma raqam, sana, sharh yo'q. Savol-javob namunalari ekranda "Namuna" deb belgilanadi.
- Bepul va ochiq resurslar afzal.
