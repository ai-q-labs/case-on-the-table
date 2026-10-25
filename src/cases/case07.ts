import type { CaseFile } from './types.js';

/**
 * Case 07 "The Unopened Safe": a hotel guest's necklace is stolen from a safe
 * that nobody opened. Every person, place and firm here is fictional.
 */
export const CASE07: CaseFile = {
  id: '07',
  title: 'THE UNOPENED SAFE',
  cards: {
    BRIEF: {
      title: 'Case 07',
      lines: [
        'Sallowmere Hotel, Saturday 22:00. A guest reports her necklace stolen from her room safe while she was at dinner. It is insured for 40,000.',
        'The safe was not forced.',
        'Find who did it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: 'Claim Form',
      lines: [
        'Signed V. Strand, Saturday 22:30.',
        '"I locked my necklace in the safe at 19:20 and went down to dinner."',
        'Claimed: 40,000.',
      ],
      reveal: 'none',
    },
    E2: {
      title: 'Safe Log',
      lines: ["Room 14 safe. Opens only with the guest's code or the master code.", 'The engineer printed its log.'],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['SAFE LOG, SATURDAY', '19:20  closed, guest code', '21:58  opened, guest code. Master code: not used.'],
    },
    E3: {
      title: 'Post Room Book',
      lines: [
        "Saturday 19:12. A small padded parcel, for Monday's post.",
        "Handed in by a lady. Sender's room: 21.",
        'Room 21 has been empty all week.',
      ],
      hint: 'Compare it with the claim form.',
      reveal: 'none',
    },
    E4: {
      title: 'Padded Parcel',
      lines: ['Still in the post room, waiting for Monday.', 'The sender sticker says Room 21.', 'Under the sticker:'],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '· · ·',
      hiddenText: 'Room 14, V. Strand',
    },
    E5: {
      title: 'Housekeeping Sheet',
      lines: ['Room 14 turndown, 20:30–20:40: P. Mottram.', 'Safe shut, its light off.', 'Bed turned down, curtains drawn.'],
      reveal: 'none',
    },
    E6: {
      title: "Porter's Book",
      lines: [
        'Saturday. T. Grealy on the front door, 20:00–22:00.',
        '22:00 Room 14 reports a necklace stolen from the safe.',
        'Safe checked: shut, not forced.',
      ],
      reveal: 'none',
    },
    E7: {
      title: "Insurer's Letter",
      lines: ['To Ms V. Strand, Thursday.', 'Your necklace cover is raised from 8,000 to 40,000,', 'as you asked.'],
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Tobin Grealy',
      role: 'Night porter. Knows the master code.',
      statement: '"I never used the master code on Saturday."',
      culprit: false,
      verdict: 'Not Tobin Grealy. His master code was never used, and the safe stayed shut from 19:20 to 21:58.',
      palette: ['#b8b0a4', '#3a2a1e', '#e2b896', '#23304a'],
      hair: 'short',
    },
    S2: {
      name: 'Pia Mottram',
      role: 'Chambermaid. Turned down Room 14.',
      statement: '"The safe was shut when I did the room. I touched nothing."',
      culprit: false,
      verdict: 'Not Pia Mottram. She was in the room 20:30–20:40, but the safe stayed shut from 19:20 to 21:58.',
      palette: ['#bfc6b2', '#5a3a22', '#c48a68', '#4a5a6b'],
      hair: 'bun',
    },
    S3: {
      name: 'Vivian Strand',
      role: 'Guest in Room 14. Owns the necklace.',
      statement: '"Someone took my necklace while I was at dinner."',
      culprit: true,
      verdict: "Solved. Vivian Strand posted the necklace at 19:12 under an empty room's number, then reported it stolen.",
      palette: ['#c4b4c0', '#c9a46a', '#f2d6c0', '#7a2a3a'],
      hair: 'bob',
    },
  },
  links: [
    {
      a: 'E1',
      b: 'E3',
      clue: 'She says she locked the necklace away at 19:20, but a small parcel went to the post room at 19:12.',
    },
    {
      a: 'E2',
      b: 'E6',
      clue: 'The safe was not forced, and nobody opened it from 19:20 to 21:58: nothing was taken at dinner.',
    },
  ],
};
