# SAT matni inglizchaga: 2-PR (Math darslari)

Branch `sat-en-math`. Muallif tekshiradi. Faqat mavjud matn tarjima qilingan, yangi da'vo yo'q. To'g'ri javoblar (`togri`) va raqamlar o'zgarmagan.

## Yozuv qoidalari (muallif qarori, 2026-11-08)

- O'nli kasr nuqta bilan: `2,5` → `2.5` (`src/lib/sonYozuv.ts`, faqat SAT Math ishlatadi).
- Koordinata: `(x; y)` → `(x, y)`.
- Bo'lish belgisi: `120 : 5` → `120 ÷ 5`; formulada `Σx : n` → `Σx ÷ n`.
- Birlik: `sm`, `sm³` → `cm`, `cm³`.
- Atamalar: Math darslari → Math lessons, Math darsi → Math lesson, Vazifa → Task, Topildi → Found, Hali emas → Not yet, Maslahat → Hint, uch → vertex, chorak → quadrant, o'rtacha → mean, mediana → median, oraliq → range, standart og'ish → standard deviation, chetga ketgan qiymat → outlier.
- 3D sahna yozuvi (`src/lib/hajmSahna.ts`): `6 qatlam` → `6 layers` (1 bo'lsa `1 layer`).

## Savollar (`src/data/satDarslar/*.ts`)

Avtomatik jadval (eski va yangi fayl maydonma-maydon solishtirilgan; `togri` o'zgarmagani skript bilan tekshirilgan).

### hajm.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| hajm-1 | mavzu | Silindr hajmi | Volume of a cylinder |
| hajm-1 | matn | Silindrning radiusi 3, balandligi 5. Silindr hajmi nechaga teng? | A cylinder has a radius of 3 and a height of 5. What is the volume of the cylinder? |
| hajm-1 | xato B | r kvadratga oshirilmagan: π · 3 · 5 | r was not squared: π · 3 · 5 |
| hajm-1 | xato C | Radius o'rniga diametr olingan: π · 6² · 5 | The diameter was used instead of the radius: π · 6² · 5 |
| hajm-1 | xato D | Hajm o'rniga yon sirt yuzi hisoblangan: 2πrh | The lateral surface area was calculated instead of the volume: 2πrh |
| hajm-2 | mavzu | Konus hajmi | Volume of a cone |
| hajm-2 | matn | Konusning asos radiusi 6, balandligi 4. Konus hajmi nechaga teng? | A cone has a base radius of 6 and a height of 4. What is the volume of the cone? |
| hajm-2 | xato A | ⅓ ko'paytuvchi unutilgan: silindr hajmi hisoblangan | The ⅓ factor was forgotten: the volume of a cylinder was calculated |
| hajm-2 | xato C | r kvadratga oshirilmagan: ⅓ · π · 6 · 4 | r was not squared: ⅓ · π · 6 · 4 |
| hajm-2 | xato D | ⅓ o'rniga ½ olingan | ½ was used instead of ⅓ |
| hajm-3 | mavzu | Shar hajmi | Volume of a sphere |
| hajm-3 | matn | Sharning diametri 6. Shar hajmi nechaga teng? | A sphere has a diameter of 6. What is the volume of the sphere? |
| hajm-3 | xato A | Diametr radius deb olingan: ⁴⁄₃ · π · 6³ | The diameter was taken as the radius: ⁴⁄₃ · π · 6³ |
| hajm-3 | xato B | ⁴⁄₃ ko'paytuvchi unutilgan: π · 3³ | The ⁴⁄₃ factor was forgotten: π · 3³ |
| hajm-3 | xato D | r kub o'rniga kvadratga oshirilgan: ⁴⁄₃ · π · 3² | r was squared instead of cubed: ⁴⁄₃ · π · 3² |
| hajm-3 | yechim | Radius diametrning yarmi: r = 3. V = ⁴⁄₃πr³ = ⁴⁄₃ · π · 27 = 36π. | The radius is half the diameter: r = 3. V = ⁴⁄₃πr³ = ⁴⁄₃ · π · 27 = 36π. |
| hajm-4 | mavzu | To'g'ri burchakli prizma | Rectangular prism |
| hajm-4 | matn | To'g'ri burchakli prizmaning uzunligi 5, eni 4, hajmi 120. Balandligi nechaga teng? | A rectangular prism has a length of 5, a width of 4 and a volume of 120. What is its height? |
| hajm-4 | xato A | Faqat uzunlikka bo'lingan: 120 : 5 | Divided by the length only: 120 ÷ 5 |
| hajm-4 | xato B | Faqat enga bo'lingan: 120 : 4 | Divided by the width only: 120 ÷ 4 |
| hajm-4 | xato D | Bo'lish o'rniga ko'paytirilgan: 120 · 5 · 4 | Multiplied instead of dividing: 120 · 5 · 4 |
| hajm-4 | yechim | V = l · w · h, demak 120 = 5 · 4 · h = 20h. h = 120 : 20 = 6. Tekshirish: 5 · 4 · 6 = 120. | V = l · w · h, so 120 = 5 · 4 · h = 20h. h = 120 ÷ 20 = 6. Check: 5 · 4 · 6 = 120. |
| hajm-5 | mavzu | O'lcham o'zgarishi | Changing dimensions |
| hajm-5 | matn | Silindrning radiusi 2 marta oshirildi, balandligi esa 2 marta kamaytirildi. Hajmi necha marta o'zgaradi? | The radius of a cylinder is doubled, and its height is halved. How does its volume change? |
| hajm-5 | variant A | O'zgarmaydi | It does not change |
| hajm-5 | xato A | Radius kvadrati unutilgan: 2 · ½ = 1 | The square of the radius was forgotten: 2 · ½ = 1 |
| hajm-5 | variant B | 4 marta ortadi | It becomes 4 times as large |
| hajm-5 | xato B | Balandlikning kamayishi hisobga olinmagan | The smaller height was not taken into account |
| hajm-5 | variant C | 2 marta kamayadi | It becomes half as large |
| hajm-5 | xato C | Faqat balandlik o'zgarishi hisobga olingan | Only the change in height was taken into account |
| hajm-5 | variant D | 2 marta ortadi | It doubles |
| hajm-5 | yechim | Yangi hajm: π(2r)² · (h/2) = π · 4r² · h/2 = 2πr²h. Bu eski hajmdan 2 marta katta. | New volume: π(2r)² · (h/2) = π · 4r² · h/2 = 2πr²h. This is 2 times the old volume. |
| hajm-6 | mavzu | Silindr va konus | Cylinder and cone |
| hajm-6 | matn | Radiusi 3 sm, balandligi 10 sm bo'lgan silindr idish suvga to'la. Suv radiusi 3 sm, balandligi 10 sm bo'lgan konus idishlarga quyiladi. Nechta konus to'la bo'ladi? | A cylindrical container with a radius of 3 cm and a height of 10 cm is full of water. The water is poured into cone-shaped containers with a radius of 3 cm and a height of 10 cm. How many cones will be filled? |
| hajm-6 | xato A | Konus va silindr hajmi teng deb olingan | The cone and the cylinder were assumed to have equal volumes |
| hajm-6 | xato C | Nisbat teskari olingan | The ratio was inverted |
| hajm-6 | xato D | Konus formulasida ⅓ o'rniga ½ olingan | ½ was used instead of ⅓ in the cone formula |
| hajm-6 | yechim | Silindr: π · 9 · 10 = 90π sm³. Konus: ⅓ · π · 9 · 10 = 30π sm³. 90π : 30π = 3. | Cylinder: π · 9 · 10 = 90π cm³. Cone: ⅓ · π · 9 · 10 = 30π cm³. 90π ÷ 30π = 3. |

### grafik.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| grafik-1 | mavzu | To'g'ri chiziq | Straight line |
| grafik-1 | matn | y = 2x − 3 to'g'ri chizig'i y o'qini qaysi nuqtada kesadi? | At what point does the line y = 2x − 3 intersect the y-axis? |
| grafik-1 | variant A | (0; 3) | (0, 3) |
| grafik-1 | xato A | Ishora xatosi: b = −3 o'rniga 3 olingan | Sign error: 3 was used instead of b = −3 |
| grafik-1 | variant B | (0; −3) | (0, −3) |
| grafik-1 | variant C | (1,5; 0) | (1.5, 0) |
| grafik-1 | xato C | x o'qi bilan kesishish nuqtasi topilgan | The x-intercept was found instead |
| grafik-1 | variant D | (0; 2) | (0, 2) |
| grafik-1 | xato D | Burchak koeffitsienti m bilan adashtirilgan | Confused with the slope m |
| grafik-1 | yechim | y o'qida x = 0. y = 2 · 0 − 3 = −3. Nuqta: (0; −3). | On the y-axis, x = 0. y = 2 · 0 − 3 = −3. The point is (0, −3). |
| grafik-2 | mavzu | Ikki chiziq kesishishi | Intersection of two lines |
| grafik-2 | matn | y = 2x + 1 va y = −x + 7 to'g'ri chiziqlari qaysi nuqtada kesishadi? | At what point do the lines y = 2x + 1 and y = −x + 7 intersect? |
| grafik-2 | variant A | (5; 2) | (5, 2) |
| grafik-2 | xato A | x va y koordinatalari almashtirilgan | The x- and y-coordinates were swapped |
| grafik-2 | variant B | (6; 13) | (6, 13) |
| grafik-2 | xato B | Hadni o'tkazishda ishora xatosi: 2x − x = 6 | Sign error when moving a term: 2x − x = 6 |
| grafik-2 | variant C | (2; 5) | (2, 5) |
| grafik-2 | variant D | (−2; −3) | (−2, −3) |
| grafik-2 | xato D | Ishora xatosi: 3x = −6 olingan | Sign error: 3x = −6 was used |
| grafik-2 | yechim | 2x + 1 = −x + 7 → 3x = 6 → x = 2. y = 2 · 2 + 1 = 5. Tekshirish: −2 + 7 = 5. | 2x + 1 = −x + 7 → 3x = 6 → x = 2. y = 2 · 2 + 1 = 5. Check: −2 + 7 = 5. |
| grafik-3 | mavzu | Parabola: simmetriya o'qi | Parabola: axis of symmetry |
| grafik-3 | matn | f(x) = 2(x − 3)² − 8 parabolasining simmetriya o'qi qaysi? | What is the axis of symmetry of the parabola f(x) = 2(x − 3)² − 8? |
| grafik-3 | xato B | Ishora xatosi: (x − h) da h = 3, −3 emas | Sign error: in (x − h), h = 3, not −3 |
| grafik-3 | xato C | Uchning y koordinatasi bilan adashtirilgan | Confused with the vertex's y-coordinate |
| grafik-3 | xato D | h ni a ga ko'paytirilgan: 2 · 3 | h was multiplied by a: 2 · 3 |
| grafik-3 | yechim | a(x − h)² + k ko'rinishida uch (h; k) = (3; −8). Simmetriya o'qi uchdan o'tadi: x = 3. | In the form a(x − h)² + k, the vertex is (h, k) = (3, −8). The axis of symmetry passes through the vertex: x = 3. |
| grafik-4 | mavzu | Parabola: eng kichik qiymat | Parabola: minimum value |
| grafik-4 | matn | f(x) = x² − 6x + 5 funksiyasining eng kichik qiymati nechaga teng? | What is the minimum value of the function f(x) = x² − 6x + 5? |
| grafik-4 | xato A | Uchning x koordinatasi javob deb olingan | The vertex's x-coordinate was taken as the answer |
| grafik-4 | xato B | c (y o'qi bilan kesishish) bilan adashtirilgan | Confused with c (the y-intercept) |
| grafik-4 | xato C | Ishora xatosi: uch x = −3 deb olingan | Sign error: the vertex was taken as x = −3 |
| grafik-4 | yechim | Uch: x = −b / (2a) = 6 / 2 = 3. f(3) = 9 − 18 + 5 = −4. Boshqa usul: x² − 6x + 5 = (x − 3)² − 4, eng kichik qiymat −4. | Vertex: x = −b / (2a) = 6 / 2 = 3. f(3) = 9 − 18 + 5 = −4. Another way: x² − 6x + 5 = (x − 3)² − 4, so the minimum value is −4. |
| grafik-5 | mavzu | Tenglamalar sistemasi | System of equations |
| grafik-5 | matn | y = 3x + 2 va y = 3x − 4 tenglamalar sistemasi nechta yechimga ega? | How many solutions does the system of equations y = 3x + 2 and y = 3x − 4 have? |
| grafik-5 | variant A | Bitta | One |
| grafik-5 | xato A | Ikki to'g'ri chiziq doim kesishadi deb olingan | Assumed that two lines always intersect |
| grafik-5 | variant B | Yechimi yo'q | No solution |
| grafik-5 | variant C | Cheksiz ko'p | Infinitely many |
| grafik-5 | xato C | Qiyalik bir xil bo'lsa chiziq ham bir xil deb olingan | Assumed that lines with the same slope are the same line |
| grafik-5 | variant D | Ikkita | Two |
| grafik-5 | xato D | Ikki tenglama ikki yechim beradi deb olingan | Assumed that two equations give two solutions |
| grafik-5 | yechim | Qiyaliklari teng (3), y o'qidagi nuqtalari har xil (2 va −4): chiziqlar parallel, kesishmaydi. 3x + 2 = 3x − 4 → 2 = −4, bu noto'g'ri tenglik. | The slopes are equal (3), but the y-intercepts are different (2 and −4): the lines are parallel and never intersect. 3x + 2 = 3x − 4 → 2 = −4, which is false. |

### aylana.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| aylana-1 | mavzu | Gradus va radian | Degrees and radians |
| aylana-1 | matn | 150° radianda nechaga teng? | What is 150° in radians? |
| aylana-1 | xato A | 180 o'rniga 90 ga bo'lingan | Divided by 90 instead of 180 |
| aylana-1 | xato B | Kasr teskari olingan: 180/150 | The fraction was inverted: 180/150 |
| aylana-1 | xato D | π unutilgan | π was forgotten |
| aylana-1 | yechim | Radian = gradus · π/180. 150 · π/180 = 5π/6. Tekshirish: 5π/6 · 180/π = 150. | Radians = degrees · π/180. 150 · π/180 = 5π/6. Check: 5π/6 · 180/π = 150. |
| aylana-2 | mavzu | Maxsus burchaklar | Special angles |
| aylana-2 | matn | sin 30° nechaga teng? | What is sin 30°? |
| aylana-2 | xato B | sin va cos almashtirilgan: bu cos 30° | sin and cos were swapped: this is cos 30° |
| aylana-2 | xato C | 45° bilan adashtirilgan | Confused with 45° |
| aylana-2 | xato D | tan 30° bilan adashtirilgan | Confused with tan 30° |
| aylana-2 | yechim | 30° da birlik aylanadagi nuqta (√3/2; 1/2). sin y koordinata: 1/2. | At 30°, the point on the unit circle is (√3/2, 1/2). sin is the y-coordinate: 1/2. |
| aylana-3 | mavzu | Chorak va ishora | Quadrant and sign |
| aylana-3 | matn | cos(2π/3) nechaga teng? | What is cos(2π/3)? |
| aylana-3 | xato A | Chorak ishorasi hisobga olinmagan: II chorakda cos manfiy | The sign of the quadrant was ignored: cos is negative in quadrant II |
| aylana-3 | xato B | sin bilan adashtirilgan | Confused with sin |
| aylana-3 | variant D | ≈ 0,999 | ≈ 0.999 |
| aylana-3 | xato D | Kalkulyator gradus rejimida: cos(2,09°) hisoblangan | The calculator is in degree mode: cos(2.09°) was calculated |
| aylana-3 | yechim | 2π/3 = 120°. Nuqta (−1/2; √3/2), cos x koordinata: −1/2. II chorakda cos manfiy. | 2π/3 = 120°. The point is (−1/2, √3/2), and cos is the x-coordinate: −1/2. cos is negative in quadrant II. |
| aylana-4 | mavzu | To'ldiruvchi burchaklar | Complementary angles |
| aylana-4 | matn | 0° < x < 90° va sin x = cos 20° bo'lsa, x nechaga teng? | If 0° < x < 90° and sin x = cos 20°, what is x? |
| aylana-4 | xato A | sin va cos bir xil burchakda teng deb olingan | Assumed that sin and cos are equal at the same angle |
| aylana-4 | xato B | sin(180° − x) = sin x qoidasi bilan adashtirilgan | Confused with the rule sin(180° − x) = sin x |
| aylana-4 | xato C | 90 ga qo'shilgan | Added to 90 |
| aylana-4 | yechim | sin x = cos(90° − x). Demak 90 − x = 20, x = 70. Tekshirish: sin 70° ≈ 0,940 va cos 20° ≈ 0,940. | sin x = cos(90° − x). So 90 − x = 20, and x = 70. Check: sin 70° ≈ 0.940 and cos 20° ≈ 0.940. |
| aylana-5 | mavzu | Nuqtadan burchak | Angle from a point |
| aylana-5 | matn | Birlik aylanadagi P nuqta (−√3/2; 1/2). OP nuri x o'qining musbat yo'nalishi bilan qanday burchak hosil qiladi (0° dan 360° gacha)? | Point P on the unit circle is (−√3/2, 1/2). What angle does ray OP make with the positive x-axis (from 0° to 360°)? |
| aylana-5 | xato A | Chorak ishorasi hisobga olinmagan | The sign of the quadrant was ignored |
| aylana-5 | xato C | sin va cos almashtirilgan: 120° da nuqta (−1/2; √3/2) | sin and cos were swapped: at 120° the point is (−1/2, √3/2) |
| aylana-5 | xato D | y ishorasi xato: 210° da nuqta (−√3/2; −1/2) | Wrong sign of y: at 210° the point is (−√3/2, −1/2) |
| aylana-5 | yechim | cos = −√3/2 < 0, sin = 1/2 > 0: II chorak. Asosiy burchak 30°, II chorakda 180° − 30° = 150°. | cos = −√3/2 < 0 and sin = 1/2 > 0: quadrant II. The reference angle is 30°, so in quadrant II the angle is 180° − 30° = 150°. |

### statistika.ts

| id | Maydon | Oldin | Keyin |
| --- | --- | --- | --- |
| statistika-1 | mavzu | O'rtacha | Mean |
| statistika-1 | matn | 4, 7, 7, 9, 13 sonlarining o'rtachasi nechaga teng? | What is the mean of the numbers 4, 7, 7, 9, 13? |
| statistika-1 | xato A | Mediana bilan adashtirilgan | Confused with the median |
| statistika-1 | xato C | Oraliq (13 − 4) bilan adashtirilgan | Confused with the range (13 − 4) |
| statistika-1 | xato D | Sonlar soni 5 emas, 4 deb olingan: 40 : 4 | The count was taken as 4 instead of 5: 40 ÷ 4 |
| statistika-1 | yechim | Yig'indi: 4 + 7 + 7 + 9 + 13 = 40. O'rtacha: 40 : 5 = 8. | Sum: 4 + 7 + 7 + 9 + 13 = 40. Mean: 40 ÷ 5 = 8. |
| statistika-2 | mavzu | Mediana | Median |
| statistika-2 | matn | 3, 9, 4, 18, 6, 8 sonlarining medianasi nechaga teng? | What is the median of the numbers 3, 9, 4, 18, 6, 8? |
| statistika-2 | xato A | Ro'yxat saralanmasdan o'rtadagi ikki son olingan: 4 va 18 | The two middle numbers were taken without sorting the list: 4 and 18 |
| statistika-2 | xato B | O'rtacha bilan adashtirilgan | Confused with the mean |
| statistika-2 | xato C | Juft sonli ro'yxatda faqat bitta o'rta son olingan | Only one middle number was taken in a list with an even count |
| statistika-2 | yechim | Saralaymiz: 3, 4, 6, 8, 9, 18. Sonlar soni juft, o'rtadagi ikkitasi 6 va 8. Mediana (6 + 8) : 2 = 7. | Sort: 3, 4, 6, 8, 9, 18. The count is even, so the two middle numbers are 6 and 8. Median: (6 + 8) ÷ 2 = 7. |
| statistika-3 | mavzu | O'rtacha o'zgarishi | Change in the mean |
| statistika-3 | matn | 10 ta sonning o'rtachasi 12. Ro'yxatga 23 qo'shildi. Yangi o'rtacha nechaga teng? | The mean of 10 numbers is 12. The number 23 is added to the list. What is the new mean? |
| statistika-3 | variant B | 17,5 | 17.5 |
| statistika-3 | xato B | O'rtacha va yangi son o'rtachasi olingan: (12 + 23) : 2 | The mean of the old mean and the new number was taken: (12 + 23) ÷ 2 |
| statistika-3 | variant C | 14,3 | 14.3 |
| statistika-3 | xato C | Sonlar soni oshirilmagan: 143 : 10 | The count was not increased: 143 ÷ 10 |
| statistika-3 | xato D | Yangi son o'rtachani o'zgartirmaydi deb olingan | Assumed that the new number does not change the mean |
| statistika-3 | yechim | Eski yig'indi: 10 · 12 = 120. Yangi yig'indi: 120 + 23 = 143, sonlar soni 11. 143 : 11 = 13. | Old sum: 10 · 12 = 120. New sum: 120 + 23 = 143, and the count is 11. 143 ÷ 11 = 13. |
| statistika-4 | mavzu | Chetga ketgan qiymat | Outlier |
| statistika-4 | matn | 5, 6, 6, 7, 8 ro'yxatiga 40 qo'shildi. Quyidagilardan qaysi biri eng kam o'zgaradi? | The number 40 is added to the list 5, 6, 6, 7, 8. Which of the following changes the least? |
| statistika-4 | variant A | O'rtacha | Mean |
| statistika-4 | xato A | Chetga ketgan qiymat o'rtachani o'ziga tortishi unutilgan | Forgot that an outlier pulls the mean toward itself |
| statistika-4 | variant B | Oraliq | Range |
| statistika-4 | xato B | Oraliq eng katta qiymatga bog'liq: 3 dan 35 ga oshadi | The range depends on the largest value: it grows from 3 to 35 |
| statistika-4 | variant C | Mediana | Median |
| statistika-4 | variant D | Standart og'ish | Standard deviation |
| statistika-4 | xato D | Chetga ketgan qiymat tarqalishni keskin oshiradi | An outlier sharply increases the spread |
| statistika-4 | yechim | Mediana 6 dan 6,5 ga o'zgaradi. O'rtacha 6,4 dan 12 ga, oraliq 3 dan 35 ga ko'tariladi, standart og'ish ham keskin oshadi. | The median changes from 6 to 6.5. The mean rises from 6.4 to 12, the range from 3 to 35, and the standard deviation also increases sharply. |
| statistika-5 | mavzu | Standart og'ish | Standard deviation |
| statistika-5 | matn | A to'plam: 10, 10, 10, 10. B to'plam: 7, 9, 11, 13. Qaysi tasdiq to'g'ri? | Set A: 10, 10, 10, 10. Set B: 7, 9, 11, 13. Which statement is true? |
| statistika-5 | variant A | B ning o'rtachasi kattaroq | The mean of B is greater |
| statistika-5 | xato A | Katta sonlar bor deb o'rtacha ham katta deb olingan | Assumed that larger numbers mean a larger mean |
| statistika-5 | variant B | O'rtachalar teng, B ning standart og'ishi kattaroq | The means are equal, and the standard deviation of B is greater |
| statistika-5 | variant C | Standart og'ishlar teng, chunki o'rtachalar teng | The standard deviations are equal because the means are equal |
| statistika-5 | xato C | O'rtacha va tarqalish adashtirilgan | The mean and the spread were confused |
| statistika-5 | variant D | A ning standart og'ishi kattaroq | The standard deviation of A is greater |
| statistika-5 | xato D | Bir xil sonlar tarqalishni oshiradi deb olingan | Assumed that identical numbers increase the spread |
| statistika-5 | yechim | Ikkala o'rtacha 10. A da hamma son o'rtachaga teng: standart og'ish 0. B da sonlar 10 dan 1 va 3 ga uzoqlashgan: standart og'ish √5 ≈ 2,24. | Both means are 10. In A, every number equals the mean: the standard deviation is 0. In B, the numbers are 1 and 3 away from 10: the standard deviation is √5 ≈ 2.24. |


## Sahifalar (oldin `-`, keyin `+`)

Faqat matn qatorlari. Kod nomlari, URL va `localStorage` kalitlari o'zgarmagan.

### hajm

```diff
-  yolBandlari={['Math darslari']}
-  darsTuri="Math darsi"
+  yolBandlari={['Math lessons']}
+  darsTuri="Math lesson"
-  title="Hajm laboratoriyasi · SAT"
-  description="SAT Math: silindr, konus, shar va prizma hajmi 3D sahnada. Disklar animatsiyasi, formula, sinov va 6 ta mashq."
+  title="Volume lab · SAT"
+  description="SAT Math: the volume of a cylinder, cone, sphere and prism in a 3D scene. A disk animation, the formula, a try-it step and 6 exercises."
-  sarlavha="Hajm: asos yuzi marta balandlik"
-  lead="Silindrni yupqa disklardan yig'ib ko'ring: formula o'zi chiqadi. Keyin konus, shar va prizmada o'lchamlarni o'zgartirib, hajm qanday o'sishini kuzating."
+  sarlavha="Volume: base area times height"
+  lead="Build a cylinder from thin disks and the formula appears on its own. Then change the dimensions of a cone, a sphere and a prism and watch how the volume grows."
-    "Silindr hajmi nega πr²h ekanini disklar orqali tushuntira olasiz.",
-    "Konus, shar va prizma hajmini to'g'ri formula bilan hisoblaysiz.",
-    "Radius va diametrni, r² va r³ ni adashtirmaysiz.",
+    "You can explain with disks why the volume of a cylinder is πr²h.",
+    "You calculate the volume of a cone, a sphere and a prism with the right formula.",
+    "You do not confuse the radius with the diameter, or r² with r³.",
-    "Silindr va prizma: V = asos yuzi × balandlik. Silindrda asos yuzi πr².",
-    "Konus o'sha asos va balandlikdagi silindrning uchdan biri: V = ⅓πr²h.",
-    "Shar faqat radiusga bog'liq: V = ⁴⁄₃πr³. Radius 2 marta oshsa, hajm 8 marta oshadi.",
-    "Savolda diametr berilsa, avval uni 2 ga bo'ling.",
+    "Cylinder and prism: V = base area × height. For a cylinder, the base area is πr².",
+    "A cone is one third of the cylinder with the same base and height: V = ⅓πr²h.",
+    "A sphere depends only on the radius: V = ⁴⁄₃πr³. If the radius doubles, the volume becomes 8 times as large.",
+    "If a question gives the diameter, divide it by 2 first.",
-  keyingi={{ nomi: 'Funksiya grafigi', href: yol('/uz/sat/qollanma/math/grafik/') }}
+  keyingi={{ nomi: 'Function graphs', href: yol('/uz/sat/qollanma/math/grafik/') }}
-    "Mashq savollari Tayanch uchun yozilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "Imtihonda formulalar varag'i berilishi bu sahifada da'vo qilinmaydi: rasmiy manba hali jurnalga qo'shilmagan.",
+    'The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".',
+    'This page makes no claim about whether a formula sheet is provided in the test: an official source has not been added to the source log yet.',
-    <div class="sahna-quti hajm-quti" id="hajm-quti" tabindex="0" role="application" aria-roledescription="3D sahna" aria-label="Hajm sahnasi. Strelkalar bilan aylantiring, plyus va minus bilan yaqinlashtiring." aria-describedby="hajm-tavsif">
+    <div class="sahna-quti hajm-quti" id="hajm-quti" tabindex="0" role="application" aria-roledescription="3D scene" aria-label="Volume scene. Rotate with the arrow keys, zoom with plus and minus." aria-describedby="hajm-tavsif">
-      <p class="hajm-holat" id="hajm-holat">3D sahna yuklanmoqda…</p>
+      <p class="hajm-holat" id="hajm-holat">Loading the 3D scene…</p>
-      <button type="button" class="belgi-t" data-amal="chap" aria-label="Chapga aylantirish"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg></button>
-      <button type="button" class="belgi-t" data-amal="ong" aria-label="O'ngga aylantirish"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg></button>
-      <button type="button" class="belgi-t" data-amal="yaqin" aria-label="Yaqinlashtirish"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
-      <button type="button" class="belgi-t" data-amal="uzoq" aria-label="Uzoqlashtirish"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
-      <button type="button" class="kichik-tugma" data-amal="tikla">Kamerani tiklash</button>
+      <button type="button" class="belgi-t" data-amal="chap" aria-label="Rotate left"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg></button>
+      <button type="button" class="belgi-t" data-amal="ong" aria-label="Rotate right"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-3-6.7L21 8" /><path d="M21 3v5h-5" /></svg></button>
+      <button type="button" class="belgi-t" data-amal="yaqin" aria-label="Zoom in"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
+      <button type="button" class="belgi-t" data-amal="uzoq" aria-label="Zoom out"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button>
+      <button type="button" class="kichik-tugma" data-amal="tikla">Reset camera</button>
-    <p class="sahna-izoh">Sichqoncha bilan sudrang. Telefonda bir barmoqni yonga suring, ikki barmoq bilan yaqinlashtiring. Poldagi katak = 1 birlik.</p>
+    <p class="sahna-izoh">Drag with the mouse. On a phone, swipe sideways with one finger and pinch with two fingers to zoom. One floor square = 1 unit.</p>
-    <p>Silindrni qalinligi 1 bo'lgan bir xil disklardan yig'amiz. Har disk hajmi: asos yuzi × qalinlik = πr² × 1. Nechta disk bo'lsa, hajm shuncha marta πr².</p>
+    <p>We build the cylinder from identical disks with a thickness of 1. The volume of each disk is base area × thickness = πr² × 1. The volume is πr² times the number of disks.</p>
-      <button type="button" class="katta asosiy" id="disk-boshla">Disklarni yig'ish</button>
-      <button type="button" class="kichik-tugma" id="disk-tikla">Butun silindr</button>
+      <button type="button" class="katta asosiy" id="disk-boshla">Stack the disks</button>
+      <button type="button" class="kichik-tugma" id="disk-tikla">Whole cylinder</button>
-      <span class="f-qiymat" id="disk-matn" aria-live="polite">r = 3, h = 6 bo'lgan silindr: tugmani bosing.</span>
+      <span class="f-qiymat" id="disk-matn" aria-live="polite">A cylinder with r = 3, h = 6: press the button.</span>
-    <p class="kichik ikkinchi">r va h ni "Sinab ko'r" qadamida o'zgartirish mumkin.</p>
+    <p class="kichik ikkinchi">You can change r and h in the "Try it" step.</p>
-      <span class="kichik ikkinchi" id="f-nomi">Silindr</span>
+      <span class="kichik ikkinchi" id="f-nomi">Cylinder</span>
-      <div><dt>Silindr</dt><dd>πr²h</dd></div>
-      <div><dt>Konus</dt><dd>⅓πr²h</dd></div>
-      <div><dt>Shar</dt><dd>⁴⁄₃πr³</dd></div>
-      <div><dt>Prizma</dt><dd>l · w · h</dd></div>
+      <div><dt>Cylinder</dt><dd>πr²h</dd></div>
+      <div><dt>Cone</dt><dd>⅓πr²h</dd></div>
+      <div><dt>Sphere</dt><dd>⁴⁄₃πr³</dd></div>
+      <div><dt>Prism</dt><dd>l · w · h</dd></div>
-      <div class="segment" role="group" aria-label="Shakl">
-        <button type="button" data-shakl="silindr" aria-pressed="true">Silindr</button>
-        <button type="button" data-shakl="konus" aria-pressed="false">Konus</button>
-        <button type="button" data-shakl="shar" aria-pressed="false">Shar</button>
-        <button type="button" data-shakl="prizma" aria-pressed="false">Prizma</button>
+      <div class="segment" role="group" aria-label="Shape">
+        <button type="button" data-shakl="silindr" aria-pressed="true">Cylinder</button>
+        <button type="button" data-shakl="konus" aria-pressed="false">Cone</button>
+        <button type="button" data-shakl="shar" aria-pressed="false">Sphere</button>
+        <button type="button" data-shakl="prizma" aria-pressed="false">Prism</button>
-      <p><b>Vazifa.</b> Hajmi 48π bo'lgan silindrni toping: r va h ni tanlang.</p>
-      <p class="vazifa-holat" id="vazifa-holat" aria-live="polite">Hali topilmadi.</p>
+      <p><b>Task.</b> Find a cylinder with a volume of 48π: choose r and h.</p>
+      <p class="vazifa-holat" id="vazifa-holat" aria-live="polite">Not found yet.</p>
-    if (shakl === 'silindr') return { nomi: 'Silindr', asosiy: 'V = πr²h', qiymat: `V = π · ${r}² · ${h} = ${piKasr(r * r * h, 1)} ≈ ${son(Math.PI * r * r * h)}`, izoh: 'Asos yuzi (πr²) × balandlik.' };
-    if (shakl === 'konus') return { nomi: 'Konus', asosiy: 'V = ⅓πr²h', qiymat: `V = ⅓ · π · ${r}² · ${h} = ${piKasr(r * r * h, 3)} ≈ ${son(Math.PI * r * r * h / 3)}`, izoh: "Xuddi shu r va h dagi silindrning uchdan biri." };
-    if (shakl === 'shar') return { nomi: 'Shar', asosiy: 'V = ⁴⁄₃πr³', qiymat: `V = ⁴⁄₃ · π · ${r}³ = ${piKasr(4 * r * r * r, 3)} ≈ ${son(4 * Math.PI * r ** 3 / 3)}`, izoh: "Faqat radiusga bog'liq: r ikki marta oshsa, hajm 8 marta oshadi." };
-    return { nomi: "To'g'ri burchakli prizma", asosiy: 'V = l · w · h', qiymat: `V = ${l} · ${w} · ${h} = ${l * w * h}`, izoh: "Poldagi kataklar soni (l · w) × qatlamlar soni (h)." };
+    if (shakl === 'silindr') return { nomi: 'Cylinder', asosiy: 'V = πr²h', qiymat: `V = π · ${r}² · ${h} = ${piKasr(r * r * h, 1)} ≈ ${son(Math.PI * r * r * h)}`, izoh: 'Base area (πr²) × height.' };
+    if (shakl === 'konus') return { nomi: 'Cone', asosiy: 'V = ⅓πr²h', qiymat: `V = ⅓ · π · ${r}² · ${h} = ${piKasr(r * r * h, 3)} ≈ ${son(Math.PI * r * r * h / 3)}`, izoh: "One third of the cylinder with the same r and h." };
+    if (shakl === 'shar') return { nomi: 'Sphere', asosiy: 'V = ⁴⁄₃πr³', qiymat: `V = ⁴⁄₃ · π · ${r}³ = ${piKasr(4 * r * r * r, 3)} ≈ ${son(4 * Math.PI * r ** 3 / 3)}`, izoh: "Depends only on the radius: if r doubles, the volume becomes 8 times as large." };
+    return { nomi: 'Rectangular prism', asosiy: 'V = l · w · h', qiymat: `V = ${l} · ${w} · ${h} = ${l * w * h}`, izoh: "Number of floor squares (l · w) × number of layers (h)." };
-    v.textContent = topildi ? `Topildi: r = ${holat.r}, h = ${holat.h}. Tekshirish: ${holat.r}² · ${holat.h} = 48.` : 'Hali topilmadi. Maslahat: r² · h = 48 bo\'lishi kerak.';
+    v.textContent = topildi ? `Found: r = ${holat.r}, h = ${holat.h}. Check: ${holat.r}² · ${holat.h} = 48.` : 'Not found yet. Hint: r² · h must equal 48.';
-      ? `${n}-disk: hajm = ${n} · π · ${r}² = ${piKasr(n * r * r, 1)}`
-      : `${h} ta disk: V = ${h} · π · ${r}² = ${piKasr(h * r * r, 1)}. Bu πr²h.`;
+      ? `Disk ${n}: volume = ${n} · π · ${r}² = ${piKasr(n * r * r, 1)}`
+      : `${h} disks: V = ${h} · π · ${r}² = ${piKasr(h * r * r, 1)}. This is πr²h.`;
-  $('disk-tikla').addEventListener('click', () => { diskniToxtat(); holat.disklar = null; $('disk-matn').textContent = 'Butun silindr ko\'rsatilmoqda.'; yangila(); });
+  $('disk-tikla').addEventListener('click', () => { diskniToxtat(); holat.disklar = null; $('disk-matn').textContent = 'Showing the whole cylinder.'; yangila(); });
-      $('hajm-holat').textContent = "3D sahnani ochib bo'lmadi (brauzer WebGL'ni qo'llamaydi yoki o'chirilgan). Formula va mashqlar ishlayveradi.";
+      $('hajm-holat').textContent = "The 3D scene could not be opened (the browser does not support WebGL or it is turned off). The formula and exercises still work.";
```

### grafik

```diff
-  yolBandlari={['Math darslari']}
-  darsTuri="Math darsi"
+  yolBandlari={['Math lessons']}
+  darsTuri="Math lesson"
-  title="Funksiya grafigi · SAT"
-  description="SAT Math: y = mx + b, parabolaning uch shakli, simmetriya o'qi va ikki tenglama kesishishi interaktiv grafikda. 5 ta mashq."
+  title="Function graphs · SAT"
+  description="SAT Math: y = mx + b, three forms of a parabola, the axis of symmetry and the intersection of two equations on an interactive graph. 5 exercises."
-  sarlavha="Grafik: tenglama nimani chizadi"
-  lead="Har bir son grafikda biror narsani boshqaradi: m qiyalikni, b chiziq qayerdan o'tishini, h va k parabola uchini. Slayderni suring yoki nuqtani sudrang, tenglama shu zahoti o'zgaradi."
+  sarlavha="Graphs: what an equation draws"
+  lead="Every number controls something on the graph: m controls the slope, b where the line crosses, h and k the vertex of the parabola. Move a slider or drag a point, and the equation changes right away."
-    "y = mx + b dagi m va b ni grafikdan o'qiy olasiz.",
-    "Parabolaning uch shaklidan uchni, simmetriya o'qini va ildizlarni topasiz.",
-    "Ikki tenglama kesishishini, yechimi yo'q va cheksiz ko'p holatlarni ajratasiz.",
+    "You can read m and b in y = mx + b from a graph.",
+    "You find the vertex, the axis of symmetry and the roots from the three forms of a parabola.",
+    "You tell apart an intersection of two equations, no solution and infinitely many solutions.",
-    "y = mx + b: m qiyalik (x 1 ga oshganda y qancha o'zgaradi), b y o'qini kesish nuqtasi (0; b).",
-    "a(x − h)² + k: uch (h; k), simmetriya o'qi x = h. a > 0 bo'lsa yuqoriga, a < 0 bo'lsa pastga ochiladi.",
-    "ax² + bx + c da uch x = −b / (2a), y o'qini kesish nuqtasi (0; c).",
-    "Qiyaliklar teng, b har xil: chiziqlar parallel, yechim yo'q. Qiyalik ham, b ham teng: bir xil chiziq, cheksiz ko'p yechim.",
+    "y = mx + b: m is the slope (how much y changes when x increases by 1), and b gives the y-intercept (0, b).",
+    "a(x − h)² + k: the vertex is (h, k), and the axis of symmetry is x = h. If a > 0 it opens upward, if a < 0 it opens downward.",
+    "In ax² + bx + c, the vertex is at x = −b / (2a), and the y-intercept is (0, c).",
+    "Equal slopes, different b: the lines are parallel and there is no solution. Equal slopes and equal b: the same line, infinitely many solutions.",
-  keyingi={{ nomi: 'Birlik aylana', href: yol('/uz/sat/qollanma/math/birlik-aylana/') }}
-  tekshirilmagan={["Mashq savollari Tayanch uchun yozilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan."]}
+  keyingi={{ nomi: 'Unit circle', href: yol('/uz/sat/qollanma/math/birlik-aylana/') }}
+  tekshirilmagan={['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".']}
-    <div class="segment rejim-tanlov" role="group" aria-label="Grafik turi">
-      <button type="button" data-rejim="chiziq" aria-pressed="true">To'g'ri chiziq</button>
+    <div class="segment rejim-tanlov" role="group" aria-label="Graph type">
+      <button type="button" data-rejim="chiziq" aria-pressed="true">Straight line</button>
-      <button type="button" data-rejim="kesishish" aria-pressed="false">Kesishish</button>
+      <button type="button" data-rejim="kesishish" aria-pressed="false">Intersection</button>
-      <button type="button" class="katta asosiy" id="anim-boshla">Ko'rsatish</button>
+      <button type="button" class="katta asosiy" id="anim-boshla">Show</button>
-    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Tugmani bosing.</span></div>
+    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Press the button.</span></div>
-      belgi(h.ph, h.pk, `uch ${nuqta(h.ph, h.pk)}`);
+      belgi(h.ph, h.pk, `vertex ${nuqta(h.ph, h.pk)}`);
-    if (d < 0) ildiz = "Haqiqiy ildiz yo'q: ko'paytuvchilarga ajralmaydi";
+    if (d < 0) ildiz = 'No real roots: it does not factor';
-      ildiz = `y = ${koef(a)}${kop(Math.round(p * 100) / 100)}${kop(Math.round(q * 100) / 100)}${aniq ? '' : ' (taqriban)'}`;
+      ildiz = `y = ${koef(a)}${kop(Math.round(p * 100) / 100)}${kop(Math.round(q * 100) / 100)}${aniq ? '' : ' (approximately)'}`;
-    if (h.rejim === 'chiziq') return `To'g'ri chiziq ${chiziqTenglama(h.m, h.b)}. Qiyalik ${son(h.m)}, y o'qini ${nuqta(0, h.b)} da kesadi.`;
-    if (h.rejim === 'parabola') { const s = parabolaShakllari(); return `Parabola ${s.uch}. Uch ${nuqta(h.ph, h.pk)}, simmetriya o'qi x = ${son(h.ph)}.`; }
-    return `${chiziqTenglama(h.m1, h.b1)} va ${chiziqTenglama(h.m2, h.b2)}. ${kesishishMatni()}`;
+    if (h.rejim === 'chiziq') return `Straight line ${chiziqTenglama(h.m, h.b)}. Slope ${son(h.m)}, crosses the y-axis at ${nuqta(0, h.b)}.`;
+    if (h.rejim === 'parabola') { const s = parabolaShakllari(); return `Parabola ${s.uch}. Vertex ${nuqta(h.ph, h.pk)}, axis of symmetry x = ${son(h.ph)}.`; }
+    return `${chiziqTenglama(h.m1, h.b1)} and ${chiziqTenglama(h.m2, h.b2)}. ${kesishishMatni()}`;
-    if (h.m1 === h.m2) return h.b1 === h.b2 ? "Bir xil chiziq: cheksiz ko'p yechim." : "Qiyaliklar teng, chiziqlar parallel: yechim yo'q.";
+    if (h.m1 === h.m2) return h.b1 === h.b2 ? 'The same line: infinitely many solutions.' : 'Equal slopes, the lines are parallel: no solution.';
-    return `Kesishish nuqtasi ${nuqta(x, h.m1 * x + h.b1)}.`;
+    return `Intersection point ${nuqta(x, h.m1 * x + h.b1)}.`;
-      $('grafik-izoh').textContent = "Ko'k nuqtani yuqori-pastga sudrang: b o'zgaradi. Ikkinchi nuqta qiyalikni o'zgartiradi. Kulrang zinapoya: x 1 ga oshganda y m ga o'zgaradi.";
-      karta([['kichik ikkinchi', "To'g'ri chiziq"], ['f-asosiy', 'y = mx + b'], ['f-qiymat', chiziqTenglama(h.m, h.b)], ['kichik ikkinchi', 'm: qiyalik, b: y o\'qini kesish nuqtasi (0; b).']]);
-      qiymatlar([['Qiyalik m', son(h.m)], ["y o'qi bilan", nuqta(0, h.b)], ["x o'qi bilan", h.m === 0 ? (h.b === 0 ? 'butun o\'q' : "yo'q") : nuqta(-h.b / h.m, 0)]]);
-      $('vazifa-matn').innerHTML = "<b>Vazifa.</b> Qiyaligi 2 bo'lgan va (2; 7) nuqtadan o'tadigan chiziqni hosil qiling.";
+      $('grafik-izoh').textContent = 'Drag the blue point up and down: b changes. The second point changes the slope. The gray step: when x increases by 1, y changes by m.';
+      karta([['kichik ikkinchi', 'Straight line'], ['f-asosiy', 'y = mx + b'], ['f-qiymat', chiziqTenglama(h.m, h.b)], ['kichik ikkinchi', 'm: slope, b: y-intercept (0, b).']]);
+      qiymatlar([['Slope m', son(h.m)], ['y-intercept', nuqta(0, h.b)], ['x-intercept', h.m === 0 ? (h.b === 0 ? 'the whole axis' : 'none') : nuqta(-h.b / h.m, 0)]]);
+      $('vazifa-matn').innerHTML = '<b>Task.</b> Make a line with a slope of 2 that passes through the point (2, 7).';
-      v.textContent = ok ? "Topildi: y = 2x + 3. Tekshirish: 2 · 2 + 3 = 7." : "Hali emas. Maslahat: 7 = 2 · 2 + b.";
+      v.textContent = ok ? 'Found: y = 2x + 3. Check: 2 · 2 + 3 = 7.' : 'Not yet. Hint: 7 = 2 · 2 + b.';
-      $('grafik-izoh').textContent = "Uchni sudrang: h va k o'zgaradi. Uzuq chiziq: simmetriya o'qi x = h. a ni slayderda o'zgartiring.";
-      karta([['kichik ikkinchi', 'Uch shakli'], ['f-qiymat', s.uch], ['kichik ikkinchi', 'Standart shakl'], ['f-qiymat', s.standart], ['kichik ikkinchi', "Ko'paytuvchilar shakli"], ['f-qiymat', s.ildiz]]);
-      qiymatlar([['Uch', nuqta(h.ph, h.pk)], ["Simmetriya o'qi", `x = ${son(h.ph)}`], ["y o'qi bilan", nuqta(0, s.C)], ['Ochilishi', h.a > 0 ? 'yuqoriga' : 'pastga']]);
-      $('vazifa-matn').innerHTML = "<b>Vazifa.</b> Uchi (−2; 1) bo'lgan va pastga ochiladigan parabolani hosil qiling.";
+      $('grafik-izoh').textContent = 'Drag the vertex: h and k change. The dashed line is the axis of symmetry x = h. Change a with the slider.';
+      karta([['kichik ikkinchi', 'Vertex form'], ['f-qiymat', s.uch], ['kichik ikkinchi', 'Standard form'], ['f-qiymat', s.standart], ['kichik ikkinchi', 'Factored form'], ['f-qiymat', s.ildiz]]);
+      qiymatlar([['Vertex', nuqta(h.ph, h.pk)], ['Axis of symmetry', `x = ${son(h.ph)}`], ['y-intercept', nuqta(0, s.C)], ['Opens', h.a > 0 ? 'upward' : 'downward']]);
+      $('vazifa-matn').innerHTML = '<b>Task.</b> Make a parabola with its vertex at (−2, 1) that opens downward.';
-      v.textContent = ok ? `Topildi: ${s.uch}.` : "Hali emas. Maslahat: uch (h; k), pastga ochilishi uchun a < 0.";
+      v.textContent = ok ? `Found: ${s.uch}.` : 'Not yet. Hint: the vertex is (h, k), and a < 0 makes it open downward.';
-      $('grafik-izoh').textContent = "Ikkala chiziqning y o'qidagi nuqtasini sudrang. Ko'k chiziq birinchi, qora uzuq chiziq ikkinchi tenglama.";
-      karta([['kichik ikkinchi', 'Tenglamalar sistemasi'], ['f-qiymat', chiziqTenglama(h.m1, h.b1)], ['f-qiymat', chiziqTenglama(h.m2, h.b2)], ['f-asosiy', h.m1 !== h.m2 ? 'x = (b₂ − b₁) / (m₁ − m₂)' : 'm₁ = m₂'], ['kichik ikkinchi', kesishishMatni()]]);
-      qiymatlar([['Yechimlar soni', h.m1 !== h.m2 ? '1' : h.b1 === h.b2 ? "cheksiz ko'p" : "yo'q"], ['Kesishish', h.m1 !== h.m2 ? nuqta((h.b2 - h.b1) / (h.m1 - h.m2), h.m1 * (h.b2 - h.b1) / (h.m1 - h.m2) + h.b1) : '—']]);
-      $('vazifa-matn').innerHTML = "<b>Vazifa.</b> Ikki chiziq (1; 4) nuqtada kesishsin.";
+      $('grafik-izoh').textContent = 'Drag the point where each line crosses the y-axis. The blue line is the first equation, the black dashed line the second.';
+      karta([['kichik ikkinchi', 'System of equations'], ['f-qiymat', chiziqTenglama(h.m1, h.b1)], ['f-qiymat', chiziqTenglama(h.m2, h.b2)], ['f-asosiy', h.m1 !== h.m2 ? 'x = (b₂ − b₁) / (m₁ − m₂)' : 'm₁ = m₂'], ['kichik ikkinchi', kesishishMatni()]]);
+      qiymatlar([['Number of solutions', h.m1 !== h.m2 ? '1' : h.b1 === h.b2 ? 'infinitely many' : 'none'], ['Intersection', h.m1 !== h.m2 ? nuqta((h.b2 - h.b1) / (h.m1 - h.m2), h.m1 * (h.b2 - h.b1) / (h.m1 - h.m2) + h.b1) : '—']]);
+      $('vazifa-matn').innerHTML = '<b>Task.</b> Make the two lines intersect at the point (1, 4).';
-      v.textContent = ok ? "Topildi: ikkala chiziq x = 1 da y = 4 beradi." : "Hali emas. Maslahat: har bir chiziq uchun m + b = 4 bo'lsin, qiyaliklar har xil.";
+      v.textContent = ok ? 'Found: both lines give y = 4 at x = 1.' : 'Not yet. Hint: make m + b = 4 for each line, with different slopes.';
-    chiziq: { matn: "b o'zgarmaydi, m −3 dan 3 gacha o'sadi: chiziq (0; b) atrofida aylanadi. m > 0 da chiziq ko'tariladi, m < 0 da tushadi, m = 0 da gorizontal.", kalit: 'm', qiymatlar: [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3] },
-    parabola: { matn: "a va k o'zgarmaydi, h −4 dan 4 gacha suriladi: parabola va uning simmetriya o'qi birga yonga siljiydi, shakli o'zgarmaydi.", kalit: 'ph', qiymatlar: [-4, -3, -2, -1, 0, 1, 2, 3, 4] },
-    kesishish: { matn: "Ikkinchi chiziqning qiyaligi birinchisinikiga yaqinlashadi: kesishish nuqtasi uzoqlashadi, qiyaliklar tenglashganda chiziqlar parallel bo'lib, yechim yo'qoladi.", kalit: 'm2', qiymatlar: [-2, -1, 0, 1, 1.5, 2] },
+    chiziq: { matn: 'b stays the same while m grows from −3 to 3: the line turns around (0, b). When m > 0 the line rises, when m < 0 it falls, and when m = 0 it is horizontal.', kalit: 'm', qiymatlar: [-3, -2, -1, -0.5, 0, 0.5, 1, 2, 3] },
+    parabola: { matn: 'a and k stay the same while h moves from −4 to 4: the parabola and its axis of symmetry shift sideways together, and the shape does not change.', kalit: 'ph', qiymatlar: [-4, -3, -2, -1, 0, 1, 2, 3, 4] },
+    kesishish: { matn: 'The slope of the second line approaches the slope of the first: the intersection point moves away, and when the slopes become equal the lines are parallel and the solution disappears.', kalit: 'm2', qiymatlar: [-2, -1, 0, 1, 1.5, 2] },
-      $('anim-boshla').textContent = 'Keyingi holat';
+      $('anim-boshla').textContent = 'Next state';
-    clearInterval(animT); animQadam = 0; $('anim-boshla').textContent = kamaytir ? 'Keyingi holat' : "Ko'rsatish";
+    clearInterval(animT); animQadam = 0; $('anim-boshla').textContent = kamaytir ? 'Next state' : 'Show';
```

### birlik-aylana

```diff
-  yolBandlari={['Math darslari']}
-  darsTuri="Math darsi"
+  yolBandlari={['Math lessons']}
+  darsTuri="Math lesson"
-  title="Birlik aylana · SAT"
-  description="SAT Math: birlik aylanada burchakni sudrab sin, cos va tan qiymatlarini ko'ring, gradus va radianni almashtiring. 5 ta mashq."
+  title="Unit circle · SAT"
+  description="SAT Math: drag the angle on the unit circle to see the sin, cos and tan values, and switch between degrees and radians. 5 exercises."
-  sarlavha="Birlik aylana: sin va cos nuqtaning koordinatasi"
-  lead="Radiusi 1 bo'lgan aylanada burchak bitta nuqtani belgilaydi. Shu nuqtaning x koordinatasi cos, y koordinatasi sin. Nuqtani sudrang va qiymatlar qanday o'zgarishini kuzating."
+  sarlavha="Unit circle: sin and cos are the coordinates of a point"
+  lead="On a circle with a radius of 1, an angle marks a single point. The x-coordinate of that point is cos, and the y-coordinate is sin. Drag the point and watch how the values change."
-    "Gradusni radianga va radianni gradusga o'tkazasiz.",
-    "30°, 45°, 60° va ularga mos burchaklarning sin va cos qiymatlarini topasiz.",
-    "Chorakka qarab ishorani aniqlaysiz, sin x = cos(90° − x) qoidasini qo'llaysiz.",
+    "You convert degrees to radians and radians to degrees.",
+    "You find the sin and cos values of 30°, 45°, 60° and their related angles.",
+    "You determine the sign from the quadrant and apply the rule sin x = cos(90° − x).",
-    "Birlik aylanadagi nuqta (cos θ; sin θ). tan θ = sin θ / cos θ, cos θ = 0 bo'lsa aniqlanmagan.",
-    "Radian = gradus · π/180. 180° = π, 90° = π/2.",
-    "I chorakda hammasi musbat, II da faqat sin, III da faqat tan, IV da faqat cos.",
-    "sin x = cos(90° − x): to'ldiruvchi burchaklarning sin va cos qiymatlari almashadi.",
-    "Kalkulyatorda radian bilan ishlasangiz, radian rejimini tekshiring.",
+    "The point on the unit circle is (cos θ, sin θ). tan θ = sin θ / cos θ, undefined when cos θ = 0.",
+    "Radians = degrees · π/180. 180° = π, 90° = π/2.",
+    "In quadrant I all are positive, in II only sin, in III only tan, in IV only cos.",
+    "sin x = cos(90° − x): complementary angles swap their sin and cos values.",
+    "If you work in radians on a calculator, check that it is in radian mode.",
-  keyingi={{ nomi: 'Statistika', href: yol('/uz/sat/qollanma/math/statistika/') }}
-  tekshirilmagan={["Mashq savollari Tayanch uchun yozilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan."]}
+  keyingi={{ nomi: 'Statistics', href: yol('/uz/sat/qollanma/math/statistika/') }}
+  tekshirilmagan={['The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".']}
-    <p class="sahna-izoh">Ko'k nuqtani aylana bo'ylab sudrang. Ko'k kesma: cos (x), qora kesma: sin (y).</p>
+    <p class="sahna-izoh">Drag the blue point along the circle. Blue segment: cos (x), black segment: sin (y).</p>
-    <p>Nuqta aylana bo'ylab 0° dan 360° gacha yuradi. Ko'k kesma (cos) va qora kesma (sin) uzunligi o'zgaradi, chorak almashganda ishorasi ham almashadi.</p>
-    <div class="segment"><button type="button" class="katta asosiy" id="anim-boshla">Aylantirish</button></div>
-    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Tugmani bosing.</span></div>
+    <p>The point moves along the circle from 0° to 360°. The lengths of the blue segment (cos) and the black segment (sin) change, and their signs change when the quadrant changes.</p>
+    <div class="segment"><button type="button" class="katta asosiy" id="anim-boshla">Rotate</button></div>
+    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Press the button.</span></div>
-      <span class="f-asosiy">P = (cos θ; sin θ)</span>
+      <span class="f-asosiy">P = (cos θ, sin θ)</span>
-      <span class="f-qiymat">radian = gradus · π/180</span>
+      <span class="f-qiymat">radians = degrees · π/180</span>
-      <div><dt>30° = π/6</dt><dd>(√3/2; 1/2)</dd></div>
-      <div><dt>45° = π/4</dt><dd>(√2/2; √2/2)</dd></div>
-      <div><dt>60° = π/3</dt><dd>(1/2; √3/2)</dd></div>
+      <div><dt>30° = π/6</dt><dd>(√3/2, 1/2)</dd></div>
+      <div><dt>45° = π/4</dt><dd>(√2/2, √2/2)</dd></div>
+      <div><dt>60° = π/3</dt><dd>(1/2, √3/2)</dd></div>
-      <div class="segment" role="group" aria-label="Burchak birligi">
-        <button type="button" data-birlik="gradus" aria-pressed="true">Gradus</button>
-        <button type="button" data-birlik="radian" aria-pressed="false">Radian</button>
+      <div class="segment" role="group" aria-label="Angle unit">
+        <button type="button" data-birlik="gradus" aria-pressed="true">Degrees</button>
+        <button type="button" data-birlik="radian" aria-pressed="false">Radians</button>
-      <div class="segment" role="group" aria-label="Maxsus burchaklar">
+      <div class="segment" role="group" aria-label="Special angles">
-      <p><b>Vazifa.</b> cos manfiy, sin musbat va tan = −1 bo'ladigan burchakni toping.</p>
+      <p><b>Task.</b> Find the angle where cos is negative, sin is positive and tan = −1.</p>
-  const chorakNomi = (g: number) => (g % 90 === 0 ? "o'qda" : ['I chorak', 'II chorak', 'III chorak', 'IV chorak'][Math.floor(g / 90)]);
+  const chorakNomi = (g: number) => (g % 90 === 0 ? 'on an axis' : ['quadrant I', 'quadrant II', 'quadrant III', 'quadrant IV'][Math.floor(g / 90)]);
-    if (tanYoq) tanM = 'aniqlanmagan';
+    if (tanYoq) tanM = 'undefined';
-    yozuv.textContent = `(${q.cosM}; ${q.sinM})`;
+    yozuv.textContent = `(${q.cosM}, ${q.sinM})`;
-    ([['Burchak', `${theta}° = ${radian(theta)}`], ['Chorak', chorakNomi(theta)], ['cos θ (x)', q.cosM], ['sin θ (y)', q.sinM], ['tan θ', q.tanM]] as [string, string][])
+    ([['Angle', `${theta}° = ${radian(theta)}`], ['Quadrant', chorakNomi(theta)], ['cos θ (x)', q.cosM], ['sin θ (y)', q.sinM], ['tan θ', q.tanM]] as [string, string][])
-    vh.textContent = ok ? "Topildi: 135°. II chorakda cos < 0, sin > 0, va |sin| = |cos|, demak tan = −1." : "Hali emas. Maslahat: qaysi chorakda cos manfiy, sin musbat? tan = −1 uchun |sin| = |cos|.";
-    elon(`Burchak ${theta} gradus, ${radian(theta)} radian. cos ${q.cosM}, sin ${q.sinM}, tan ${q.tanM}.`);
+    vh.textContent = ok ? 'Found: 135°. In quadrant II, cos < 0 and sin > 0, and |sin| = |cos|, so tan = −1.' : 'Not yet. Hint: in which quadrant is cos negative and sin positive? For tan = −1, |sin| = |cos|.';
+    elon(`Angle ${theta} degrees, ${radian(theta)} radians. cos ${q.cosM}, sin ${q.sinM}, tan ${q.tanM}.`);
-      $('anim-boshla').textContent = 'Keyingi burchak';
+      $('anim-boshla').textContent = 'Next angle';
```

### statistika

```diff
-  yolBandlari={['Math darslari']}
-  darsTuri="Math darsi"
+  yolBandlari={['Math lessons']}
+  darsTuri="Math lesson"
-  title="Statistika · SAT"
-  description="SAT Math: nuqtalarni sudrab o'rtacha, mediana, standart og'ish va oraliq qanday o'zgarishini ko'ring. 5 ta mashq."
+  title="Statistics · SAT"
+  description="SAT Math: drag the points to see how the mean, median, standard deviation and range change. 5 exercises."
-  sarlavha="Statistika: o'rtacha qochadi, mediana turadi"
-  lead="Nuqtalar son o'qida turibdi. Bittasini uzoqqa sudrang: o'rtacha unga ergashadi, mediana deyarli joyida qoladi. Standart og'ish esa nuqtalar qanchalik tarqalganini ko'rsatadi."
+  sarlavha="Statistics: the mean runs, the median stays"
+  lead="The points sit on a number line. Drag one of them far away: the mean follows it, while the median stays almost where it was. The standard deviation shows how spread out the points are."
-    "O'rtacha, mediana va oraliqni ro'yxatdan tez hisoblaysiz.",
-    "Chetga ketgan qiymat qaysi ko'rsatkichni ko'proq o'zgartirishini ayta olasiz.",
-    "Standart og'ishni hisoblamasdan, ikki to'plamni tarqalishi bo'yicha solishtirasiz.",
+    "You quickly calculate the mean, median and range of a list.",
+    "You can tell which measure an outlier changes the most.",
+    "You compare the spread of two data sets without calculating the standard deviation.",
-    "O'rtacha = yig'indi : sonlar soni. Bitta katta qiymat uni o'ziga tortadi.",
-    "Mediana: saralangan ro'yxatning o'rtasi; sonlar soni juft bo'lsa, o'rtadagi ikki sonning o'rtachasi.",
-    "Oraliq = eng katta − eng kichik. Chetga ketgan qiymat oraliqni darhol o'zgartiradi.",
-    "Standart og'ish: qiymatlar o'rtachadan o'rtacha qanchalik uzoq. Hamma qiymat teng bo'lsa, 0.",
+    "Mean = sum ÷ count. A single large value pulls it toward itself.",
+    "Median: the middle of the sorted list; if the count is even, the mean of the two middle numbers.",
+    "Range = largest − smallest. An outlier changes the range right away.",
+    "Standard deviation: how far the values are from the mean on average. If all values are equal, it is 0.",
-  keyingi={{ nomi: 'Reja tuzgich', href: yol('/uz/sat/vosita/reja/') }}
+  keyingi={{ nomi: 'Study planner', href: yol('/uz/sat/vosita/reja/') }}
-    "Mashq savollari Tayanch uchun yozilgan; muallif tekshirmaganlari \"tekshirilmagan\" deb belgilangan.",
-    "Standart og'ish populatsiya formulasi bilan (n ga bo'linadi). SAT'da qaysi ta'rif ishlatilishi bu sahifada da'vo qilinmaydi.",
+    'The exercise questions were written for Tayanch; those not yet reviewed by the author are marked "not verified".',
+    "Standard deviation uses the population formula (divided by n). This page makes no claim about which definition the SAT uses.",
-      <p class="stat-namuna"><span class="pill">Namuna ma'lumot</span></p>
+      <p class="stat-namuna"><span class="pill">Sample data</span></p>
-      <button type="button" class="kichik-tugma" id="s-chetga">Chetga ketgan nuqta</button>
-      <button type="button" class="kichik-tugma" id="s-qosh">Nuqta qo'shish</button>
-      <button type="button" class="kichik-tugma" id="s-ayir">Nuqta olib tashlash</button>
-      <button type="button" class="kichik-tugma" id="s-tikla">Namunani tiklash</button>
+      <button type="button" class="kichik-tugma" id="s-chetga">Outlier point</button>
+      <button type="button" class="kichik-tugma" id="s-qosh">Add a point</button>
+      <button type="button" class="kichik-tugma" id="s-ayir">Remove a point</button>
+      <button type="button" class="kichik-tugma" id="s-tikla">Reset the sample</button>
-    <p class="sahna-izoh">Nuqtani sudrang yoki Tab bilan tanlab, strelkalar bilan suring. Ko'k chiziq va uchburchak: o'rtacha. Qora uzuq chiziq va romb: mediana. Uzuq chegarali kulrang soha: o'rtacha ± standart og'ish.</p>
+    <p class="sahna-izoh">Drag a point, or select it with Tab and move it with the arrow keys. Blue line and triangle: mean. Black dashed line and diamond: median. Gray area with dashed edges: mean ± standard deviation.</p>
-    <p>Eng katta nuqta asta-sekin 20 gacha suriladi. Kuzating: o'rtacha (ko'k) unga ergashadi, mediana (qora) joyida qoladi, kulrang soha kengayadi.</p>
-    <div class="segment"><button type="button" class="katta asosiy" id="anim-boshla">Ko'rsatish</button></div>
-    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Tugmani bosing.</span></div>
+    <p>The largest point slowly moves to 20. Watch: the mean (blue) follows it, the median (black) stays in place, and the gray area widens.</p>
+    <div class="segment"><button type="button" class="katta asosiy" id="anim-boshla">Show</button></div>
+    <div class="formula"><span class="f-qiymat" id="anim-holat" aria-live="polite">Press the button.</span></div>
-      <span class="kichik ikkinchi">O'rtacha</span><span class="f-asosiy">x̄ = Σx : n</span><span class="f-qiymat" id="f-ortacha"></span>
-      <span class="kichik ikkinchi">Mediana</span><span class="f-qiymat" id="f-mediana"></span>
-      <span class="kichik ikkinchi">Standart og'ish (populatsiya, n ga bo'linadi)</span><span class="f-asosiy">σ = √( Σ(x − x̄)² : n )</span><span class="f-qiymat" id="f-sigma"></span>
+      <span class="kichik ikkinchi">Mean</span><span class="f-asosiy">x̄ = Σx ÷ n</span><span class="f-qiymat" id="f-ortacha"></span>
+      <span class="kichik ikkinchi">Median</span><span class="f-qiymat" id="f-mediana"></span>
+      <span class="kichik ikkinchi">Standard deviation (population, divided by n)</span><span class="f-asosiy">σ = √( Σ(x − x̄)² ÷ n )</span><span class="f-qiymat" id="f-sigma"></span>
-      <p><b>Vazifa.</b> 9 ta nuqta bilan medianani 8 da qoldirib, o'rtachani aynan 10 ga yetkazing.</p>
+      <p><b>Task.</b> With 9 points, keep the median at 8 and bring the mean to exactly 10.</p>
-      g.setAttribute('aria-label', `${i + 1}-nuqta`);
+      g.setAttribute('aria-label', `Point ${i + 1}`);
-    oy.textContent = `o'rtacha ${son(o)}`; my.textContent = `mediana ${son(m)}`;
+    oy.textContent = `mean ${son(o)}`; my.textContent = `median ${son(m)}`;
-    ([['n', String(qiymat.length)], ["O'rtacha", son(o)], ['Mediana', son(m)], ["Standart og'ish", son(s)], ['Oraliq', son(oraliq(qiymat))]] as [string, string][])
+    ([['n', String(qiymat.length)], ['Mean', son(o)], ['Median', son(m)], ['Standard deviation', son(s)], ['Range', son(oraliq(qiymat))]] as [string, string][])
-    $('f-ortacha').textContent = `${saralangan.join(' + ')} = ${yig}; ${yig} : ${qiymat.length} = ${son(o)}`;
+    $('f-ortacha').textContent = `${saralangan.join(' + ')} = ${yig}; ${yig} ÷ ${qiymat.length} = ${son(o)}`;
-      ? `Saralangan ro'yxatning ${(n + 1) / 2}-qiymati: ${son(m)}`
-      : `O'rtadagi ikkitasi ${saralangan[n / 2 - 1]} va ${saralangan[n / 2]}: (${saralangan[n / 2 - 1]} + ${saralangan[n / 2]}) : 2 = ${son(m)}`;
+      ? `Value number ${(n + 1) / 2} of the sorted list: ${son(m)}`
+      : `The two middle values are ${saralangan[n / 2 - 1]} and ${saralangan[n / 2]}: (${saralangan[n / 2 - 1]} + ${saralangan[n / 2]}) ÷ 2 = ${son(m)}`;
-    vh.textContent = ok ? "Topildi: mediana 8, o'rtacha 10. Katta qiymatlarni oshirdingiz, o'rtadagi nuqtaga tegmadingiz." : `Hali emas: o'rtacha ${son(o)}, mediana ${son(m)}. Maslahat: yig'indi 90 bo'lishi kerak, o'rtadagi 5-qiymat 8 da qolsin.`;
+    vh.textContent = ok ? 'Found: median 8, mean 10. You raised the large values and left the middle point alone.' : `Not yet: mean ${son(o)}, median ${son(m)}. Hint: the sum must be 90, and the 5th value in the middle should stay at 8.`;
-    const t = `O'rtacha ${son(oldingi.o)} dan ${son(o)} ga, mediana ${son(oldingi.m)} dan ${son(m)} ga o'zgardi. Standart og'ish ${son(sigma(qiymat))}.`;
+    const t = `The mean changed from ${son(oldingi.o)} to ${son(o)}, the median from ${son(oldingi.m)} to ${son(m)}. Standard deviation ${son(sigma(qiymat))}.`;
-    const holat = () => `Nuqta ${qiymat[i]} da: o'rtacha ${son(boshO)} → ${son(ortacha(qiymat))}, mediana ${son(boshM)} → ${son(mediana(qiymat))}.`;
+    const holat = () => `Point at ${qiymat[i]}: mean ${son(boshO)} → ${son(ortacha(qiymat))}, median ${son(boshM)} → ${son(mediana(qiymat))}.`;
-      $('anim-boshla').textContent = animBosqich ? 'Qaytarish' : "Ko'rsatish";
+      $('anim-boshla').textContent = animBosqich ? 'Return' : 'Show';
```

## Savol tekshiruvi (`tekshiruv.ts`, `scripts/savollarni-tekshir.ts`)

- Matnli qiymatlar inglizcha variant matniga tenglashtirildi: `2 marta ortadi` → `It doubles`; `Bitta` / `Cheksiz ko'p` / `Yechimi yo'q` → `One` / `Infinitely many` / `No solution`; `O'rtacha` / `Oraliq` / `Mediana` / `Standart og'ish` → `Mean` / `Range` / `Median` / `Standard deviation`; statistika-5 to'g'ri javobi.
- Skript `(2, 5)` va `17.5` ni o'qiydi (eski `(2; 5)` va `17,5` ham o'qiladi).
- Usul tavsiflari (ichki hujjat) o'zbekcha qoldi.
