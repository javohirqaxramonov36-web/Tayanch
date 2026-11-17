# 003. Desmos kalkulyatori (P29)

- **Holat**: qabul qilingan (muallif "A: faqat havola" variantini tanladi, 2026-11-11). Kod: branch `sat-desmos`.
- **Manba**: DS02, Desmos API Terms of Service (Version 1.0, July 11, 2025), https://www.desmos.com/api-terms, 2026-11-11 da brauzerda o'qildi (sahifa JavaScript bilan yuklanadi). Narxlar: https://www.desmos.com/my-api (o'sha kuni).
- **Bog'liq**: P35 (`/uz/sat/qollanma/math-desmos/`), P23 (Maxfiylik siyosati).

## Shartlar xulosasi

| Band | Mazmun | Tayanch uchun |
| --- | --- | --- |
| §2a Trial | Bepul faqat shaxsiy notijorat foydalanish yoki tijoriy foydalanishdan oldingi 90 kunlik ichki sinov. Foydalanuvchilar ishlatadigan production ilova tijoriy hisoblanadi. | Ochiq sayt va Pro tarifi bor: tijoriy. Bepul Trial mos emas. |
| §3a Commercial | Tijoriy foydalanishdan oldin pullik reja yoki partnerships@desmos.com bilan Commercial Addendum. | my-api sahifasida: Personal bepul, Starter $100/oy (yiliga 5 000 tagacha foydalanuvchi), Enterprise kelishiladi. |
| §5c Kalit | API kaliti maxfiy saqlanadi. | Hujjatda kalit `<script src="...calculator.js?apiKey=...">` ichida: statik saytda u hammaga ko'rinadi. "Ochiq" kalit turi hujjatda yo'q. Domen cheklovi bormi: tekshirish kerak. |
| §5b-iii, §6b Brending | Desmos brendingini olib tashlash yoki yashirish mumkin emas. Desmos belgisini marketingda yozma ruxsatsiz ishlatish mumkin emas. | Havolada faqat "Desmos" nomi, tavsif sifatida. Reklamada ishlatilmaydi. |
| §5d Yangilanish | Yangi versiyani 60 kun ichida qo'yish shart. | API ishlatilmagani uchun bu shart bizga tegishli emas. |

## Qaror

- Desmos API (embed) **ishlatilmaydi**. Tashqi skript yo'q, kalit yo'q, Desmos holati saqlanmaydi.
- Math savollarida rasmiy `https://www.desmos.com/calculator` ga matnli havola qo'yiladi, u yangi tabda ochiladi (`rel="noopener"`). Komponent: `src/components/sat/DesmosHavola.astro`. Joylar:
  - Mashq testi (`/uz/sat/mashq/test/`): faqat `bolim === 'Math'` savolda.
  - Mashq sessiyasi (`/uz/sat/mashq/sessiya/`, P08): faqat savol ekranida va `section === 'math'` savolda.
- Dars grafiklari o'zimizning SVG grafigimizda qoladi (`/uz/sat/qollanma/math/grafik/`).
- **P23 (Maxfiylik):** hozir yangilash shart emas, chunki havola uchinchi tomon skriptini yuklamaydi. Agar keyinroq Desmos embed qo'shilsa (pullik reja bilan), skriptni saytga qo'shishdan **oldin** Maxfiylik sahifasi yangilanadi. Bundan tashqari §5c (maxfiy kalit) talabini statik saytda qanday bajarish Desmos bilan kelishiladi.

## Muqobillar (tanlanmadi)

- **Desmos embed, pullik Starter**: $100/oy, kalit maxfiyligi statik saytda hal bo'lmaydi, brauzerda tashqi skript ishlaydi (P23).
- **O'z grafik paneli** (siljitiladigan/yig'iladigan): ish katta. Imtihondagi Desmos'ga o'rgatmaydi. Kerak bo'lsa alohida spetsifikatsiya va alohida PR.

## P35 uchun asos (`/uz/sat/qollanma/math-desmos/`)

- Manbalar: CB26 (Bluebook Testing Tools: SAT'da Desmos kalkulyatori bor), DS01 (Desmos Graphing Calculator).
- Hali tekshirilmagan: imtihonda va Bluebook practice testlarida qaysi Desmos rejimlari (graphing, scientific) borligi. Rasmiy CB manbasi topilmaguncha sahifada yozilmaydi.
- Mazmun g'oyasi: Desmos'da qachon foydalanish kerak (tenglamalar sistemasi, kesishish nuqtasi, regressiya), qachon qo'lda tezroq bo'ladi. Misollar faqat original, "Namuna" belgisi bilan. College Board savollari ishlatilmaydi.

## Sinov

PR tavsifida.
