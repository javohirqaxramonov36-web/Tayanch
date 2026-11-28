// Mavjud mini-mashqlar va to'liq testlar alohida ko'rsatiladi. Matn inglizcha (2026-11-27).
// To'liq Listening, Speaking va birlashtirilgan mock hali ochilmagan. Vaqtlar: IE01, IE02.
import { IKONKA } from '../ieltsSahifalar.ts';

export interface MashqKarta {
  konikma: "Listening" | "Reading" | "Writing" | "Speaking" | "Full Mock Test";
  nomi: string;
  vaqt: string;
  tarkib: string;
  tavsif: string;
  /** part after /uz/ielts/; cards without it are "coming soon" */
  qism?: string;
  ikonka: string;
}

export const mashqKartalar: MashqKarta[] = [
  { konikma: 'Full Mock Test', nomi: 'Full Mock Test', vaqt: '2 hours 45 minutes', tarkib: '4 sections', tavsif: 'All four sections in one test.', ikonka: IKONKA.namuna },
  { konikma: 'Reading', nomi: 'Reading', vaqt: '60 minutes', tarkib: '40 questions', tavsif: '3 passages, automatic marking and an estimated band.', qism: 'mashq/reading/', ikonka: IKONKA.reading },
  { konikma: 'Reading', nomi: 'True / False / Not Given', vaqt: '', tarkib: 'Short drill', tavsif: 'Compare each statement with the text, then swipe the card or press a button.', qism: 'mashq/tfng/', ikonka: IKONKA.reading },
  { konikma: 'Listening', nomi: 'Listening spelling', vaqt: '', tarkib: 'Short drill', tavsif: 'Listen to a word and spell it correctly.', qism: 'mashq/listening-imlo/', ikonka: IKONKA.listening },
  { konikma: 'Listening', nomi: 'Letters and numbers dictation', vaqt: '', tarkib: 'Short drill', tavsif: 'Listen and write names, phone numbers, dates and prices.', qism: 'mashq/listening-raqamlar/', ikonka: IKONKA.listening },
  { konikma: 'Listening', nomi: 'Listening mock', vaqt: 'about 30 minutes', tarkib: '40 questions', tavsif: 'A full Listening test.', ikonka: IKONKA.listening },
  { konikma: 'Writing', nomi: 'Writing Task 2', vaqt: 'suggested: 40 minutes', tarkib: 'Writing section: 60 minutes in total', tavsif: 'Write and save a Task 2 essay.', qism: 'mashq/writing/', ikonka: IKONKA.writing },
  { konikma: 'Speaking', nomi: 'Speaking', vaqt: '11–14 minutes', tarkib: '3 parts', tavsif: 'Timed spoken answers to Part 1–3 questions, then listen to your recording.', qism: 'qollanma/speaking/#mashq', ikonka: IKONKA.speaking },
];
