// SAT original savollari taksonomiyasi: section → domain → skills (inglizcha nomlar, bazadagi qiymatlar bilan bir xil).
// Vaqtincha nusxa: asl manba `src/data/savolSxema.ts` (P05, PR #63, hali main'da emas), manba CB12.
// PR #63 merge bo'lganda bu fayl o'chiriladi va `savolTaksonomiya` savolSxema.ts dan import qilinadi.

export type SavolBolim = 'rw' | 'math';

export const savolTaksonomiya: Record<SavolBolim, Record<string, readonly string[]>> = {
  rw: {
    'Information and Ideas': [
      'Central Ideas and Details',
      'Command of Evidence: Textual',
      'Command of Evidence: Quantitative',
      'Inferences',
    ],
    'Craft and Structure': ['Words in Context', 'Text Structure and Purpose', 'Cross-Text Connections'],
    'Expression of Ideas': ['Rhetorical Synthesis', 'Transitions'],
    'Standard English Conventions': ['Boundaries', 'Form, Structure, and Sense'],
  },
  math: {
    Algebra: [
      'Linear equations in one variable',
      'Linear equations in two variables',
      'Linear functions',
      'Systems of two linear equations in two variables',
      'Linear inequalities in one or two variables',
    ],
    'Advanced Math': [
      'Equivalent expressions',
      'Nonlinear equations in one variable and systems of equations in two variables',
      'Nonlinear functions',
    ],
    'Problem-Solving and Data Analysis': [
      'Ratios, rates, proportional relationships, and units',
      'Percentages',
      'One-variable data: Distributions and measures of center and spread',
      'Two-variable data: Models and scatterplots',
      'Probability and conditional probability',
      'Inference from sample statistics and margin of error',
      'Evaluating statistical claims: Observational studies and experiments',
    ],
    'Geometry and Trigonometry': [
      'Area and volume',
      'Lines, angles, and triangles',
      'Right triangles and trigonometry',
      'Circles',
    ],
  },
};
