import type { CaseFile } from './types.js';

/**
 * Case 01 "The Empty Case": a jade hairpin gone from a locked display case.
 * Every person and place here is fictional.
 */
export const CASE01: CaseFile = {
  id: '01',
  title: 'THE EMPTY CASE',
  cards: {
    // Lies on top of the pile: the first card the player reads.
    BRIEF: {
      title: 'Case 01',
      lines: [
        "A small private museum, 23:40. The night guard finds the jade hairpin's case open and empty.",
        'The lock was not forced. Someone used a key.',
        'Examine the evidence with your hands. When you know who did it, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: 'Night Patrol, Gallery 3',
      lines: [
        '22:30  Jade hairpin in its case.',
        '23:40  Case open. Hairpin gone.',
        'The lock was not forced. It was opened with a key.',
        'T. Varga, night guard',
      ],
      reveal: 'none',
    },
    E2: {
      title: 'Case Key Log',
      lines: [
        'KEY A  Curator M. Quell. Carries it at all times.',
        'KEY B  Out 14:00, I. Tan (restorer). Back 17:00, I. Tan.',
        'No key signed out after 17:00.',
      ],
      reveal: 'none',
    },
    E3: {
      title: 'Torn Ticket Stub',
      lines: [
        'GULLHAVEN RAIL, Coast Line',
        'Single. Departs 23:15.',
        'Found inside the empty case.',
        'Iris Tan says she took the 23:15 home tonight.',
      ],
      hint: 'Something is printed on the back.',
      reveal: 'flip',
      back: ['ISSUED 13 MAR', 'Valid on the day of issue only', 'Not punched'],
    },
    E4: {
      title: "Iris's Ticket Wallet",
      lines: [
        "From Iris Tan's coat.",
        'One ticket inside: Coast Line, departs 23:15.',
        'Issued 14 MAR. Punched by the conductor.',
      ],
      hint: 'Compare it with another ticket.',
      reveal: 'none',
    },
    E5: {
      title: 'Parking Receipt',
      lines: [
        "From the curator's coat pocket.",
        'GULLHAVEN CAR PARK, Level 2',
        'ENTRY 08:52',
        'EXIT',
        'Mara Quell: "I drove home at 22:00."',
      ],
      hint: 'Thermal paper. Hold it up to the light.',
      reveal: 'light',
      fadedLine: 3,
      hiddenText: '23:32',
    },
    E6: {
      title: 'Corridor Photo',
      lines: [
        "Corridor B, 23:41. Ben Oduya set out the 'wet floor' sign at 22:45.",
        'Heel prints cross the wet floor toward the case.',
      ],
      hint: 'Whose heels?',
      photo: true,
      reveal: 'none',
    },
    E7: {
      title: 'Office Shoes',
      lines: [
        "Found under the curator's desk.",
        'Low block heels, size 38.',
        'Mara Quell: "I left at 22:00."',
      ],
      hint: 'Compare them with the photo.',
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Ben Oduya',
      role: 'Cleaner. Has a building key only.',
      statement: '"I clocked out at 22:50."',
      culprit: false,
      verdict: 'Not Ben Oduya. He has no key to the case, and it was opened with one.',
      palette: ['#9fb3c2', '#1d1a19', '#6b4632', '#2f5d6b'],
      hair: 'short',
    },
    S2: {
      name: 'Iris Tan',
      role: 'Outside restorer. Checked the case this afternoon.',
      statement: '"I gave the key back at 17:00 and took the 23:15 train."',
      culprit: false,
      verdict:
        'Not Iris Tan. She gave Key B back at 17:00, and the ticket that points to her was planted.',
      palette: ['#c9bfa8', '#14110f', '#d9b48f', '#b8892c'],
      hair: 'bob',
    },
    S3: {
      name: 'Mara Quell',
      role: 'Curator. Holds Key A.',
      statement: '"I drove home at 22:00."',
      culprit: true,
      verdict:
        "Solved. Mara Quell opened the case with Key A, planted yesterday's ticket, and drove off at 23:32.",
      palette: ['#b9aeb8', '#6e2f1f', '#e2c1a4', '#6d2235'],
      hair: 'bun',
    },
  },
  links: [
    {
      a: 'E3',
      b: 'E4',
      clue: "Iris's own ticket is today's and punched. The stub in the case is yesterday's: planted.",
    },
    {
      a: 'E6',
      b: 'E7',
      clue: "The heel prints match the curator's shoes. She walked to the case after 22:45.",
    },
  ],
};
