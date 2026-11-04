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
];

export function rasmiyManbalar(idlar: string[] = []): Manba[] {
  return idlar
    .map((id) => manbalar.find((m) => m.id === id))
    .filter((m): m is Manba => !!m && m.tekshiruvDarajasi === 'rasmiy');
}
