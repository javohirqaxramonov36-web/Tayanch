# Homepage redesign

Branch `homepage-redesign`, asos `origin/main`, 2026-11-21. Faqat lokal commitlar. Muallifning besh qismni to'xtamasdan bajarish topshirig'i interaktiv spetsifikatsiyaga ham ruxsat sifatida qabul qilindi.

## 1-qism — tugadi

### Kod xaritasi

- Umumiy header va yon panel `src/components/BolimYon.astro`, `Menyu.astro` uni o'raydi. `Asosiy.astro`, `BolimQobiq.astro`, `IeltsFokus.astro` foydalanadi.
- Bosh sahifa, hero va eski kartalar `src/pages/uz/index.astro`. Bino `Bino.astro`. Qavat dropdownlari `navigator/QavatMenyu.astro`.
- Muddatlar `DeadlineRoyxati.astro`, ma'lumot `src/data/deadline.ts`, manbalar `manbalar.ts`. Mazmun va sanalar saqlanadi.
- Google login `src/lib/hisob.ts` (`googleBilanKirish`, PKCE), `hisob/GoogleTugma.astro`, `/uz/hisob/callback/`, `/uz/hisob/rozilik/`. Email/parol sahifalari saqlanadi.
- Mavzu `BolimYon.astro`, boshlang'ich sinxron skript `BoshQism.astro`, kalit `tayanch:mavzu`. Hisob `tayanch:auth`.
- inPAY `src/lib/sat/tolov.ts`, `supabase/functions/tolov-yaratish/`, kirish `/uz/sat/hisob/obuna/`. So'rov faqat plan_code va period yuboradi, summa serverda.
- Boshlanish yo'llari `/uz/top-admission/`, `/uz/sat/`, `/uz/ielts/`, `/uz/eyuf/`, `/uz/ai-academy/`. IQ `/uz/eyuf/iq/`.
- Mavjud uch qadamli Navigator `src/lib/navigator/boshqaruv.ts`, `navigator/YolXaritasi.astro`, saqlash `tayanch:navigator-yol:v1`. Bosh sahifadagi popup olib tashlanadi, alohida chooser yo'liga ko'chiriladi. Eski saqlangan progress o'chirilmaydi.

### Haqiqiy bepul va Pro

- Top Admission kursi, grantlar va qo'llanmalar ochiq. SAT interaktiv Math/R&W darslari va lokal xato daftari ochiq. IELTS Reading va darslar ochiq. EYUF IQ ochiq. Bularning kartalari `free=true`.
- AI Academy `src/data/aiAcademy.ts` da yagona kurs `tez-orada`, `bepulDarslar=null`. `free=false`, ochiq kurs va'dasi qo'shilmaydi.
- `20261111090000_tariflar_p19.sql` Pro narxi 59000, davri 30 kun. `docs/tarif-qoidalari.md` ham shu qiymat. Amaldagi narxlar `plans` bazasidan olinadi. Max faol emas. Homepage faqat Bepul va Pro ko'rsatadi.
- `docs/tarif-qoidalari.md` va `20261111120000_analitika.sql` Pro uchun `analytics_extended` beradi. Free va Pro savol/sessiya/so'z/reja/mock limitlari kalit yo'q bo'lganda cheklovsiz.
- AI Tutor barcha tariflarda kalitlar yo'q bo'lsa yopiq. Free 3/30 va Pro 30/300 hujjatda faqat taklif, amaldagi limit emas. Reklamada ishlatilmaydi.
- IELTS Writing bepul hisob uchun kunlik limit `ai_settings.ielts_writing_daily` dan, SAT Pro bilan bog'lanmagan. Haqiqiy qiymatni tasdiqlamasdan marketing soni kiritilmaydi.
- Jonli bazaning hozirgi qiymatlari o'qilmadi. Homepage narx/Pro afzalliklari ommaviy `plans` so'rovi bilan olinadi, sozlanmagan holatda ko'rinadigan placeholder ishlatiladi.

### Dizayn qarorlari va ochiq masalalar

- Promptdagi “Manrope already used” kodga mos emas. Mavjud self-hosted Onest va DS tokenlari saqlanadi. Yangi UI uchun yetishmayotgan tokenlar qo'shiladi.
- Telegram bot username berilmagan. Sozlashgacha login tugmasi aniq placeholder bilan o'chiq.
- EYUF fayllari boshqa chatda band, bu ish ularni tahrirlamaydi. Faqat mavjud IQ yo'liga havola beradi.

## Xatti-harakat spetsifikatsiyasi

1. Desktop bitta pill nav, route bo'yicha faol band, bir vaqtda bitta dropdown.
2. Dropdownlar button, aria-expanded, Tab va yo'nalish tugmalari, Escape va tashqariga bosish bilan yopiladi.
3. Mobil hamburger oltita bandni va kengayadigan subhavolalarni ochadi, mavzu tugmasi shu menyuda.
4. Til tanlovi faqat o'zbekcha, English va Русский o'chiq va Tez orada bilan.
5. Login dialog yopiq/ochiq/band/xato holatlari, native modal fokus qamrovi va ochuvchiga fokus qaytishi.
6. Google mavjud PKCE orqali, Telegram serverda tekshirilib Supabase sessiyasiga aylanadi. Rozilik/yosh darvozasi saqlanadi.
7. Pro login talab qilsa dialog, keyin mavjud server checkout. Bekor qilish to'lov yaratmaydi.
8. Yangi parol/token saqlash yo'q. Mavjud `tayanch:auth`, `tayanch:mavzu`, `tayanch:sat-tolov` va qaytish kaliti ishlatiladi.
