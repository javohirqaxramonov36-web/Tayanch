# Domen: tayanchedu.uz

Sayt `https://javohirqaxramonov36-web.github.io/Tayanch/` dan `https://tayanchedu.uz/` ga ko'chadi (2026-11-16).

## Domen

- Registrator: ahost.uz (SUVAN NET), 1 yil, keyingi to'lov 16.11.2027. `tayanch.uz` band edi.
- Hisob, shartnoma va telefon tasdig'i: muallifda. ahost email tasdig'i: muallif qiladi.
- `.uz` domeni cctld.uz moderatsiyasidan keyin (dushanba–juma, ish vaqtida) faollashadi. 2026-11-16 holati: ahost "faollashtirishni kutmoqda", `.uz` zonasi `NXDOMAIN` qaytaradi, ahost'da "DNS xostingni yoqish" ishlamadi.

## DNS (ahost: Mening domenlarim → tayanchedu.uz → Boshqarish)

1. "DNS xosting" → "DNS xostingni yoqish" (NS `rdns1/2/3.ahost.uz` ga o'zgaradi).
2. Yozuvlar (GitHub Pages hujjati, apex domen):

| Nom | Turi | Qiymat |
| --- | --- | --- |
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `javohirqaxramonov36-web.github.io.` |

3. Tekshirish: `dig +short A tayanchedu.uz @8.8.8.8` (yoki `https://dns.google/resolve?name=tayanchedu.uz&type=A`) to'rtta IP qaytarsin.

## Repo (shu PR)

- `astro.config.mjs`: `site: 'https://tayanchedu.uz'`, `base` olib tashlangan (ildiz). `yol()` va `BASE_URL` o'zgarishsiz ishlaydi.
- `public/CNAME`: `tayanchedu.uz` (Actions deploy'da majburiy emas).
- `src/pages/404.astro`: eski `/Tayanch/...` yo'li shu domendagi `/...` ga o'tadi (query va hash saqlanadi).
- `supabase/config.toml`: Site URL yangi domen; Redirect URLs ga yangi qatorlar qo'shilgan, eskilari qoldirilgan.
- `supabase/functions/_shared/sozlama.ts`: `STANDART_SAYT_URL = https://tayanchedu.uz`, originlarga yangi domen qo'shilgan, eski github.io qoldirilgan.
- `.github/workflows/uptime.yml`: `SAYT=https://tayanchedu.uz`.

## Tartib (sayt buzilmasligi uchun)

Muhim: yangi build (`base` yo'q) eski github.io/Tayanch/ manzilida ishlamaydi (CSS va havolalar domen ildiziga qaraydi), eski build esa custom domenda ishlamaydi. Shuning uchun merge va Custom domain ketma-ket, DNS tayyor bo'lgandan keyin qilinadi.

1. **Merge'dan oldin:** DNS yozuvlari qo'yilgan va `dig` to'rtta IP qaytaradi.
2. **Merge'dan oldin (zararsiz, qo'shimcha):** Google Cloud (`tayanch-auth-2611`) → Clients → "Tayanch web" → Authorized JavaScript origins ga `https://tayanchedu.uz`. inPAY oq ro'yxati (https://inpay.uz/merchant/whitelist/) ga `tayanchedu.uz`.
3. **Merge** → "Saytni joylash" Actions tugashini kutish.
4. **Darhol:** GitHub repo Settings → Pages → Custom domain `tayanchedu.uz` → Save. DNS tekshiruvi o'tgach (sertifikat bir necha daqiqadan 24 soatgacha) "Enforce HTTPS".
5. **Sayt yangi domenda ochilgach:** `supabase config diff --remote=uvwejvjrsswssgydwevm` → muallif "ha" → `supabase config push`. Edge Function'larni qayta deploy (`sozlama.ts` o'zgargan). Supabase Secrets'da `SAYT_URL` yoki `TOLOV_ORIGINLAR` qo'yilgan bo'lsa (faqat NOMI tekshiriladi): `SAYT_URL` → `https://tayanchedu.uz` yoki o'chirish; `TOLOV_ORIGINLAR` ga `https://tayanchedu.uz` qo'shish.
6. **Sinov:** bosh sahifa, SAT, email bilan kirish, Google bilan kirish, eski `https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/` yangi manzilga o'tishi, to'lov sahifasi (return_url).

## Bilinadigan oqibatlar

- Brauzer ma'lumoti origin'ga bog'liq: hisobsiz foydalanuvchining `tayanch:*` yozuvlari (localStorage) va Supabase sessiyasi (`tayanch:auth`) yangi domenga o'tmaydi. Hisob bilan kirganlar qayta kiradi, serverdagi ma'lumot joyida. Hisobsiz brauzerdagi progress eski manzilda qoladi.
- GitHub github.io/Tayanch/... ni custom domenga qanday yo'naltirishi (yo'lda `/Tayanch` qoladimi yo'qmi): tekshirish kerak. Ikkala holatda ham sahifa ochiladi (qolsa, 404.astro yo'naltiradi).
- Eski github.io qatorlari (`config.toml`, `sozlama.ts`, Google origins, inPAY) ko'chish tugagach olib tashlanadi: alohida PR, muallif qarori.
