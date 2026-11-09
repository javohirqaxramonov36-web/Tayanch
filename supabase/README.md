# Supabase: dashboard sozlamalari (hisob, P03)

Loyiha: Frankfurt mintaqasidagi Tayanch loyihasi (ref muallifda). Bu faylda faqat sozlash qadamlari; kalit, parol va SMTP ma'lumotlari bu yerga **yozilmaydi**. Ularni muallif Supabase dashboard'iga o'zi kiritadi.

Brauzer uchun ochiq qiymatlar (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`): `docs/lokal-ish-tartibi.md`, "Supabase o'zgaruvchilari".

Manbalar (tekshirildi 2026-11-09): supabase.com/docs/guides/auth/redirect-urls, /auth/rate-limits, /auth/auth-smtp.

**Holat (2026-11-09):** 1–2-bo'limdagi sozlamalar `supabase/config.toml` da yozilgan va Tayanch loyihasiga qo'llangan (`supabase config push --remote=<ref>`; faylda yo'q sozlamalar o'zgarmaydi). O'zgargani: Site URL (`localhost:3000` edi), Redirect URL'lar (bo'sh edi), parol uzunligi 6 → 8. Email tasdiqlash avvaldan yoqilgan edi. Brauzer kaliti: publishable (`sb_publishable_...`, legacy `anon` emas); `.env` va GitHub repo variables'ga qiymat ko'rsatilmasdan CLI orqali yozilgan. Keyingi o'zgarishlar ham shu fayl orqali: avval `supabase config diff --remote=<ref>`, so'ng `push`.

## 1. URL Configuration

Dashboard → Authentication → URL Configuration (`/dashboard/project/_/auth/url-configuration`).

**Site URL** (havolada `redirectTo` bo'lmasa shu ishlatiladi):

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
```

**Redirect URLs** (ruxsat ro'yxati). Hisob sahifalari 1-qavatda (`/uz/hisob/`, 2026-11-09). Kod ikkita manzilga qaytaradi: tasdiqlash xati → `kirish/` (ba'zan `?keyin=...` bilan), parol tiklash xati → `parol-tiklash/`. Eski `/uz/sat/hisob/` manzillari ham ro'yxatda qoladi (ular yangi joyga yo'naltiradi). Base `/Tayanch` harf katta-kichikligiga sezgir. Aniq ro'yxat: `supabase/config.toml`.

```
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/hisob/parol-tiklash/
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/kirish/**
https://javohirqaxramonov36-web.github.io/Tayanch/uz/sat/hisob/parol-tiklash/
http://localhost:4321/Tayanch/**
```

`**` har qanday belgini (`/` ham) qamraydi. Query (`?keyin=`) glob bilan mos kelishini hujjat aniq aytmaydi: **tekshirish kerak** (Supabase hujjatidagi glob sinov vositasida yoki haqiqiy xat bilan). Mos kelmasa, Supabase Site URL'ga qaytaradi: foydalanuvchi baribir kirgan bo'ladi, faqat `keyin` yo'qoladi.

Lokal port boshqacha bo'lsa (masalan `astro dev` 4321 dan boshqa), shu port ham qo'shiladi.

## 2. Email bilan kirish

Dashboard → Authentication → Sign In / Providers → Email:

- **Confirm email**: yoqilgan (majburiy tasdiqlash, P03 talabi).
- **Minimum password length**: 8 dan kam emas (formadagi `hisobSozlama.parolMinUzunlik`; HANDOFF §5, 18-savol).
- **Secure password change** va boshqa sozlamalar: standart holatda.

Oqim turi: brauzer kodi `flowType: 'implicit'` ishlatadi (`src/lib/hisob.ts`). Sabab: xatdagi havola boshqa brauzer yoki telefonda ochilsa ham ishlashi kerak; PKCE havolani so'ragan brauzerni talab qiladi. Standart email shablonlari (`{{ .ConfirmationURL }}`) o'zgartirilmaydi: **tekshirish kerak**, `redirect_to` to'g'ri o'tishi birinchi haqiqiy sinovda ko'riladi.

## 3. Standart pochta xizmati: faqat sinov uchun

Supabase'ning o'z pochta xizmati (hujjat bo'yicha, 2026-11-09):

- soatiga **2 ta** xat (butun loyiha bo'yicha; ogohlantirishsiz o'zgarishi mumkin);
- faqat loyiha **jamoasi a'zolari** manziliga yuboradi, boshqa manzil "Email address not authorized" xatosini oladi (formada "Could not create the account" bo'lib chiqadi);
- yetkazish kafolati (SLA) yo'q.

Demak haqiqiy foydalanuvchilar uchun o'z SMTP kerak (P28). Shu paytgacha sinov faqat muallifning (jamoa a'zosi) email'i bilan.

## 4. O'z SMTP (P28)

**Tanlov (2026-11-09): Gmail SMTP, alohida Gmail hisobi bilan.** Muallifda o'z domen yo'q (2026-11-09). Resend va boshqa xizmatlar yuboruvchi domenni tasdiqlashni (SPF, DKIM) talab qiladi, `github.io` ga DNS yozib bo'lmaydi. Gmail'ning o'z SMTP'si domen talab qilmaydi va xatni Google o'zi imzolaydi.

- Server `smtp.gmail.com`, port 465 (SSL) yoki 587 (TLS), login: to'liq Gmail manzili va App Password (Google Workspace yordami "Send email from a printer, scanner, or app", 2026-11-09).
- App Password uchun 2 bosqichli tasdiqlash yoqilgan bo'lishi kerak; yaratish joyi myaccount.google.com/apppasswords; Google parolini o'zgartirish hamma App Password'ni bekor qiladi (support.google.com/accounts/answer/185833).
- Shaxsiy Gmail limiti: kuniga 500 xat (support.google.com/mail/answer/22839). Supabase o'z SMTP bilan boshlang'ich limiti soatiga 30 xat (supabase.com/docs/guides/auth/auth-smtp).
- Nega Brevo emas: Brevo domensiz Gmail manzilini yuboruvchi qilib beradi, lekin xat Google imzosisiz ketadi (gmail.com DMARC: `p=none; sp=quarantine`, DNS, 2026-11-09) va Spam'ga tushish xavfi katta.
- Keyin: foydalanuvchi ko'paysa yoki kuniga 500 dan oshsa, o'z domen + Resend (bepul: oyiga 3000, kuniga 100 xat, resend.com/pricing) ga o'tiladi.

Muallif qiladi (parol chatga, repoga yozilmaydi):

1. Yangi Gmail hisobi oching, faqat sayt uchun (masalan `tayanch.xat@gmail.com`; shaxsiy pochtangiz emas).
2. Shu hisobda 2 bosqichli tasdiqlashni yoqing: myaccount.google.com → Security.
3. myaccount.google.com/apppasswords → nom "Supabase" → Create. 16 belgili parol chiqadi: uni faqat 4-qadamga qo'ying.
4. Supabase Dashboard → Authentication → Emails → SMTP Settings: "Enable custom SMTP"; Sender email: 1-qadamdagi Gmail; Sender name `Tayanch`; Host `smtp.gmail.com`; Port `465`; Username: shu Gmail; Password: 3-qadamdagi parol. Save.
5. Claude'ga "tayyor" deng: shablonlarni qo'llaydi va sinovni bajaradi.

**Xat shablonlari** (o'zbekcha): `supabase/templates/` (`tasdiqlash.html`, `parol-tiklash.html`, `email-almashtirish.html`), mavzular `config.toml` da. Qo'llash: `supabase config diff --remote=<ref>` (2026-11-09: 3 ta mavzu farqi, boshqa e'lon qilingan farq yo'q), so'ng `supabase config push --remote=<ref>`. Havola `{{ .ConfirmationURL }}` o'zgarmagan. `config.toml` da `/uz/hisob/callback/` Redirect URL ham bor (PR #64 Supabase'ga qo'llagan): faylda bo'lmasa push uni o'chirardi.

Sinov (SMTP yoqilgach): yangi email bilan ro'yxat, tasdiqlash, kirish, parol tiklash; xat "Spam"ga tushmasligini ko'rish.

## 5. Keyingi vazifalar

- P03B: Google bilan kirish (Google provider, client ID/secret faqat dashboard'da; Redirect URL'lar shu ro'yxatda).
- P12: `profiles` jadvali (RLS bilan), maqsad ball va imtihon sanasi. Hozircha `display_name`, `nickname` Supabase `user_metadata` da.
- P23: Maxfiylik va Shartlar sahifalari (`hisobSozlama.maxfiylikSahifa`, `shartlarSahifa`).
