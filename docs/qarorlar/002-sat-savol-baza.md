# 002. Original SAT savollari bazasi: `public.questions` va P05 formati

- **Holat**: qabul qilingan (muallif "moslashtir" dedi, 2026-11-09; tafsilotlar Claude qarori, muallif ochiq qarorlarni Claude'ga topshirgan).
- **Fayl**: `supabase/migrations/20261109120000_questions_p05.sql` (0010). Sinov: `supabase/tests/rls_test.sql`, 16-blok; `npm run db:tekshir`.
- **Bog'liq**: P02 sxemasi (PR #38: `questions`, RPC, `question-figures`), P05 format va import (PR #63: `docs/savol-formati.md`, `scripts/savol-import.mjs`).

## Kontekst

P05 importi alohida `sat_questions` jadvalini va `savol-rasmlar` bucket'ini kutgan edi. Lekin Tayanch Supabase loyihasiga PR #38 ning 9 migratsiyasi (2026-11-08) allaqachon qo'llangan: savollar `public.questions` da, unga sessiya, urinish, takrorlash, kvota RPC'lari va `question-figures` bucket'ining Storage siyosati bog'langan. Ikkinchi jadval ikki manba haqiqatini yaratardi va RPC'lar uni ko'rmasdi.

## Qaror

1. **Bitta savollar jadvali: `public.questions`.** Alohida `sat_questions` va `savol-rasmlar` qurilmaydi.
2. **0010 migratsiyasi P05 ga yetishmagan narsani qo'shadi:**
   - ustunlar `drafted_by` (`ai`/`human`), `verified_at`, `tags` (standart `{}`), `content_hash`. Eski va qo'lda kiritilgan qatorlar uchun `drafted_by`, `content_hash` bo'sh bo'lishi mumkin; import har doim yozadi;
   - `verified` faqat `verified_by` bor, `author` dan farqli (katta-kichik harf va chetdagi bo'shliq hisobga olinmaydi) va `verified_at` bor bo'lsa (P05 qarori "author ≠ verified_by");
   - `draft` da `verified_by`, `verified_at` bo'sh. `hidden` (admin yashirgan) savolda tasdiq izi saqlanadi;
   - rasm bo'lsa `figure.alt` majburiy; `source = 'original'`.
3. **Versiya:** 0003 dagi trigger mazmun o'zgarsa `version` ni +1 qiladi. Endi `greatest(yangi, eski + 1)`: import versiyani o'zi oshirib yuborsa (masalan 1 → 3), baza fayldan orqada qolmaydi. Versiyasiz qo'lda tahrirda avvalgidek +1.
4. **Import shu jadvalga moslanadi** (PR #63 da):
   - jadval `questions`, bucket `question-figures` (env bilan o'zgartirish mumkin);
   - `answer` → `correct`: mcq `{"choice": "B"}`, spr `{"accepted": [...]}` (RPC `check_answer` shu shaklni o'qiydi);
   - `figure` → `{path, alt, type}` (`can_read_question_figure` va `start_session` `path` ni o'qiydi);
   - bazada `hidden` bo'lgan savol import bilan qayta ochilmaydi (yashirish admin qarori, `audit_log` bilan).
5. **0003 ning shakl tekshiruvi o'zgarmaydi** (mcq 2–6 variant). P05 ning qat'iyroq qoidalari (aniq 4 variant, A–D, R&W da passage, HTML va KaTeX, SPR qiymatlari) P05 tekshiruvchisida qoladi: import tekshiruvdan o'tmagan savolni yubormaydi.

## Brauzer va xavfsizlik (o'zgarmaydi, PR #38 dagidek)

- `questions`: RLS yoqilgan, `anon`/`authenticated` uchun siyosat ham, huquq ham yo'q. Savol faqat RPC orqali, `correct` va `explanation` siz; javob `submit_answer` da serverda tekshiriladi. Kvota raqamlari P19 da (`plans.limits`, hozir `{}`), uydirma raqam yozilmaydi.
- `question-figures`: private; rasm faqat shu foydalanuvchiga berilgan sessiyadagi `verified` savolniki bo'lsa imzolangan havola bilan o'qiladi. Faqat service role yuklaydi.
- SVG ichida skript bo'lishi mumkin: rasmni chiqaradigan kod SVG ni `<img>` orqali ko'rsatishi kerak (`<img>` ichida skript ishlamaydi). Sayt qismi qurilganda tekshiriladi.

## Nima sinalgan, nima sinalmagan (2026-11-09)

- **Sinalgan (lokal Postgres 17, `npm run db:tekshir`):** 10 migratsiya ikki marta xatosiz; PR #38 ning 1–15 sinovlari (sinov savollari yangi qoidaga moslandi: `verified_by` `author` dan farqli, `verified_at` bor) va yangi 16-sinov: har yangi CHECK rad etadi, import shaklidagi upsert `on conflict (external_id)` ishlaydi, import versiyasi (3) saqlanadi, versiyasiz tahrirda +1.
- **Sinalmagan:** Tayanch loyihasiga `supabase db push`; P05 import `--apply` haqiqiy bazada.
- **Diqqat:** PR #38 bazaga qo'llangan, lekin `main` ga merge qilinmagan (va `main` bilan konfliktda). Bu PR #38 ustiga qurilgan; `main` da migratsiyalar bo'lmaguncha boshqa branch'dan `db push` "remote migration not found locally" bilan to'xtaydi.
