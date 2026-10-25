import type { CaseFile } from './types.js';

/**
 * Case 03 "The Salted Sponge": the favourite's cake at a village show tastes
 * of salt. Every person and place here is fictional.
 */
export const CASE03: CaseFile = {
  id: '03',
  title: 'THE SALTED SPONGE',
  cards: {
    BRIEF: {
      title: 'Case 03',
      lines: [
        "Pennywick Village Show, Saturday 14:00. The judges bite into Lena Hart's lemon sponge, the favourite. It is full of salt.",
        'Someone swapped her sugar.',
        'Find who did it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: "Judges' Results",
      lines: [
        'Lemon sponge, table 4, L. Hart: salty. Disqualified.',
        'First place passes to table 5: Mia Lowe.',
      ],
      hint: 'Who is Mia Lowe?',
      reveal: 'none',
    },
    E2: {
      title: 'Steward Rota',
      lines: [
        'Steward on duty 11:00–12:00: P. Lowe (green armband).',
        'Shared jars: blue lid = sugar, red lid = salt.',
        'Jars refilled at 11:30.',
      ],
      hint: 'Which lid belongs where?',
      reveal: 'none',
    },
    E3: {
      title: 'Jar Tag',
      lines: [
        "A card tag tied to the neck of the 'sugar' jar on Lena's table.",
        "'SUGAR' is handwritten in fresh ink.",
      ],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['SALT 1 kg', 'Printed: Pennywick Show stores'],
    },
    E4: {
      title: 'Oven Queue Log',
      lines: ['Oven 2', '11:20–11:50  G. Sorensen, waiting', '11:50  G. Sorensen, tins in'],
      reveal: 'none',
    },
    E5: {
      title: "Photographer's Negative",
      lines: [
        'Frame 12, taken 11:41 at the jar table.',
        'Too dark to read lying on the table.',
        'In the frame:',
      ],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '· · ·',
      hiddenText: 'a green armband swapping two jar lids',
    },
    E6: {
      title: 'Blue Lid',
      lines: ["Found in a steward's apron pocket.", 'A blue sugar lid. Salt crystals are stuck inside it.'],
      hint: 'Compare it with the rota.',
      reveal: 'none',
    },
    E7: {
      title: 'Junior Entry Form',
      lines: ['Mia Lowe, age 15, table 5.', 'Parent or guardian: Petra Lowe.'],
      hint: 'Compare it with the results.',
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Petra Lowe',
      role: 'Show steward. Ran the ingredient table.',
      statement: '"I only refilled the jars, like every year."',
      culprit: true,
      verdict:
        "Solved. Petra Lowe swapped the lids at 11:41 so her daughter Mia would win when Lena's sponge failed.",
      palette: ['#b8c1a8', '#5b3a22', '#e6c3a3', '#3e6b48'],
      hair: 'bob',
    },
    S2: {
      name: 'Gil Sorensen',
      role: "Last year's winner. Baked at table 3.",
      statement: '"I was waiting for oven 2 all late morning."',
      culprit: false,
      verdict:
        'Not Gil Sorensen. He stood in the oven queue from 11:20 to 11:50, away from the jar table at 11:41.',
      palette: ['#aab3c4', '#d8c7a0', '#f0d4bb', '#7a2f2f'],
      hair: 'short',
    },
    S3: {
      name: 'Owen Crane',
      role: "Lena's assistant. Mixed her batter.",
      statement: '"I used the sugar jar on our table, as always."',
      culprit: false,
      verdict:
        'Not Owen Crane. He mixed the batter at 11:45 with the jar he was given; the lids were swapped at 11:41.',
      palette: ['#c4b39a', '#2a1d16', '#8d5a3c', '#2d4f7a'],
      hair: 'short',
    },
  },
  links: [
    {
      a: 'E2',
      b: 'E6',
      clue: 'A sugar lid full of salt: the blue lid went on the salt jar. Only the steward handles the jars.',
    },
    {
      a: 'E1',
      b: 'E7',
      clue: "Lena's disqualification makes Mia Lowe the winner, and Mia is Petra Lowe's daughter.",
    },
  ],
};
