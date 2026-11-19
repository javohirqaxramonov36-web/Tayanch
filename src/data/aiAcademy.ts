// 6-qavat AI Academy: kurslar ro'yxati (bitta manba).
// Kursni ochish uchun faqat shu yerda `holat` ni 'tez-orada' dan 'ochiq' ga o'tkazish yetadi:
// bosh sahifa kartasi, ustki qator menyusi va /uz/ai-academy/ sahifasi shu fayldan o'qiydi.
// Ochishdan oldin kurs sahifasi (`/uz/ai-academy/<slug>/`) qurilgan bo'lishi kerak.
// Raqamli da'vo, o'quvchilar soni, sertifikat va reyting yozilmaydi.

export interface AiKurs {
  slug: string;
  nomi: string;
  holat: 'ochiq' | 'tez-orada';
  izoh: string;
  /** Bepul darslar soni; darslar yozilmaguncha null */
  bepulDarslar: number | null;
}

export const aiKurslar: AiKurs[] = [
  {
    slug: 'prompt-engineering',
    nomi: 'Prompt Engineering',
    holat: 'tez-orada',
    izoh: "AI'dan aniq va foydali javob olish uchun prompt yozish.",
    bepulDarslar: null,
  },
];

/** Kamida bitta kurs ochiq bo'lsa, qavat kartasida "boshlash" tugmasi chiqadi. */
export const aiKursOchiq = aiKurslar.some((k) => k.holat === 'ochiq');

export const aiKursManzili = (k: AiKurs) => `/uz/ai-academy/${k.slug}/`;
