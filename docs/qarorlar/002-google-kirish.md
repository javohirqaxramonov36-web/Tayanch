# 002. Google bilan kirish (P03B)

- **Holat**: qabul qilingan (spetsifikatsiya muallif tasdiqlagan, 2026-11-09). Kod: branch `sat-google-login`. Google provider Supabase'da yoqilgan va haqiqiy Google bilan lokal dev'da sinalgan (2026-11-10, pastda "Sinov").
- **Bog'liq**: `001-hisob-tolov-server.md` (bitta hisob, Supabase Auth), `supabase/README.md` 2.5 (sozlash qadamlari).
- **Joy**: hisob sahifalari 1-qavatda (`/uz/hisob/`, o'zbekcha; PR #61). Spetsifikatsiyada `/uz/sat/hisob/` (inglizcha) edi, hisob ko'chgani uchun shu yerga moslandi.

## Oqim

1. Kirish yoki ro'yxat sahifasida "Google bilan davom etish" (`GoogleTugma`). `?keyin=` sessionStorage `tayanch:hisob-keyin` ga yoziladi.
2. Alohida **PKCE** mijozi (`googleMijoz()`, `src/lib/hisob.ts`): `flowType: 'pkce'`, `autoRefreshToken: false`, `detectSessionInUrl: false`, kalit bir xil `tayanch:auth`. `signInWithOAuth({ provider: 'google', redirectTo: <origin>/Tayanch/uz/hisob/callback/ })`: query'siz, Redirect URLs ro'yxatida aniq shu manzil.
3. Google → Supabase → `/uz/hisob/callback/?code=...`. Sahifa faqat PKCE mijozini yaratadi va `exchangeCodeForSession(code)` qiladi, URL'ni tozalaydi.
4. `keyin` sessionStorage'dan o'qib o'chiriladi va `xavfsizKeyin` bilan qayta tekshiriladi (faqat `/Tayanch/uz/`, callback emas; aks holda profil).
5. Rozilik darvozasi: `profiles.consent_version` bo'sh bo'lsa `/uz/hisob/rozilik/?keyin=`, bor bo'lsa `keyin` (`location.replace`).

## Nega ikki mijoz (PKCE faqat Google, email havolalari implicit)

- supabase-js'da `flowType` butun mijoz uchun (2.119 da standart `implicit`).
- Email havolalari (tasdiqlash, parol tiklash) **implicit** qoladi: xat boshqa brauzer yoki telefonda ochilsa ham ishlaydi. PKCE kodi esa faqat so'ragan brauzerda almashtiriladi (verifier `localStorage` da, `tayanch:auth-code-verifier`), 5 daqiqa ichida, bir marta.
- Google uchun PKCE: OAuth qaytishi doim shu brauzerga keladi, token URL hash'ida ko'rinmaydi.
- Implicit mijoz `?code=` URL'ini ko'rsa "Not a valid implicit grant flow url" xatosini beradi: shuning uchun callback sahifasida implicit mijoz (`detectSessionInUrl: true`) yaratilmaydi.
- Ikki mijoz bir sahifada bo'lsa (kirish sahifasida tugma bosilganda) supabase-js console'da "Multiple GoTrueClient instances" ogohligini berishi mumkin: kalit va qulf bir xil, PKCE mijozi token yangilamaydi.

**Muqobil (tanlanmadi):** butun mijozni PKCE qilish va email shablonlarini `token_hash` + `verifyOtp` ga o'tkazish (Supabase hujjatidagi SSR usuli). Bu bitta mijoz beradi, lekin 3 ta email shablonini o'zgartirish, yangi tasdiqlash sahifasi va qayta sinov kerak; hozirgi P03 oqimi sinalgan. O'z SMTP (P28) bilan shablonlar baribir qayta yoziladi: o'shanda qayta ko'riladi.

## Xatolar (callback, `role="alert"`, "Qayta urinish" → kirish `?keyin=` bilan)

| Holat | Matn |
| --- | --- |
| `?error=access_denied` (foydalanuvchi Google'da bekor qildi) | Google orqali kirishni bekor qildingiz. |
| Kod muddati o'tgan / ishlatilgan / verifier yo'q (`flow_state_expired`, `flow_state_not_found`, `bad_code_verifier`, `pkce_code_verifier_not_found`) | Bu kirish urinishining muddati o'tgan. Qaytadan boshlang. |
| Tarmoq | P03 matni ("Serverga ulanib bo'lmadi…") |
| Boshqa | Google orqali kirib bo'lmadi. Qayta urinib ko'ring. |

Bekor qilinganda Supabase `error=access_denied` ni redirect manziliga query'da (va hash'da) uzatadi: Supabase `/auth/v1/callback` ga Google javobi `?error=access_denied&state=…` qo'lda yuborilganda 302 → `…/uz/hisob/callback/?error=access_denied&error_description=#error=access_denied` (2026-11-10). Google sahifasidagi haqiqiy "Cancel" tugmasi bosilmagan: ruxsat avval berilgan hisoblarda Google ruxsat ekranini ko'rsatmadi.

## Rozilik darvozasi

- `hisobQorovul()` (himoyalangan sahifalar), callback va kirish sahifasi: sessiya bor → `profiles.consent_version` o'qiladi.
- Bo'sh: email bilan ro'yxatda `user_metadata.consent_version` joriy versiyaga (`hisobSozlama.rozilikVersiya`, `2026-11-09`) teng bo'lsa darvoza uni `profiles` ga o'zi yozadi (qayta so'ramaydi); aks holda `/uz/hisob/rozilik/`.
- Rozilik sahifasi: yosh belgisi (`hisobSozlama.minYosh`), Maxfiylik siyosati (havola `/uz/maxfiylik/`) va Foydalanish shartlari (sahifasi P23 da), "Davom etish" faqat `consent_version` ni yozadi (`consent_at` ni trigger qo'yadi), "Chiqish".
- `profiles` o'qib bo'lmasa: darvoza yopiq, xato ko'rsatiladi (kontent ochilmaydi).
- `user_metadata` ni foydalanuvchi o'zi o'zgartira oladi: bu dalil emas, faqat "formada belgi qo'ygan" degan qulaylik. Huquqiy yozuv `profiles.consent_at` (server vaqti).

## Hisob birlashishi (identity linking) xavfi

- Supabase avtomatik linking: bir xil email → bitta foydalanuvchi; **tasdiqlanmagan** identity'lar olib tashlanadi (supabase.com/docs/guides/auth/auth-identity-linking, 2026-11-09).
- Holat: kimdir boshqa odamning email'i bilan email/parol hisob ochib, tasdiqlamay qoldirsa, haqiqiy egasi Google bilan kirganda tasdiqlanmagan parol identity'si o'chirilishi kerak (hujjat mazmuni). Bu yo'l hujjatda batafsil yozilmagan: **tekshirish kerak** (haqiqiy sinov: tasdiqlanmagan email/parol → keyin shu email bilan Google → parol bilan kirib bo'lmasligi).
- Tasdiqlangan email/parol + keyin Google (bir xil email): bitta hisob, `auth.identities` da `email` va `google` (sinalgan 2026-11-10). Bog'langandan keyin parol bilan kirish: sinalmagan.

## Ma'lumot

- Google bergan ism `profiles.display_name` ga (trigger `handle_new_user`, RLS: faqat o'zi o'qiydi). Google rasmi ko'rsatilmaydi va saqlanmaydi. Reytingda faqat `nickname`.
- Scope'lar faqat `openid`, `email`, `profile`.

## Google consent ekrani

- "Testing" holatida 100 tagacha test foydalanuvchi va ruxsat 7 kunda tugashi mumkin; faqat asosiy scope'li ilovalarga bu cheklovlarning bir qismi taalluqli emas (support.google.com/cloud/answer/15549945): **tekshirish kerak**.
- "Publish app" (In production): P28 ro'yxatida.

## Sinov (2026-11-10, lokal dev `localhost:4321`, muallif o'zi bosdi va Google'ga o'zi kirdi)

Provider: `/auth/v1/settings` da `external.google: true`, `/auth/v1/authorize?provider=google` 302 → `accounts.google.com`. Baza faqat o'qib tekshirildi (`supabase db query --remote --read-only`, email chiqarilmadi).

| Ssenariy | Natija |
| --- | --- |
| Yangi Google hisobi (test user) → callback → `/uz/hisob/rozilik/` → "Davom etish" → `keyin` | Sinalgan. Yangi foydalanuvchi, identity faqat `google`, `profiles.consent_version` = `2026-11-09`, `consent_at` bor, `display_name` to'ldi. Bu urinish `?keyin=` siz boshlangan: standart profilga qaytdi. |
| Chiqish → `kirish/?keyin=/Tayanch/uz/sat/` → Google → callback | Sinalgan. Rozilik qayta so'ralmadi, to'g'ri `/Tayanch/uz/sat/` ochildi; `tayanch:auth-code-verifier` va `tayanch:hisob-keyin` tozalangan. |
| Bekor qilish (`error=access_denied`) | Qisman: Supabase callback'i xatoni sahifaga uzatadi (yuqorida), sahifa "Google orqali kirishni bekor qildingiz." (`role="alert"`) va "Qayta urinish" (kirish `?keyin=` bilan) ko'rsatadi. Google'dagi haqiqiy "Cancel" bosilmagan. |
| Tasdiqlangan email/parol hisobi bilan bir xil email | Sinalgan: bitta foydalanuvchi, identity'lar `email` + `google`; rozilik bir marta yozildi. Keyin parol bilan kirish sinalmagan. |

Saytda (GitHub Pages) 2026-11-10 da PR #64 merge va deploy'dan keyin sinalgan: `kirish/?keyin=/Tayanch/uz/sat/` → Google → callback → `/uz/sat/` (mavjud hisob, rozilik qayta so'ralmadi).

Sinalmagan: saytda yangi hisob va rozilik sahifasi (lokal dev'da sinalgan), telefon, tasdiqlanmagan email/parol + Google (yuqoridagi xavf), muddati o'tgan kod xatosi, Google'dagi haqiqiy "Cancel".
