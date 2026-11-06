// SAT Lug'at ekrani uchun NAMUNA so'zlar (dizayn: Tayanch-SAT-dizayn.md). Ekranda "Namuna" deb belgilanadi.
// Mashq savollari endi src/data/sat/savollar.ts da (2026-11-05).

export interface Karta {
  soz: string;
  turkum: string;
  tarjima: string;
  misol: string;
}

export const kartalar: Karta[] = [
  { soz: 'ambiguous', turkum: 'sifat', tarjima: "noaniq, ikki xil tushunilishi mumkin", misol: 'The ending of the story was deliberately ambiguous.' },
  { soz: 'concede', turkum: "fe'l", tarjima: 'tan olmoq, yon bermoq', misol: 'She conceded that her first plan had a flaw.' },
  { soz: 'meticulous', turkum: 'sifat', tarjima: "juda puxta, mayda-chuydasigacha e'tiborli", misol: 'He kept meticulous notes on every mistake.' },
  { soz: 'undermine', turkum: "fe'l", tarjima: 'zaiflashtirmoq, putur yetkazmoq', misol: 'One weak example can undermine the whole argument.' },
  { soz: 'plausible', turkum: 'sifat', tarjima: "ishonarli, bo'lishi mumkin", misol: 'Both explanations sound plausible at first.' },
  { soz: 'scrutinize', turkum: "fe'l", tarjima: 'sinchiklab tekshirmoq', misol: 'Scrutinize each answer choice before you pick one.' },
];

export const KALIT_LUGAT = 'tayanch:sat-lugat';
