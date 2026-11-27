// IELTS Writing Task 2 mavzulari: Tayanch uchun yozilgan namuna, rasmiy IELTS savoli emas.
// Qo'llanma (/uz/ielts/qollanma/writing-task-2/) va baholash mashqi (/uz/ielts/mashq/writing/) ishlatadi.
// id serverga `prompt_id` bo'lib boradi: faqat kichik lotin harf, raqam va tire (supabase/functions/ielts-writing-baho).

export interface WritingMavzu {
  id: string;
  /** Savol turi (inglizcha, 2026-11-27). */
  tur: string;
  /** Savol matni (inglizcha). */
  matn: string;
}

export const writingMavzular: WritingMavzu[] = [
  { id: 'univ', tur: 'Comparing', matn: 'Some people believe that university education should be free for every student, while others think that students should pay for their own studies. Discuss both views and give your own opinion.' },
  { id: 'tirbandlik', tur: 'Solution to a problem', matn: 'In many large cities, traffic congestion is becoming a serious problem. What are the main causes of this problem, and what measures could be taken to reduce it?' },
  { id: 'tanaffus', tur: 'Giving and justifying an opinion', matn: 'Some people think that young people should spend a year working or travelling before they start university. To what extent do you agree or disagree?' },
  { id: 'onlayn-talim', tur: 'Advantages and disadvantages', matn: 'More and more students now take courses online instead of attending classes in person. Do the advantages of this development outweigh the disadvantages?' },
  { id: 'uydan-ishlash', tur: 'Two-part question', matn: 'Many people now work from home for part of the week. Why is this happening, and is it a positive or negative development?' },
  { id: 'reklama', tur: 'Giving and justifying an opinion', matn: 'Advertising aimed at children should be banned. To what extent do you agree or disagree?' },
];
