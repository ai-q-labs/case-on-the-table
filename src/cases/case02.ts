import type { CaseFile } from './types.js';

/**
 * Case 02 "The Anonymous Letter": a typed threat in a choir director's
 * pigeonhole. Every person and place here is fictional.
 */
export const CASE02: CaseFile = {
  id: '02',
  title: 'THE ANONYMOUS LETTER',
  cards: {
    BRIEF: {
      title: 'Case 02',
      lines: [
        'Alder Lane Community Choir, Wednesday 19:00. The director finds a typed letter in her pigeonhole.',
        '"Step down before Saturday, or everyone hears where the trip money went."',
        'Find who wrote it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: 'The Anonymous Letter',
      lines: [
        '"Step down before Saturday, or everyone hears where the trip money went."',
        "Typed, unsigned, left in Ruth Ambler's pigeonhole.",
        "On every line the letter 'e' sits a little low.",
      ],
      hint: 'Which machine typed it?',
      reveal: 'none',
    },
    E2: {
      title: 'Trip Fund Ledger',
      lines: [
        'Kept by the treasurer, C. Marsh.',
        'Collected from members: 1,240',
        'Coach deposit, 2 Oct: 400',
        'Balance in the bank: 840',
      ],
      hint: 'Is the money really there?',
      reveal: 'none',
    },
    E3: {
      title: 'The Envelope',
      lines: ["Plain envelope, 'R. AMBLER' typed on the front.", 'No stamp: delivered by hand.'],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['1,240 − 400 = 840', 'Pencilled on the flap.'],
    },
    E4: {
      title: 'Hall Sign-in Book',
      lines: [
        'Wednesday',
        '14:00–15:30  D. Okafor, rehearsal room',
        '16:10–16:40  C. Marsh, office',
        '17:00–18:30  N. Berg, main hall piano',
        'Office keys: the director and the treasurer only.',
      ],
      reveal: 'none',
    },
    E5: {
      title: 'Office Typewriter',
      lines: [
        'A test line typed today on the hall office typewriter:',
        '"The quick brown fox jumps over the lazy dog."',
        "Its 'e' key strikes low.",
      ],
      hint: 'Compare it with the letter.',
      reveal: 'none',
    },
    E6: {
      title: 'Office Message Pad',
      lines: [
        'From beside the hall office phone.',
        'The top sheet has been torn off.',
        'Pressed into the next sheet:',
      ],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '~ ~ ~',
      hiddenText: '"STEP DOWN BEFORE SATURDAY"',
    },
    E7: {
      title: 'Bank Statement',
      lines: [
        'Alder Lane Choir, trip fund account.',
        'Balance on Wednesday: 340',
        'Only the treasurer can withdraw.',
      ],
      hint: 'Compare it with the ledger.',
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Dee Okafor',
      role: 'Soprano. Lost the festival solo last week.',
      statement: '"I was in the rehearsal room and left at 15:30."',
      culprit: false,
      verdict:
        'Not Dee Okafor. She left at 15:30 and has no office key, and the letter was typed in the locked office.',
      palette: ['#b7c4b0', '#121010', '#5a3a28', '#7a3b69'],
      hair: 'bun',
    },
    S2: {
      name: 'Colin Marsh',
      role: 'Treasurer. Keeps the trip fund ledger.',
      statement: '"I only stopped by the office to drop off receipts."',
      culprit: true,
      verdict:
        'Solved. Colin Marsh typed it in the office to drive the director out before anyone missed the 500 he took.',
      palette: ['#c2b8a3', '#8a7b6a', '#e0bfa0', '#3d4a5c'],
      hair: 'short',
    },
    S3: {
      name: 'Nils Berg',
      role: 'Accompanist.',
      statement: '"I came at 17:00 and played until 18:30."',
      culprit: false,
      verdict:
        'Not Nils Berg. He arrived at 17:00, after the office was locked again, and he has no office key.',
      palette: ['#a9b6c8', '#c9a86a', '#edd0b5', '#4f6b3a'],
      hair: 'short',
    },
  },
  links: [
    {
      a: 'E1',
      b: 'E5',
      clue: "Same low 'e'. The letter was typed on the hall office typewriter.",
    },
    {
      a: 'E2',
      b: 'E7',
      clue: 'The ledger says 840; the bank holds 340. 500 is gone, and only the treasurer can withdraw.',
    },
  ],
};
