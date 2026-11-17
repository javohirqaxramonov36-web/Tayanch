// Brauzer xotirasidagi kalitlar (P23, 2026-11-11): "Saqlash va cookie" sahifalari (uz, en) va "Ma'lumotlarimni yuklab olish".
// Ro'yxat src ichidagi kalitlardan yig'ilgan (grep "tayanch:", 2026-11-11). Faqat dev rejimdagi kalitlar yozilmagan.
// Yangi kalit qo'shilsa shu yerga yoziladi.

export interface BrauzerKalit {
  kalit: string;
  uz: string;
  en: string;
  /** sessionStorage: oyna yopilguncha */
  sessiya?: boolean;
}

export const brauzerKalitlari: BrauzerKalit[] = [
  { kalit: 'tayanch:auth', uz: "Hisobga kirganingizda sessiya (Supabase o'zi yozadi). Chiqqaningizda o'chadi.", en: 'Your sign-in session (written by Supabase). Removed when you sign out.' },
  { kalit: 'tayanch:auth-code-verifier', uz: "Google bilan kirishda bir martalik tekshiruv kodi.", en: 'A one-time check code used while signing in with Google.' },
  { kalit: 'tayanch:hisob-keyin', uz: "Google bilan kirgandan keyin qaysi sahifaga qaytish.", en: 'Which page to return to after signing in with Google.', sessiya: true },
  { kalit: 'tayanch:mavzu, tayanch:sidebar', uz: "Yorug' yoki qorong'i mavzu va yon panel holati.", en: 'Light or dark theme and the side panel state.' },
  { kalit: 'tayanch:qavat', uz: 'Qaysi qavatda ekaningiz.', en: 'Which floor of the site you are on.', sessiya: true },
  { kalit: 'tayanch:sat-…', uz: "SAT: javoblar, dars progressi, xato daftari, takrorlash, lug'at, reja, rasmiy testlar, kun savoli, to'lov holati, o'qish afzalliklari.", en: 'SAT: answers, lesson progress, mistake log, review, vocabulary, plan, official tests, question of the day, payment status, study preferences.' },
  { kalit: 'tayanch:sat-tarif-kesh', uz: "SAT: amaldagi tarif (yon paneldagi Upgrade bandi uchun), 10 daqiqa.", en: 'SAT: your current plan (for the Upgrade link in the side panel), kept for 10 minutes.', sessiya: true },
  { kalit: 'tayanch:sat-reyting', uz: "SAT reytingida tanlangan davr (hafta yoki oy) va doira.", en: 'The period (week or month) and view you chose on the SAT leaderboard.' },
  { kalit: 'tayanch:sat-sessiya', uz: 'SAT mashq sessiyasining joriy holati.', en: 'The current SAT practice session.', sessiya: true },
  { kalit: 'tayanch:ielts-…, tayanch:top-admission-…', uz: "IELTS va Top Admission: dars progressi, urinishlar va reja.", en: 'IELTS and Top Admission: lesson progress, attempts and plan.' },
  { kalit: 'tayanch:navigator-…, tayanch:keyingi-qadam', uz: "Bosh sahifadagi yo'l xaritasi javoblari va keyingi qadam.", en: 'Your answers on the home page road map and your next step.' },
  { kalit: 'tayanch:analitika-kirgan', uz: "Natijalar sahifasi oldin ochilganmi (faqat belgi).", en: 'Whether you have opened the results page before (a flag only).' },
  { kalit: 'tayanch:metrika:…', uz: "Statistika hodisasi oxirgi marta qachon yuborilgani (ortiqcha so'rov bo'lmasligi uchun, faqat vaqt).", en: 'When a usage statistics event was last sent (to avoid duplicate requests; a time only).', sessiya: true },
  { kalit: 'tayanch-topshirish-yoli', uz: "Topshirish yo'li vositasidagi belgilaringiz.", en: 'Your marks in the Application path tool.' },
];

/** Eksportga qo'shilmaydigan kalitlar: sessiya tokenlari (faylga yozilmaydi). */
export const eksportdanTashqari = (kalit: string) => kalit === 'tayanch:auth' || kalit.startsWith('tayanch:auth-');
