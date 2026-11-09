// Savol ko'rsatkichi (P06) namuna sahifasi uchun NAMUNA savollar (/uz/sat/vosita/savol-namuna/).
// Tayanch uchun yozilgan original savollar (AI qoralama, muallif tekshiradi). Rasmiy SAT savoli emas,
// College Board materialidan olinmagan. Ekranda "Sample" deb belgilanadi. Jadvaldagi raqamlar savol uchun to'qilgan.
// To'g'ri javoblar faqat shu namuna sahifada: haqiqiy savollarda ular mijozga berilmaydi (P02).

import type { Savol } from '../lib/sat/savolTuri';

export interface NamunaSavol {
  savol: Omit<Savol, 'figure'> & { figure?: { alt: string; caption?: string } | null };
  /** Faqat namuna sahifa uchun */
  togri: string[];
  izoh: string;
  turi: string;
}

export const namunaSavollar: NamunaSavol[] = [
  {
    turi: 'Reading and Writing · long passage',
    savol: {
      id: 'namuna-rw-1',
      section: 'rw',
      format: 'mcq',
      passage:
        '<p>In many neighborhoods, people own tools they use only once or twice a year. A ladder, a drill, or a pressure washer spends most of its life in a closet, taking up space that could be used for something else. ' +
        '<u>Some communities have responded by opening tool libraries, where members borrow equipment the same way they would borrow a book.</u></p>' +
        '<p>Supporters of the idea argue that sharing saves both money and storage space. Critics worry that borrowed tools will come back damaged or not come back at all. ' +
        'Volunteers at one small tool library tried to address that concern directly: before a member borrowed anything for the first time, a volunteer spent a few minutes showing how to use and clean it.</p>',
      stem: 'Which choice best describes the function of the underlined sentence in the text as a whole?',
      options: [
        { key: 'A', text: 'It introduces a practical response to the situation described in the previous sentences.' },
        { key: 'B', text: 'It presents evidence that challenges the claim made by supporters of sharing.' },
        { key: 'C', text: 'It explains why critics prefer buying tools to borrowing them.' },
        { key: 'D', text: 'It summarizes the safety lesson described at the end of the text.' },
      ],
    },
    togri: ['A'],
    izoh: 'The first two sentences describe a problem (tools sit unused). The underlined sentence introduces tool libraries as one response to it. The rest of the text discusses that response.',
  },
  {
    turi: 'Reading and Writing · poem and table',
    savol: {
      id: 'namuna-rw-2',
      section: 'rw',
      format: 'mcq',
      passage:
        '<p>The following text is from a short poem written for this sample.</p>' +
        '<p>The kettle hums before the house is up,<br>a small gray engine warming in the dark.<br>By seven, every window holds the sun,<br>and no one hears the kettle anymore.</p>' +
        '<table><thead><tr><th scope="col">Line</th><th scope="col">Time of day</th></tr></thead>' +
        '<tbody><tr><th scope="row">1–2</th><td>before sunrise</td></tr><tr><th scope="row">3–4</th><td>after sunrise</td></tr></tbody></table>',
      stem: 'Based on the text, what does the speaker suggest about the kettle?',
      options: [
        { key: 'A', text: 'It is noticed mainly while the house is still quiet.' },
        { key: 'B', text: 'It makes more noise in the morning than at night.' },
        { key: 'C', text: 'It is the reason the household wakes up early.' },
        { key: 'D', text: 'It has recently been replaced by a newer kettle.' },
      ],
    },
    togri: ['A'],
    izoh: 'Lines 1–2 describe the kettle humming in the dark, before anyone is up. Lines 3–4 say that once the house is full of daylight, "no one hears the kettle anymore."',
  },
  {
    turi: 'Math · formulas and table',
    savol: {
      id: 'namuna-math-1',
      section: 'math',
      format: 'mcq',
      stem:
        '<p>For the linear function $f$, the table shows three values of $x$ and their corresponding values of $f(x)$.</p>' +
        '<table><thead><tr><th scope="col">$x$</th><th scope="col">$f(x)$</th></tr></thead>' +
        '<tbody><tr><td>1</td><td>7</td></tr><tr><td>2</td><td>10</td></tr><tr><td>3</td><td>13</td></tr></tbody></table>' +
        '<p>Which equation defines $f$?</p>',
      options: [
        { key: 'A', text: '$f(x) = 3x + 4$' },
        { key: 'B', text: '$f(x) = 4x + 3$' },
        { key: 'C', text: '$f(x) = 7x$' },
        { key: 'D', text: '$f(x) = 3x + 7$' },
      ],
    },
    togri: ['A'],
    izoh: 'Each time $x$ increases by 1, $f(x)$ increases by 3, so the slope is 3. Then $$f(1) = 3(1) + b = 7,$$ so $b = 4$ and $f(x) = 3x + 4$.',
  },
  {
    turi: 'Math · figure, student-produced response',
    savol: {
      id: 'namuna-math-2',
      section: 'math',
      format: 'spr',
      stem: 'In right triangle $ABC$ shown, angle $B$ is a right angle, $AB = 6$, and $BC = 8$. What is the value of $\\cos A$?',
      options: null,
      figure: {
        alt: 'Right triangle ABC with the right angle at B. Side AB is vertical with length 6, and side BC is horizontal with length 8. Side AC is the hypotenuse.',
        caption: 'Sample figure.',
      },
    },
    togri: ['3/5'],
    izoh: 'By the Pythagorean theorem, $$AC = \\sqrt{6^2 + 8^2} = 10.$$ So $\\cos A = \\dfrac{AB}{AC} = \\dfrac{6}{10}$, which is $3/5$ or $0.6$.',
  },
];
