# 4-qavat IELTS prep

IELTS prep — to'rt ko'nikma qavati: Reading, Listening, Writing, Speaking. Uning tili **tungi ilova**: qorong'i navy sahna, shisha panellar, bitta elektr ko'k nur va markazda yoritilgan obyekt (quloqchin, kitob). Ekran ilovadek tuzilgan: plitkalar, chiplar, raqamli kataklar, rasmli ro'yxat.

Ilhom (muallif tanladi, 2026-11-17): tuzilma va material muallif yuborgan tungi shisha avtomobil ilovasidan (ref/8: nurli obyekt ostida halqa, ikonka plitkalari, ko'rsatkich kataklari, filtr chiplari, eskizli ro'yxat). Rang ham shu rasmdan: navy fon va elektr ko'k (muallif magenta o'rniga ko'kni tanladi, 2026-11-17). OpenArt moodboard (ref/9) kompozitsiya uchun qoldi, rangi endi ishlatilmaydi. Tasvir va matn ko'chirilmagan.

## Palitra

- Qorong'i mavzu asosiy: fon `ielts-night` (`#0B1530`), matn `ielts-text`. Yorug' mavzu "tong": fon `ielts-dawn`, matn `ielts-ink`. Ikkalasi `ielts-bg` / `ielts-text` orqali.
- Urg'u faqat bitta: `ielts-accent` elektr ko'k fill (asosiy tugma, faol chip, belgi doirasi, faol plitka chegarasi). Ustida doim `ielts-on-accent` oq (5.5 / 4.7:1).
- Oddiy o'lchamdagi ko'k matn va ikonka `ielts-accent-text`; katta sarlavha urg'usi va katta raqam `ielts-accent-display` (24px+).
- Shisha: `ielts-glass` (qisqa matn, plitka, hero), `ielts-glass-strong` (ro'yxat, matnli panel, test, forma), chet `ielts-glass-border`, ikonka katagi `ielts-tile`.
- Halqa va nur `ielts-halo`, orqa fon dog'lari `floor-ielts-glow`. Ikkalasi faqat bezak.
- Belgi rangi o'zgardi: `floor-ielts-500` endi elektr ko'k `#2760DE` (Lift, bino). Oldingi qizil `#EF4841` 2-qavat to'q sarig'i bilan 1.18 edi. SAT ham navy shisha va ko'k nur (`floor-sat-500` `#2F86FF`, farq 1.57). Muallif qarori (2026-11-18): ikkalasi ko'k qoladi; IELTS SAT'dan Lexend sarlavhasi, nurli obyekt va halqa motivi hamda qavat raqami bilan ajraladi. Lift va binoda rang doim raqam bilan.

## Tipografiya

- Sarlavha va raqam: Lexend 600 (`ielts` oilasi), oddiy harflar, katta harf emas. Lexend o'qish qulayligi uchun yaratilgan shrift, shuning uchun "o'qish qavati"ga mos; SAT'ning Sora'sidan keng va yumshoqroq. Uslublar `ielts-hero`, `ielts-h2`, `ielts-raqam`.
- Birlik va yorliq `ielts-birlik` (Onest 500), matn poydevordagi `body`.
- Raqamlar `tabular-nums`. Raqam katakda markazda, ro'yxatda o'ngda.
- Lexend'da `ʻ` (U+02BB) va `ʼ` (U+02BC) bor: brauzerda kenglik o'lchovi bilan tekshirildi (2026-11-18).

## Tuzilma

- **Hero** (`IeltsHero`): tik shisha panel, markazda tekislangan matn, yoritilgan obyekt va halqa, ostida ustma-ust kapsula tugmalar.
- **Plitkalar** (`IeltsKonikma`): to'rt ko'nikma kvadrat plitkalari, ikonka ko'k, faoli ko'k chegara.
- **Ko'rsatkich** (`IeltsKorsatkich`): 3–4 katak, katta raqam va birlik.
- **Ro'yxat** (`IeltsRoyxat`): chiplar + zich shishali qatorlar, chapda 64px eskiz, o'ngda raqam.
- Radius: panel `radius-xl`, plitka va qator `radius-lg`, katak `radius-md`, chip va tugma `radius-full`. Ajratish shisha va nur bilan, qattiq soya yo'q.
- Tugma, maydon, tab, almashtirgich poydevordan; 4-qavatda nur ko'k (`data-floor="4"`).

## Qilinmaydi

- Ikkinchi urg'u rangi (qizil, to'q sariq, yashil, binafsha).
- Ko'k fill ustida qora matn yoki kichik o'lchamdagi `ielts-accent` / `ielts-accent-display` matn.
- Halqani har kartaga qo'yish: ekranda bitta, faqat hero yoki asosiy obyekt ostida.
- Uzun matn, test yoki forma shaffof `ielts-glass` da.
- Manbasiz raqam (savol soni, vaqt, band): faqat rasmiy manba bilan yoki "Namuna" belgisi bilan.
- Odam yuzi bor foto, IELTS rasmiy logotipi yoki materiali.

## Saytga o'tkazish (keyingi bosqich)

- `tokens.css`: `--color-floor-ielts-*` shkalasini elektr ko'kka o'zgartirish, `ielts-*` tokenlarini qo'shish; Lift va bino kontrastini qayta tekshirish.
- `/uz/ielts/` kirish sahifasi hero va plitkalarga, `/uz/ielts/mashq/` ro'yxat va chiplarga, Reading test natijasi ko'rsatkich kataklariga o'tadi.
- Lexend shriftini sayt shrift yuklashiga qo'shish.
