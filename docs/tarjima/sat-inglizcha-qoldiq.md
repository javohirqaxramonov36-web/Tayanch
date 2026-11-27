# SAT: qolgan o'zbekcha matn (branch `sat-inglizcha-qoldiq`)

Muallif qarori (2026-11-27): SAT va IELTS bo'limlari to'liq inglizcha. Bu PR SAT'dagi qoldiqni yopadi.
Topish usuli: build qilingan `dist/uz/sat/**` HTML'idagi matn va `aria-label`/`title`/`placeholder` skaneri, SAT sahifalari yuklaydigan JS'dagi satrlar.
Boshqa qavatlar HTML'i o'zgarmaydi (tekshirilgan: faqat kirish oynasiga `data-xato-matn` va CB07 manba nomi).

Inglizcha matnni muallif tekshiradi.

## Ustki qator (har SAT sahifasi)

| Joy | Oldin | Keyin |
| --- | --- | --- |
| `<header lang>` | `uz` (ichidagi inglizcha matn ham `uz` deb belgilangan edi) | `en` (bo'lim tili) |
| Hisob tugmasi | Kirish | Sign in |
| Hisob tugmasi (kirgan) | Hisobim | My account |
| Til tugmasi | 🇺🇿 bayroq + UZ | globus + EN, `aria-label` "Language: English" |
| Til paneli | Oʻzbekcha (faol), English / Русский "Tez orada" | English (faol), Oʻzbekcha / Русский "Not available" |
| Menyu `aria-label` | Boʻlimlar | Sections |
| 1-qavat tabi / chipi | Bosh sahifa | Home |
| ▾ tugma `aria-label` | `<Qavat>: asosiy sahifalar` | `<Qavat>: main pages` |
| Boshqa qavat paneli havolasi | Boʻlimning hamma sahifalari → | All pages in this section → |

Boshqa qavatlar paneli ichidagi sahifa nomlari (Top Admission, IELTS, EYUF) o'zbekcha qoldi va `lang="uz"` bilan belgilangan: ular o'zbekcha sahifalarga olib boradi. IELTS ro'yxati IELTS tarjima seriyasida inglizchaga o'tadi.

## Kirish oynasi (SAT sahifalarida)

| Oldin | Keyin |
| --- | --- |
| Yopish | Close |
| Hisobingizga kiring | Sign in to your account |
| Progressingiz, deadlineʼlaringiz va test natijalaringiz saqlanadi. Google yoki email va parol orqali kiring. | Your progress, deadlines and test results are saved. Sign in with Google or with email and password. |
| Google orqali kirish | Continue with Google |
| yoki | or |
| Email va parol orqali kirish | Sign in with email and password |
| Davom etish orqali Foydalanish shartlari va Maxfiylik siyosatiga rozilik bildirasiz. | By continuing, you agree to the Terms of Use and the Privacy Policy. (havolalar `/uz/sat/huquqiy/shartlar/`, `/maxfiylik/`) |
| Kirishda xatolik. Qaytadan urinib ko'ring. | Sign-in failed. Please try again. |

Email va parol sahifasi (`/uz/hisob/kirish/`) 1-qavatda, o'zbekcha qoladi (muallif qarori 2026-11-09).

## Boshqa

| Joy | Oldin | Keyin |
| --- | --- | --- |
| `src/data/manbalar.ts` CB07 nomi | The SAT (SAT Suite bosh sahifasi) | The SAT (SAT Suite home page) |
| `/uz/sat/huquqiy/maxfiylik/` | "Foydalanish statistikasini ulashish" | xuddi shu, `<span lang="uz">` bilan (1-qavat hisob sahifasidagi o'zbekcha belgi nomi) |

## Ataylab o'zgarmagan
- Ovozli yordamchi (`Suhbatdosh`): "Or type a question in Uzbek", savol maydoni `lang="uz"` (yordamchi o'zbekcha gaplashadi).
- Lug'at kartalaridagi tarjima ("Uzbek:" yorlig'i) va R&W lug'at darsidagi ikki so'z (`lang="uz"`).
- `localStorage` kalit nomlari (`/huquqiy/saqlash/`) va forma `value` qiymatlari: kod.
