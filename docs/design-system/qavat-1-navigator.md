# 1-qavat Navigator

Navigator — binoning kirish qavati. U yo'l ko'rsatadi: maqsadni aniqlash, qavat tanlash, keyingi qadam. Shuning uchun tilida **raqam, yo'l va yorliq** asosiy o'rinda. Katta raqamlar qadamni bildiradi, vertikal chiziq yo'lni, mono yorliqlar esa aniq ma'lumotni beradi.

Ilhom (muallif tanladi, 2026-11-17): tuzilma qora timeline posteridan (katta 01–06, tugunli vertikal chiziq, burchakli ramkalar), ranglar qora-oq-laym ijtimoiy post to'plamidan. Ikkalasidan faqat g'oya olingan, tasvir va matn ko'chirilmagan.

## Palitra

- Ikki asosiy blok: **qora sahna** `nav-stage` va **oq qog'oz** `nav-paper`. Sahifada ular katta bloklar sifatida navbatma-navbat keladi. Ikkalasi ham mavzudan qat'i nazar o'zgarmaydi.
- `nav-cream` uchinchi, iliq blok: maslahat, izoh, "nima uchun" paneli. Har ekranda ko'pi bilan bitta.
- Sahifa foni `nav-bg`: yorug' mavzuda qog'oz, qorong'ida sahna. Oddiy kartalar `nav-surface` ustida `nav-text`.
- Urg'u faqat bitta: `nav-lime`. U joriy qadam tuguni, faol raqam va chip fonida ishlatiladi. Laym **faqat qora sahna ustida** (10:1) yoki fill sifatida, ustida `nav-on-lime` matni bilan. Yorug' fonda laym chiziq yoki matn bo'lmaydi (1.5:1): u yerda `nav-lime-text`.
- Qora sahna ustida matn `nav-on-stage`, ikkinchi matn `nav-on-stage-muted`, chiziq `nav-line-on-stage`.
- Yorug' fonda ma'noli chiziq (yo'l, kelgusi tugun, ramka burchagi) `nav-line-strong`, bezak chizig'i `nav-line`.
- CTA Navigator'da ham poydevordagi kapsula `.t-tugma`, ostida laym nur (`floor-navigator-glow`). Qora sahnada u ayniqsa yaxshi ko'rinadi.

## Tipografiya

- Raqam: `nav-raqam` (Barlow Condensed 700, 96px, telefonda 72px), har doim ikki xonali: 01, 02 … 05.
- Qadam nomi: `nav-sarlavha`, katta harflar bilan, raqam ostida.
- Hero: `nav-hero`, katta harflar, ko'pi bilan uch qator.
- Yorliq: `nav-yorliq` (JetBrains Mono), katta harflar, `·` bilan ajratiladi: "1-QADAM · 3 SAVOL".
- Ramka ichidagi ro'yxat: `nav-kod`, sarlavhasi `//` bilan.
- Oddiy matn poydevordagi `body` (Onest).
- Tutuq belgisi (2026-11-18, brauzerda tekshirildi): Barlow Condensed'da `ʻ` va `ʼ` bor. JetBrains Mono'da `ʻ` yo'q, u zaxira shriftdan chiqadi; muallif qarori bilan shrift qoladi. Shuning uchun mono yorliq qisqa (bir-ikki so'z) va asosiy ma'no Onest matnida takrorlanadi.

## Tuzilma

- **Yo'l** (`NavYol`): chapda vertikal chiziq, har qadamda tugun, yonida katta raqam va nom, o'ngda ramkali karta. Telefonda karta raqam ostiga tushadi.
- **Tugun holatlari**: bajarilgan (laym fill, ichida belgi), joriy (kattaroq laym fill va laym halqa), keyingi (bo'sh doira, `nav-line-strong` chegara). Holat rang bilan yolg'iz aytilmaydi: yorliqda "BAJARILDI", "HOZIR", "KEYIN" so'zi bor.
- **Ramka** (`NavRamka`): burchaklarda 12px qavslar, to'liq chegara yo'q, radius `radius-none`.
- Bloklar orasi `space-12`, blok ichi `space-16` (desktop), `space-6` (telefon). Qora/oq bloklarda `radius-lg`.
- Soya yo'q. Ajratish rang bloki bilan.

## Qilinmaydi

- Laymni yorug' fonda matn yoki ingichka chiziq qilish.
- Ikkinchi urg'u rangi qo'shish (to'q sariq, ko'k va boshqalar).
- Raqamlarni ketma-ketlik bo'lmagan joyda ishlatish: raqam faqat haqiqiy tartibni bildiradi.
- Ramka burchaklarini dekorativ maqsadda har kartaga qo'yish: faqat yo'l yonidagi ma'lumot kartasida.
- Navigator tokenlarini boshqa qavat sahifasida ishlatish.

## Saytga o'tkazish (keyingi bosqich)

- `tokens.css`: `--color-floor-navigator-*` shkalasini laymga o'zgartirish, `nav-*` tokenlarini qo'shish.
- Lift va bosh sahifadagi bino 1-qavat rangini oladi: avtomatik o'zgaradi, kontrast qayta tekshiriladi.
- `/uz/` sahifa foni `nav-bg`, "Mening yo'lim" bloki `NavYol` ga o'tadi.
- `DESIGN.md` dagi "besh qavat bir xil ko'rinadi" qoidasi bino qoidasi bilan almashtiriladi.
