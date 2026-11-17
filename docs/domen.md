# Domen: tayanchedu.uz

Sayt `https://javohirqaxramonov36-web.github.io/Tayanch/` dan `https://tayanchedu.uz/` ga ko'chadi (2026-11-16).

## Domen

- Registrator: ahost.uz (SUVAN NET), 1 yil, keyingi to'lov 16.11.2027. `tayanch.uz` band edi.
- Hisob, shartnoma va telefon tasdig'i: muallifda. ahost email tasdig'i: muallif qiladi.
- `.uz` domeni cctld.uz moderatsiyasidan keyin (dushanba–juma, ish vaqtida) faollashadi. 2026-11-16: ahost "faollashtirishni kutmoqda", `.uz` zonasi `NXDOMAIN`. 2026-11-17 ertalab: faollashgan (WHOIS ACTIVE, ahost "Domen nomi faol").
- 2026-11-17 (Claude, muallif ruxsati bilan): ahost'da DNS xosting yoqildi, WHOIS'da NS `rdns1/rdns2/rdns3.ahost.uz`. Yozuvlar qo'yildi (jadval pastda). ahost standart yozuvlaridan `@` A `185.196.212.52` → `185.199.108.153` va `www` CNAME `tayanchedu.uz` → GitHub ga o'zgartirildi; `mail`, `ftp` CNAME, MX, DKIM, SPF, DMARC (ahost pochtasi uchun) tegilmagan, hech narsa o'chirilmagan. Uchala `rdns*.ahost.uz` to'rtta IP va `www` CNAME ni qaytaradi (`dig @rdns1.ahost.uz`, sinalgan).
- Ochiq: o'sha kuni `.uz` zonasi hali eski NS (`dns1/dns2.ahost.uz`, `ns1/ns2.ahost.cloud`) ga delegatsiya qilardi, ular REFUSED, shuning uchun 8.8.8.8 va 1.1.1.1 SERVFAIL. cctld zonani yangilagach o'tadi (muddati: tekshirish kerak). Tekshirish: `dig NS tayanchedu.uz @ns1.uz +noall +authority` da `rdns*` chiqsin, `dig +short A tayanchedu.uz @8.8.8.8` to'rtta IP.

## DNS (ahost: Mening domenlarim → tayanchedu.uz → Boshqarish)

1. "DNS xosting" → "DNS xostingni yoqish" (NS `rdns1/2/3.ahost.uz` ga o'zgaradi). Yozuvlar "DNS menejer" ichida (iframe); saqlashda `you_cannot_edit_zone_that_is_not_your_own_zone` chiqsa, ahost sessiyasi tugagan bo'lishi mumkin: qayta kirib takrorlash.
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

1. **Merge'dan oldin:** DNS yozuvlari qo'yilgan va `dig` to'rtta IP qaytaradi. **Bajarildi 2026-11-17 12:11:** `.uz` delegatsiyasi `rdns1/2/3.ahost.uz`, 8.8.8.8 va 1.1.1.1 to'rtta IP va `www` CNAME ni qaytaradi; `http://tayanchedu.uz` GitHub'ning "Site not found" (404) sahifasini beradi, ya'ni so'rov GitHub'ga yetib boryapti, Custom domain hali qo'yilmagan.
2. **Merge'dan oldin (zararsiz, qo'shimcha):** Google Cloud (`tayanch-auth-2611`) → Clients → "Tayanch web" → Authorized JavaScript origins ga `https://tayanchedu.uz`. inPAY oq ro'yxati (https://inpay.uz/merchant/whitelist/) ga `tayanchedu.uz`. **Bajarildi 2026-11-17:** Google "OAuth client saved" (origins: github.io, `localhost:4321`, `https://tayanchedu.uz`; kuchga kirishi 5 daqiqadan bir necha soatgacha); inPAY "Callback whitelist" (kassa #63627) "qo'shildi va darhol ishlaydi". Eslatma: Google Cloud konsoliga `tayanch9@gmail.com` bilan kiriladi; `javohirqaxramonov36` hisobida 2026-11-17 da "You need additional access" chiqdi.
3. **Merge** → "Saytni joylash" Actions tugashini kutish. **Bajarildi 2026-11-17:** PR #170 merge (commit `70f8b5d`), deploy build va deploy job'lari success.
4. **Darhol:** GitHub repo Settings → Pages → Custom domain `tayanchedu.uz` → Save. DNS tekshiruvi o'tgach (sertifikat bir necha daqiqadan 24 soatgacha) "Enforce HTTPS". **Bajarildi 2026-11-17:** `gh api` orqali `cname=tayanchedu.uz`; sertifikat (`tayanchedu.uz`, `www.tayanchedu.uz`) taxminan 2 daqiqada `approved`, `https_enforced=true`. Ildiz `/` bir necha daqiqa CDN keshidagi eski "Site not found" ni berdi, keyin 200.
5. **Sayt yangi domenda ochilgach:** `supabase config diff --remote=uvwejvjrsswssgydwevm` → muallif "ha" → `supabase config push`. Edge Function'larni qayta deploy (`sozlama.ts` o'zgargan). Supabase Secrets'da `SAYT_URL` yoki `TOLOV_ORIGINLAR` qo'yilgan bo'lsa (faqat NOMI tekshiriladi): `SAYT_URL` → `https://tayanchedu.uz` yoki o'chirish; `TOLOV_ORIGINLAR` ga `https://tayanchedu.uz` qo'shish. **Bajarildi 2026-11-17 (muallif "ha"):** `config push` faqat `site_url` va `additional_redirect_urls` ni o'zgartirdi (e'lon qilinmagan 17 ta sozlama tegilmagan). Deploy qilingan 6 ta funksiya qayta deploy: `tolov-yaratish`, `inpay-webhook`, `inpay-holat` (v10), `inpay-muvofiqlash` (v6), `hisob-malumot`, `suhbatdosh` (v5), `verify_jwt` o'zgarmagan; `ai-tutor` avvaldan deploy qilinmagan, tegilmagan. `SAYT_URL` va `TOLOV_ORIGINLAR` secretlari yo'q (standart koddan). Preflight: `tayanchedu.uz` va github.io → 204, begona origin → 403.
6. **Sinov:** bosh sahifa, SAT, email bilan kirish, Google bilan kirish, eski `https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/` yangi manzilga o'tishi, to'lov sahifasi (return_url).
   - Sinalgan (2026-11-17, curl va brauzer): `https://tayanchedu.uz/`, `/uz/`, `/uz/sat/`, `/uz/hisob/kirish/` 200; `http://` → `https://` 301; `www` → apex 301; `github.io/Tayanch/uz/sat/` → `https://tayanchedu.uz/uz/sat/` 301 (GitHub `/Tayanch` ni olib tashlaydi); `tayanchedu.uz/Tayanch/uz/sat/` 404.astro orqali `/uz/sat/` ga o'tadi; Supabase `authorize?provider=google` → 302 accounts.google.com.
   - Sinalmagan: haqiqiy Google va email bilan kirish yangi domenda, to'lov (return_url), telefon.

## Bilinadigan oqibatlar

- Brauzer ma'lumoti origin'ga bog'liq: hisobsiz foydalanuvchining `tayanch:*` yozuvlari (localStorage) va Supabase sessiyasi (`tayanch:auth`) yangi domenga o'tmaydi. Hisob bilan kirganlar qayta kiradi, serverdagi ma'lumot joyida. Hisobsiz brauzerdagi progress eski manzilda qoladi.
- GitHub github.io/Tayanch/... ni custom domenga 301 bilan, `/Tayanch` ni olib tashlab yo'naltiradi (2026-11-17 da sinalgan).
- Eski github.io qatorlari (`config.toml`, `sozlama.ts`, Google origins, inPAY) ko'chish tugagach olib tashlanadi: alohida PR, muallif qarori.
