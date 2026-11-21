export function esseDavolari(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/u)
    .map((s) => s.trim())
    .filter((s) => s.length >= 15)
    .slice(0, 30);
}
export function himoyaSavollari(claim: string): string[] {
  return [
    `“${claim}” da’vosini qaysi dalil yoki tajriba bilan asoslay olasiz?`,
    'Aynan o‘zingiz bajargan ish nima, jamoaning hissasi nimadan iborat?',
    'Natija qanday o‘lchangan, ma’lumotning sanasi va cheklovi qanday?',
    'Bu tajriba tanlangan dastur va O‘zbekistonga qaytish rejangizga qanday bog‘lanadi?',
  ];
}
