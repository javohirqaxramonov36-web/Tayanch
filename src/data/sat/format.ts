// Digital SAT domenlari va ko'nikmalari.
// Manba: CB08 (Specifications Overview, Table 2 va Table 3), CB09, CB10. Tekshirilgan: 2026-11-05.
// Nomlar hujjatdagidek inglizcha. O'zgartirish faqat rasmiy manba bilan.
// "Command of Evidence" hujjatda ikki bandli (Textual, Quantitative), shuning uchun ikki ko'nikma.

export type Fan = 'math' | 'rw';

export interface Domen {
  nomi: string;
  konikmalar: string[];
}

export const fanNomi: Record<Fan, string> = {
  rw: 'Reading and Writing',
  math: 'Math',
};

export const domenlar: Record<Fan, Domen[]> = {
  rw: [
    { nomi: 'Craft and Structure', konikmalar: ['Words in Context', 'Text Structure and Purpose', 'Cross-Text Connections'] },
    {
      nomi: 'Information and Ideas',
      konikmalar: ['Central Ideas and Details', 'Command of Evidence: Textual', 'Command of Evidence: Quantitative', 'Inferences'],
    },
    { nomi: 'Standard English Conventions', konikmalar: ['Boundaries', 'Form, Structure, and Sense'] },
    { nomi: 'Expression of Ideas', konikmalar: ['Rhetorical Synthesis', 'Transitions'] },
  ],
  math: [
    {
      nomi: 'Algebra',
      konikmalar: [
        'Linear equations in one variable',
        'Linear equations in two variables',
        'Linear functions',
        'Systems of two linear equations in two variables',
        'Linear inequalities in one or two variables',
      ],
    },
    {
      nomi: 'Advanced Math',
      konikmalar: [
        'Equivalent expressions',
        'Nonlinear equations in one variable and systems of equations in two variables',
        'Nonlinear functions',
      ],
    },
    {
      nomi: 'Problem-Solving and Data Analysis',
      konikmalar: [
        'Ratios, rates, proportional relationships, and units',
        'Percentages',
        'One-variable data: distributions and measures of center and spread',
        'Two-variable data: models and scatterplots',
        'Probability and conditional probability',
        'Inference from sample statistics and margin of error',
        'Evaluating statistical claims: observational studies and experiments',
      ],
    },
    {
      nomi: 'Geometry and Trigonometry',
      konikmalar: ['Area and volume', 'Lines, angles, and triangles', 'Right triangles and trigonometry', 'Circles'],
    },
  ],
};

export const FORMAT_MANBALARI = ['CB08', 'CB09', 'CB10'];
