# 004. O'qituvchi guruhlari va o'quvchi roziligi (P34)

Sana: 2026-11-12. Holat: muallif tasdiqlagan (spetsifikatsiya va 3 ta qaror, "Ha, tavsiya bilan"). Huquqshunos fikri hali yo'q.

## Kontekst

O'quv markazi o'qituvchisi o'z o'quvchilarini guruhga yig'ib, SAT mashqidagi progressini ko'rishni xohlaydi. Bu keyin pul keltiradigan yo'nalish (guruh tarifi), lekin hozircha sotilmaydi. O'quvchi ma'lumoti shaxsga doir ma'lumot. 18 yoshgacha bo'lganlar uchun ota-ona roziligi kerak (HANDOFF §5 12-savol, LX02: O'RQ-547 21-modda).

## Qarorlar

1. **18 yoshgacha.** Guruhga qo'shilishda (va keyin ulashishni kengaytirishda) ota-ona yoki vasiyning to'liq ismi va "rozi" belgisi majburiy. Server `auth.users.raw_user_meta_data.age_group` aniq `adult` bo'lmasa o'quvchini 18 yoshgacha deb hisoblaydi (ehtiyot tomoni). **Huquqshunos fikri kelguncha sahifalar ommaga e'lon qilinmaydi** (sahifa `qoralama`, `noindex`, guruh tarifi hech kimga berilmagan).
2. **O'qituvchi nimani ko'radi.** O'quvchi o'zi yozgan ism va qo'shilgan sana: doim. Ixtiyoriy, standart holatda o'chiq: (a) umumiy natija: javoblar soni, aniqlik, oxirgi 7 kundagi javoblar, oxirgi mashq kuni; (b) SAT domenlari bo'yicha aniqlik. Faqat **qo'shilgan kundan keyingi** urinishlar sanaladi. Hech qachon: email, yosh, ota-ona ma'lumoti, alohida javoblar, xato daftari, rasmiy test ballari, to'lov.
3. **Kim guruh yarata oladi.** Faqat `group_licenses` dagi hisob. Muallif qo'lda beradi: `admin_grant_group_license(user, max_groups, max_members, days, reason, actor)` (faqat service_role, `audit_log` ga yoziladi). Narx belgilangach to'lov shu jadvalga yozadi.

### Nega `admin_grant_plan` emas

Tasdiqlangan tavsiyada "guruh tarifi `admin_grant_plan` bilan" deyilgan edi. Qurishda topildi: `private.current_plan()` foydalanuvchining eng yuqori faol obunasini oladi, shuning uchun `subscriptions` dagi "guruh" obunasi o'qituvchining o'z mashq kvotasi va imkoniyatlarini o'zgartirib yuborardi (masalan cheksiz kvota). Shu sabab alohida `group_licenses` jadvali. Qo'lda berish va audit qoidasi o'zgarmadi.

## Texnik tuzilma

Migratsiya `supabase/migrations/20261113100000_guruhlar_p34.sql`.

| Jadval | Mijoz huquqi | RLS |
| --- | --- | --- |
| `group_licenses` | SELECT | faqat o'ziniki |
| `groups` (`invite_code` 8 belgi, `teacher_name`, `archived_at`) | SELECT | faqat egasi |
| `group_members` (ism, ulashish belgilari, `consent_version`, `consent_at`, `guardian_name`, `guardian_consent_at`, `joined_at`) | SELECT | faqat o'quvchining o'zi |
| `private.group_code_attempts` | yo'q | REST orqali ko'rinmaydi |

Hamma yozish `security definer` RPC orqali: `group_create`, `group_rotate_code`, `group_archive`, `group_delete`, `group_remove_member`, `group_progress`, `group_teacher_overview` (o'qituvchi); `group_preview`, `group_join`, `group_my_memberships`, `group_update_sharing`, `group_leave` (o'quvchi). O'qituvchi `attempts` va boshqa o'quvchi jadvallarini to'g'ridan-to'g'ri o'qiy olmaydi: natijani faqat `group_progress` beradi (egasi, amaldagi litsenziya, arxivlanmagan guruh, rozilik berilgan qism).

- A'zolik qatori bor = o'quvchi guruhda. Chiqish, chiqarilish yoki guruh o'chishi qatorni o'chiradi: nusxa yoki tarix qolmaydi.
- Taklif kodi: `gen_random_uuid()` baytlaridan, 0/O va 1/I/L siz alifbo. Noto'g'ri kod urinishi soatiga 20 tagacha (`too_many_attempts`); 1 soatdan eski urinish yozuvlari keyingi tekshiruvda o'chiriladi. Arxivdagi yoki litsenziyasi tugagan guruh kodi "topilmadi" deb javob beradi.
- Limitlar (`max_groups` faqat arxivlanmaganlar, `max_members`) advisory lock bilan: parallel so'rov limitni chetlab o'tmaydi.
- Rozilik versiyasi: `GURUH_ROZILIK_VERSIYA` (`src/lib/sat/guruh.ts`). Rozilik ekrani matni o'zgarsa versiya ham o'zgaradi.

Sahifalar (inglizcha, `qoralama`): `/uz/sat/guruh/` (o'quvchi guruhlari va ulashish; litsenziya bo'lsa o'qituvchi bo'limi), `/uz/sat/guruh/qoshilish/` (`?kod=`). Eksport (`hisob-malumot`), `docs/maxfiylik-jadvali.md` va ikkala Maxfiylik sahifasi yangilangan.

## Sinov

`npm run db:tekshir` → `supabase/tests/guruh_test.sql` (G00–G12): anon yopiq; litsenziyasiz yaratish rad; limitlar; 18 yoshgacha ota-ona majburiy (kengaytirishda ham); o'qituvchi faqat rozilik berilgan qismni va faqat qo'shilgandan keyingi urinishlarni ko'radi; `attempts`, `group_members`, `profiles`, `practice_sessions` dan 0 qator; boshqa o'qituvchi hech narsa qila olmaydi; rozilik qaytarilsa yoki chiqilsa shu zahoti yopiladi; kod yangilash va urinish cheklovi; arxiv va litsenziya tugashi.

## Ochiq

- Huquqshunos: guruhdagi ota-ona roziligi shakli (ism + belgi) "elektron hujjat" talabiga yetarlimi (P23 bilan bir xil savol).
- `user_metadata.age_group` ni foydalanuvchi o'zi o'zgartira oladi (P23 da ham shunday). Ishonchli manba kerak bo'lsa, yosh guruhi `profiles` ga, faqat server yozadigan ustunga ko'chiriladi.
- Guruh tarifi narxi va limitlari: muallif.
- Jonli bazaga hali qo'llanmagan. Merge'dan keyin: `supabase db push --dry-run`, so'ng push va `loyiha_tekshir.sql`.
