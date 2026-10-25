import type { CaseFile } from './types.js';

/**
 * Case 04 "The Signed First Edition": a collector's prize signature is a
 * fake. Every person, place, book and brand here is fictional.
 */
export const CASE04: CaseFile = {
  id: '04',
  title: 'THE SIGNED FIRST EDITION',
  cards: {
    BRIEF: {
      title: 'Case 04',
      lines: [
        "Quillmere Books, Thursday. A collector paid 480 for a signed first edition of Edith Marrow's 'The Salt Orchard'.",
        'His expert says the signature is a fake.',
        'Find who faked it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: "Expert's Report",
      lines: [
        'The signature on the title page is in blue gel ink.',
        'Edith Marrow died in 1971. Gel pens came decades later.',
      ],
      hint: 'What pen was it?',
      reveal: 'none',
    },
    E2: {
      title: 'Provenance Letter',
      lines: [
        'Sold with the book, dated 1962:',
        '"To my dear friend, with love, Edith."',
        'Watermark:',
      ],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '· · ·',
      hiddenText: 'BRIGHTMOOR BOND, MADE 2019',
    },
    E3: {
      title: 'Price Slip',
      lines: ['First edition, SIGNED.', 'Price: 480', 'Priced 10 Oct, R.V.'],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['Bought 6 Oct', "D. Fairley's lot, 15, unsigned."],
    },
    E4: {
      title: 'Shop Day Book',
      lines: [
        '6 Oct  House-clearance lot bought from D. Fairley.',
        '9–12 Oct  H. Tamsin at the Lowmoor book fair. Shop kept by R. Venn.',
        'Staff earn 10% on sales over 100.',
      ],
      reveal: 'none',
    },
    E5: {
      title: 'Till Pen',
      lines: ['From the drawer under the till.', 'A blue gel pen. Only staff use it.'],
      hint: 'Compare it with the report.',
      reveal: 'none',
    },
    E6: {
      title: 'Framed Letter',
      lines: [
        'Hangs behind the counter: a real 1965 letter from Edith Marrow to the shop.',
        'Her signature leans hard to the right.',
      ],
      reveal: 'none',
    },
    E7: {
      title: 'Tracing Paper',
      lines: ['Crumpled, from the back-room bin.', 'Pencil lines: one signature, gone over twice.'],
      hint: 'Compare it with the framed letter.',
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Hugo Tamsin',
      role: 'Owner of Quillmere Books.',
      statement: '"It came in signed. I would never fake a book."',
      culprit: false,
      verdict:
        'Not Hugo Tamsin. He was at the Lowmoor book fair from 9 to 12 Oct, when the book was signed and priced.',
      palette: ['#b3b9c6', '#9a9a9a', '#e8c9ac', '#5a4632'],
      hair: 'short',
    },
    S2: {
      name: 'Declan Fairley',
      role: 'House-clearance dealer. Sold the shop the book.',
      statement: '"I sold it as I found it. No idea about any signature."',
      culprit: false,
      verdict: "Not Declan Fairley. The shop's own slip says the book was unsigned when he sold it on 6 Oct.",
      palette: ['#c8bca4', '#3b2a1e', '#c99a74', '#556b2f'],
      hair: 'short',
    },
    S3: {
      name: 'Rosa Venn',
      role: 'Shop assistant.',
      statement: '"I only priced what Hugo had already sorted."',
      culprit: true,
      verdict:
        'Solved. Rosa Venn traced the signature with the till pen while alone in the shop, and priced it on 10 Oct.',
      palette: ['#bfb2c4', '#2b1b14', '#d8ad8c', '#2f5a6b'],
      hair: 'bob',
    },
  },
  links: [
    {
      a: 'E1',
      b: 'E5',
      clue: "Blue gel ink in both: the signature was made with the shop's own till pen.",
    },
    {
      a: 'E6',
      b: 'E7',
      clue: 'The tracing matches the framed signature stroke for stroke: it was copied in the shop.',
    },
  ],
};
