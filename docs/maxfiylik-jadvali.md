# Maxfiylik jadvali (P23, 2026-11-11)

Qaysi ma'lumot, nima uchun, qayerda va qancha saqlanadi. Ommaviy matn: `/uz/maxfiylik/` (asosiy, o'zbekcha) va `/uz/sat/huquqiy/maxfiylik/` (inglizcha nusxa). Jadval va sahifa bir xil bo'lishi kerak: yangi jadval yoki brauzer kaliti qo'shilsa, shu fayl, Maxfiylik sahifalari, `supabase/functions/hisob-malumot/index.ts` (`JADVALLAR`, eksport) va `src/data/brauzerKalitlari.ts` birga yangilanadi.

Holat: **qoralama**, yurist tekshirmagan. "Tekshirish kerak" ustunidagi savollar ochiq.

## Server (Supabase, Frankfurt)

| Ma'lumot | Jadval / joy | Nima uchun | Qancha saqlanadi | Hisob o'chirilganda | Eksportda |
| --- | --- | --- | --- | --- | --- |
| Email, parol xeshi, kirish sanalari, Google identifikatori | `auth.users`, `auth.identities` (Supabase Auth) | Kirish, xatlar | Hisob ochiq turguncha | O'chadi | Ha (parol xeshisiz: email, sanalar, provayderlar, `user_metadata`) |
| Ism, taxallus, SAT maqsad, joriy ball, imtihon sanasi, rozilik versiyasi va vaqti, yosh guruhi, ota-ona ismi | `profiles` | Profil, rozilik dalili (LX02 21-modda) | Hisob ochiq turguncha | O'chadi (cascade) | Ha |
| Yo'l xaritasi javoblari | `onboarding_profiles` | Bosh sahifadagi yo'l xaritasi | Hisob ochiq turguncha | O'chadi | Ha |
| Mashq sessiyalari, javoblar, to'g'riligi, vaqt | `practice_sessions`, `attempts` (savollar ro'yxati `session_questions` da, sessiya bilan) | Natijalar, takrorlash, tavsiyalar | Hisob ochiq turguncha | O'chadi | Ha (`session_questions` alohida emas) |
| Takrorlash navbati, belgilangan savollar | `review_queue`, `bookmarks` | Takrorlash | Hisob ochiq turguncha | O'chadi | Ha |
| Rasmiy test natijalari va xatolari | `official_tests`, `official_mistakes` | Test tracker | Hisob ochiq turguncha | O'chadi | Ha |
| O'quv reja | `study_plans`, `plan_tasks` | Reja tuzgich | Hisob ochiq turguncha | O'chadi | Ha |
| Lug'at progressi, o'z so'zlari | `vocab_progress`, `user_vocab_words`, `private.vocab_imports` | Lug'at | Hisob ochiq turguncha | O'chadi | Ha (`private.vocab_imports` dan tashqari: REST orqali o'qilmaydi) |
| Sinxron holat | `user_state` | Qurilmalar orasida | Hisob ochiq turguncha | O'chadi | Ha |
| Obuna | `subscriptions` | Tarif imkoniyatlari | Hisob ochiq turguncha | O'chadi (faol obuna ham) | Ha |
| Kvota hisoblagichlari | `usage_counters` | Free/Pro cheklovlari | Hisob ochiq turguncha | O'chadi | Ha |
| Savol haqida xabar, fikr | `reports`, `feedback` | Savol sifatini tuzatish | Hisob ochiq turguncha | O'chadi | Ha |
| Analitika hodisalari | `events` (hozircha brauzer yozmaydi) | Mahsulot statistikasi | Hisob ochiq turguncha | O'chadi | Ha |
| O'qituvchi guruhi a'zoligi: guruhdagi ism, qo'shilgan sana, ulashish tanlovi, rozilik versiyasi va vaqti, 18 yoshgacha ota-ona ismi va tasdiq vaqti | `group_members` | O'qituvchi o'quvchi ruxsat bergan natijani ko'rishi (P34, `docs/qarorlar/004-guruhlar.md`) | Guruhda turguncha; chiqish, chiqarilish yoki guruh o'chishi bilan o'chadi | O'chadi | Ha |
| O'qituvchi guruhlari va guruh tarifi: guruh nomi, o'quvchilarga ko'rinadigan ism, taklif kodi, limitlar, muddat | `groups`, `group_licenses` | Guruh boshqaruvi | Hisob yoki guruh o'chirilguncha | O'chadi (a'zoliklar ham) | Ha |
| Noto'g'ri taklif kodi urinishlari (vaqt) | `private.group_code_attempts` | Kodni taxmin qilishdan himoya (soatiga 20) | 1 soat (keyingi tekshiruvda o'chiriladi) | O'chadi | Yo'q |
| AI Tutor suhbatlari va xabarlari | `ai_conversations`, `ai_messages` (P33); kunlik so'rov hisobi `private.ai_usage` | Tutor javobi, suhbat tarixi | Hisob ochiq turguncha | Suhbat va xabarlar o'chadi; `private.ai_usage` qoladi, `user_id` null | Ha (`private.ai_usage` dan tashqari). Maxfiylik sahifasi matnida hali yo'q (2026-11-13) |
| Mock imtihon: forma va urinishlar | `mock_forms`, `mock_attempts` (modul va javoblar `mock_modules`, `mock_answers` da, urinish bilan) | To'liq mock imtihon (P30) | Hisob ochiq turguncha | O'chadi | Ha (`mock_modules`, `mock_answers` alohida emas). Maxfiylik sahifasi matnida hali yo'q (2026-11-13) |
| To'lov: tarif, summa, holat, sana, inPAY raqami | `payments` | To'lov va buxgalteriya | **Tekshirish kerak** (buxgalter/yurist) | Qoladi, `user_id` null (migratsiya 20261112090000) | Ha (`raw` dan tashqari) |
| inPAY webhook jurnali | `payment_events` (foydalanuvchiga to'g'ridan bog'lanmagan, buyurtma raqami bilan) | Takror webhookni aniqlash, nizolar | **Tekshirish kerak** | Qoladi | Yo'q |
| Admin va xavfsizlik jurnali | `audit_log` (`account_deleted`: hisob ID va to'langan to'lovlar soni, email yo'q; o'chirish bajarilmasa `account_delete_failed` va xato kodi) | Xavfsizlik, nizolar | **Tekshirish kerak** | Qoladi | Yo'q |
| Supabase texnik jurnallari va zaxira nusxalari | Supabase | Xizmat ishlashi | **Tekshirish kerak** (Supabase hujjati) | Supabase muddati bo'yicha | Yo'q |

## Uchinchi tomonlar

| Kim | Nima oladi | Nima uchun | Tekshirish kerak |
| --- | --- | --- | --- |
| Supabase (Frankfurt, Germaniya) | Hamma server ma'lumoti | Xosting, Auth | Jurnal va zaxira muddati |
| Google (Gmail SMTP) | Email manzil, xat matni | Tasdiqlash va parol tiklash xatlari | DPF ro'yxatida ekani (LX04, 2-band) |
| Google (OAuth) | Faqat Google bilan kirganda: ism, email, rasm havolasi Tayanch'ga keladi | Kirish | - |
| inPAY, Click, Payme | Summa, buyurtma raqami; karta ma'lumotini ular o'zi oladi | To'lov | Ularning saqlash muddati va joyi |
| GitHub Pages | So'rov texnik ma'lumoti (IP va h.k.) | Statik sayt | GitHub hujjati |

## Brauzer

Ro'yxat: `src/data/brauzerKalitlari.ts` ("Saqlash va cookie" sahifalari shu fayldan chiqadi). Cookie yo'q (`document.cookie` src ichida ishlatilmaydi, 2026-11-11). Eksportga `tayanch:` va `tayanch-` kalitlari kiradi, sessiya kalitlari (`tayanch:auth`, `tayanch:auth-…`) kirmaydi.

## Amallar

- **Eksport**: profil → "Ma'lumotlarimni yuklab olish (JSON)" → Edge Function `hisob-malumot` `{amal: "eksport"}` (service role, faqat o'z `user_id`) + brauzer kalitlari. Fayl `tayanch-malumotlarim-YYYY-MM-DD.json`, format `tayanch-malumot/1`.
- **O'chirish**: profil → "Hisobni o'chirish" → parol (email hisob) yoki Google bilan qayta kirish (faqat Google hisob, 9 daqiqadan eski bo'lsa) → emailni yozish → `hisob-malumot` `{amal: "ochirish", tasdiq}`. Server tekshiradi: token (`auth.getUser`), email mosligi, JWT `amr` vaqti 10 daqiqadan yangi, tugallanmagan (`created`/`pending`) to'lov yo'q. Keyin `audit_log` ga yozuv va `auth.admin.deleteUser` (cascade).

## Muallif va yuristdan kutilayotgan javoblar

`src/data/huquqiySahifalar.ts` dagi `huquqiyOchiq`: sotuvchi rekvizitlari, aloqa emaili, qaytarish muddati, 18 yoshgacha to'lov qoidasi, to'lov yozuvlarini saqlash muddati. Qiymat berilsa sahifalar o'zi yangilanadi.
