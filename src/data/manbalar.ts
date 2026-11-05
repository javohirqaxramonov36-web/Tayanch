// Manba jurnali (v3, 0-bo'lim "Manba qoidasi").
// Saytda qoida, talab yoki muddat sifatida faqat tekshiruvDarajasi "rasmiy" bo'lgan manba ishlatiladi.
// Ichki qoralama (grants-qoralama.json) bu yerga ko'chirilmaydi.

export type TekshiruvDarajasi = 'rasmiy' | 'rasmiy-parcha' | 'yangilik-ikkilamchi' | 'tekshirilmagan';

export interface Manba {
  id: string;
  nomi: string;
  tashkilot: string;
  havola: string;
  tekshiruvDarajasi: TekshiruvDarajasi;
  tekshirilganSana: string; // YYYY-MM-DD
  izoh?: string;
}

export const manbalar: Manba[] = [
  {
    id: 'CB01',
    nomi: 'Full-Length SAT Suite Practice Tests (Bluebook)',
    tashkilot: 'College Board',
    havola: 'https://satsuite.collegeboard.org/sat/practice-preparation/practice-tests/bluebook',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "Bluebook ilovasidagi to'liq practice testlar sahifasi. Bepulligi bu sahifada yozilmagan.",
  },
  {
    id: 'CB02',
    nomi: 'Build Your SAT Suite Study Plan',
    tashkilot: 'College Board',
    havola: 'https://satsuite.collegeboard.org/sat/practice-preparation/studying-practicing',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "Rasmiy tayyorgarlik materiallari ro'yxati: Bluebook, Khan Academy, Question Bank va boshqalar.",
  },
  {
    id: 'CB03',
    nomi: 'SAT Structure (What\'s on the Test)',
    tashkilot: 'College Board',
    havola: 'https://satsuite.collegeboard.org/sat/whats-on-the-test/structure',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-05',
    izoh: "Reading and Writing: ikki modul, har biri 32 daqiqa, 54 savol, jami 64 daqiqa. Math: ikki modul, har biri 35 daqiqa, 44 savol, jami 70 daqiqa.",
  },
  {
    id: 'EY01',
    nomi: "2026-yil 2-ochiq stipendiya tanlovi e'loni (290 kvota, hujjatlar 1–15-noyabr)",
    tashkilot: "\"El-yurt umidi\" jamg'armasining rasmiy Telegram kanali",
    havola: 'https://t.me/elyurtumidifoundation/16705',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "Kanal o'zini jamg'armaning rasmiy kanali deb ataydi va el-yurt.uz ga havola beradi. Postda: bakalavriat 101, magistratura 158, doktorantura 31 kvota; hujjatlar el-yurt.uz/application orqali 15-noyabr 23:59 gacha. Vaqt mintaqasi yozilmagan.",
  },
  {
    id: 'LX01',
    nomi: "VM 578-son qarori (13.09.2025), 1-ilova: bakalavriatga qabul nizomi",
    tashkilot: "lex.uz (Qonunchilik ma'lumotlari milliy bazasi)",
    havola: 'https://lex.uz/uz/docs/-7726569',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "42-band: College Board SAT'da 1200 va undan yuqori ball sertifikati egalari sertifikat berilgan fan kirish imtihonlari tarkibida bo'lgan yo'nalishlarga qo'shimcha davlat granti asosida qabul qilinadi; sertifikat Agentlikka DI kod orqali yuboriladi. 10-band: ro'yxatdan o'tishning 1-bosqichi har yili 5–25-iyun. Sahifaning faqat birinchi qismi (1–72-band) o'qildi.",
  },
  {
    id: 'TB01',
    nomi: 'Türkiye Scholarships: Application Calendar',
    tashkilot: 'Türkiye Bursları (YTB)',
    havola: 'https://www.turkiyeburslari.gov.tr/calendar',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "Umumiy ariza har yili 10-yanvar – 20-fevral; baholash mart–aprel, intervyu aprel–iyun, natija avgust boshi. Sahifada yil yozilmagan: 2027-yil e'loni chiqqach qayta tekshiriladi.",
  },
  {
    id: 'CO01',
    nomi: 'Coalition for College: Scoir bilan hamkorlik',
    tashkilot: 'Coalition for College',
    havola: 'https://coalitionforcollegeaccess.org/2022-new-partnership',
    tekshiruvDarajasi: 'rasmiy',
    tekshirilganSana: '2026-11-04',
    izoh: "Ariza Scoir platformasi orqali; Scoir akkaunti talaba uchun bepul; eski platforma to'xtatilgan. Xalqaro talabalar haqida bu sahifa matnida aniq gap yo'q: alohida tekshirish kerak.",
  },
];

export function rasmiyManbalar(idlar: string[] = []): Manba[] {
  return idlar
    .map((id) => manbalar.find((m) => m.id === id))
    .filter((m): m is Manba => !!m && m.tekshiruvDarajasi === 'rasmiy');
}
