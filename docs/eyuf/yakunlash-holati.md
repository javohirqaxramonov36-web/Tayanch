# EYUF qolgan ishlar holati

2026-11-21. Branch `codex/eyuf-yakunlash`. Avvalgi PR #201 qoralama nashri ustida davom.

## Bajarilgan kengaytmalar

- PREP_1 banki yangi sxemada 100 savolga yetkazildi. Avvalgi 88 tasdiqlangan yechim saqlandi, 12 ochiq javob ball va mockka kirmaydi.
- Darajaviy ikkinchi blok uchun 20 bakalavr so‘z-mantiq va 20 magistr tadqiqot savoli yozildi. Ular Tayanch mualliflik mashqlari deb belgilanadi. Qiyinlik kalibratsiyasi alohida ochiq.
- PREP_2dan 110 C savoli rasmga kesildi. 26 mustaqil yechim tasdiqlandi, 84 javob ochiq. PREP_1 bilan bir xil 30 savol yangi ID bilan takrorlanmadi. QR va javob jadvali rasmga olinmadi.
- 40 savol/60 daqiqalik ikki blokli simulyatsiya hamda 10 savol/15 daqiqalik diagnostika qo‘shildi. Yechimlar yakunda, vaqt sahifa yopilganda ham o‘tadi, sessiya lokal tiklanadi. Kalit `tayanch:eyuf-mock:v1`. Kitob o‘chirgichi saralashda ishlaydi.
- Kitob mashqlari qayta yoqildi. Yangi trenajyor kitob o‘chirgichiga amal qiladi. PR #204dagi eski IQ sahifasining mustaqil ishlash qarori saqlanadi.
- Test, suhbat va diagnostikadagi 53 yadro darsiga metodik matn qo‘shildi. Test va suhbat darslari mavjud daraja/progress komponentiga ulandi.
- 20 soha trekiga sana va manbali rasmiy xabarlar, tushunchalar, muammo nomzodlari va shartli ssenariy mashqlari qo‘shildi. Manba yetishmagan fakt bloklari outline holatida saqlandi.
- 14 hududga tanlangan tarixiy meros, hududga aloqador shaxslar va iqtisodiy yo‘nalishlar yozildi. Rasmiy turizm profilidagi ziddiyatli tarixiy sanalar ko‘chirilmagan. Hududning ishlab chiqarish o‘sishi yoki ish o‘rni kafolati haqida da’vo yo‘q.
- Sanali islohotlar bazasi joriy va arxiv kartalariga ajratildi. 20-noyabr xabari joriy, oldingi uch xabar tarixiy misol sifatida arxivda. Arxiv sanasi Tayanch tahririy parametri.
- 111 norasmiy suhbat savoliga inglizcha o‘quv tarjimasi qo‘shildi. 20 trek uchun yana 60 Tayanch savoli va soha tanlash filtri qo‘shildi.
- Esse jumlalaridan himoya savollari qurilmada hosil qilinadi. Matn tashqi xizmatga yuborilmaydi, yangi avtomatik saqlash qo‘shilmadi.

## Haqiqiy qurilmadagi tekshiruv

Muallif USB debuggingga ruxsat berdi. Samsung SM-A245N, Android Chrome 155, CSS viewport 360×650. Sensor hodisalari bilan mock boshlash, javob, reload/tiklash, keyingi savol, rasm zoom/yopish va yakunlash sinaldi. 14 hudud kartasi ochildi. Haqiqiy mikrofon ruxsati, MediaRecorder start/stop, lokal blob audio elementi va yozuvni tasdiq bilan o‘chirish sinaldi. Audio mazmuni Macga olinmadi. Ovozning eshitilish sifati alohida inson ko‘rigini talab qiladi.

Dastlabki CDP screenshot ayrim bloklarni takrorlab ko‘rsatdi. Androidning native screenshoti bilan sahifaning haqiqiy ko‘rinishi solishtirildi. Mockdagi katta rasm uchun aniqlangan min-content va scoped CSS muammosi tuzatildi. Sinalgan holatlarda overflow qolmadi.

## Ochiq chegaralar

- PREP_2ning lokal nusxasi 49 bet. Muallifning Macdan topish ko‘rsatmasi bilan Downloads, Documents, Desktop, Obsidian va mavjud PDF nomlari hamda bet sonlari tekshirildi. To‘liq A/B bo‘limli boshqa nusxa topilmadi. Yetishmagan shartlarni kalitdan tiklash mumkin emas.
- PREP_2ning qolgan mavjud savollari, dublikatlar, izohlar va kesimlar auditi davom etmoqda. 110 yozuvning 84 javobi tekshirilmagan.
- PREP_1 12 ochiq javob, kitob savollarining batafsil matnli transkripsiyasi, tur va difficulty ko‘rigi ochiq.
- 570 mutaxassislik lotin transkripsiyasi `verified=false`. Asl kirill va PDF lokatorlari saqlangan. Buni muallif tasdig‘isiz tekshirilgan deb belgilash mumkin emas.
- Har bir soha uchun uch eng katta mahalliy muammo, joriy vakansiya, global talab va Prezidentning aynan soha haqidagi iqtiboslari to‘liq yig‘ilmagan. Metodik muammo nomzodlari fakt sifatida ko‘rsatilmaydi.
- 2026-2 suhbat rubrikasining rasmiy tatbiqi ochiq. Tarixiy 2025-2 maqomi saqlanadi.
- AI suhbatdoshi dastlabki topshiriqda keyingi bosqichga qoldirilgan. Joriy talabdagi `interviewEngine` interfeysi mavjud. Frontendga API kaliti kiritilmaydi.
- Difficulty kalibratsiyasi va tasdiqlangan difficulty bo‘yicha adaptiv tanlov ochiq. Yangi PREP_2 va mualliflik savollari mavjud eski XP bankida bo‘lmagani uchun ularga XP berilmaydi, mahorat va takrorlash hisoblanadi.
- VoiceOver va iPhone sinovi bajarilmagan. Android mikrofon hamda sensor sinovi ularning o‘rnini bosmaydi.

Ushbu hujjat to‘liq topshiriq tugallanganini bildirmaydi. Natijalar bosqichlar bo‘yicha yangilanadi.

## 2026-11-21 yakuniy regressiya

- Bank 250 yozuv, 154 mustaqil tasdiqlangan va 96 ochiq javob. Har darajada 230 mavjud yozuv, shundan 134 mockka mos. To‘liq mock 20 IQ va 20 darajaga mos ikkinchi blokdan olinadi.
- 23/23 EYUF unit testi, JSON/sxema/manba/asset tekshiruvi va repo siyosati o‘tdi.
- Joriy main bilan build 146 sahifa. `astro check`da EYUF xatosi yo‘q, boshqa bo‘limlarda avvaldan mavjud to‘rtta xato qolgan.
- 360/1280px va yorug‘/qorong‘i mavzudagi mock, hududlar, trenajyor, suhbat uchun 16 holat axe WCAG A/AA xatosiz, gorizontal overflow va JS xatosisiz o‘tdi. Mock/hududlar Lighthouse accessibility 100.
- To‘liq 40 javob, 100 ball, reload/tiklash, yakun va progress idempotentligi hamda `progressApplied` yozilmay qolgan retry holati tekshirildi. Yakuniy ko‘rikda rasm, variantlar, qoida va qadamlar bor, zoom ishlaydi.
- Suhbatning soha/inglizcha filtri, esse da’volari, HTMLni matn sifatida ko‘rsatish, tasdiq bilan tozalash va localStorage yozish taqiqlangan holatda mockning davom etishi sinaldi.
- Yangilik kartasi Toshkent sanasi bilan archive_on kunida qurilmada ham arxivga ko‘chadi. Qurilma vaqti foydalanuvchi sozlamasiga bog‘liq. JSsiz holat oxirgi build sanasiga mos.
- Eng so‘nggi qayta tekshiruvda Android USB orqali ulanmagan. Oldingi haqiqiy qurilma tekshiruvi qayta bajarildi deb hisoblanmaydi.

Nashr doirasi ushbu tekshirilgan UI va belgilangan qoralama kontentdir. Yuqoridagi ochiq kontent va qurilma bandlari alohida qoladi. Zarur rollback shu PRni revert qilib deploy qilish, so‘ng HANDOFFdagi A1 statik nashrini tiklash orqali bajariladi.
