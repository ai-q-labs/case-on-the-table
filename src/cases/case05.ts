import type { CaseFile } from './types.js';

/**
 * Case 05 "The Swapped Violin": a music school's old violin has become a cheap
 * copy overnight. Every person, place and firm here is fictional.
 */
export const CASE05: CaseFile = {
  id: '05',
  title: 'THE SWAPPED VIOLIN',
  cards: {
    BRIEF: {
      title: 'Case 05',
      lines: [
        "Linwell School of Music, Friday 09:00. The school's 1794 violin sounds thin at rehearsal. In its case is a cheap copy.",
        'Someone swapped it overnight.',
        'Find who did it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: 'Instrument Room Card',
      lines: ['Violin No. 1 (1794)', 'Out Thu 16:00  A. Wren, lesson', 'In Thu 17:30  A. Wren. Checked: M. Hollis'],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['ROOM KEY', 'Out Thu 18:50  F.D., "stock check"', 'Back 19:35'],
    },
    E2: {
      title: 'Concert Programme',
      lines: [
        'Linwell Youth Orchestra, Fennick Hall, Thursday 18:30–20:30.',
        'Conductor: Marta Hollis. Leader: Ada Wren.',
        'No interval.',
      ],
      reveal: 'none',
    },
    E3: {
      title: 'Door Sales Sheet',
      lines: [
        'Fennick Hall door, Thursday. Seller: F. Dorran.',
        'Last ticket sold 18:40.',
        'Cash box handed to the steward at 18:42.',
      ],
      hint: 'Compare it with the room card.',
      reveal: 'none',
    },
    E4: {
      title: 'Parcel Slip',
      lines: ['School office, Tuesday.', 'One parcel from Pellow Strings: student violin, 120.', 'Signed for: F.D.'],
      reveal: 'none',
    },
    E5: {
      title: 'Insurance File',
      lines: ['Violin No. 1, made 1794. Insured for 38,000.', 'Known mark: an old crack repair under the chin rest.'],
      hint: "Compare it with the dealer's notice.",
      reveal: 'none',
    },
    E6: {
      title: "Dealer's Notice",
      lines: [
        'Gant & Rowe, violin dealers. Just in, Thursday night:',
        'a violin of 1794 with an old crack repair under the chin rest.',
        'Bought from a private seller.',
      ],
      reveal: 'none',
    },
    E7: {
      title: 'Sealed Envelope',
      lines: ["From Gant & Rowe. Found in the bursar's desk.", 'By hand, to: F. Dorran.', 'Inside:'],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '· · ·',
      hiddenText: 'a cheque: PAY F. DORRAN 31,000',
    },
  },
  suspects: {
    S1: {
      name: 'Marta Hollis',
      role: 'Violin teacher. Conducts the youth orchestra.',
      statement: '"No. 1 was perfect when I checked it in at 17:30."',
      culprit: false,
      verdict: 'Not Marta Hollis. She conducted at Fennick Hall from 18:30 to 20:30, with no interval.',
      palette: ['#c2b6a6', '#4a3426', '#e9c6a6', '#6b3a4a'],
      hair: 'bun',
    },
    S2: {
      name: 'Felix Dorran',
      role: 'Bursar. Keeps the school accounts.',
      statement: '"I sold tickets at the concert door all evening."',
      culprit: true,
      verdict:
        'Solved. Felix Dorran left the door at 18:40, took the room key and swapped in the copy he bought, to sell No. 1.',
      palette: ['#a9b4bf', '#c9b48a', '#f0d3b8', '#3b3f4a'],
      hair: 'short',
    },
    S3: {
      name: 'Ada Wren',
      role: 'Student. Plays No. 1 at the school.',
      statement: '"I wish it were mine, but I gave it back after my lesson."',
      culprit: false,
      verdict: 'Not Ada Wren. She led the orchestra from 18:30 to 20:30, while the room key was out from 18:50 to 19:35.',
      palette: ['#b9c7c0', '#1e1410', '#a8714f', '#7a4b2a'],
      hair: 'bob',
    },
  },
  links: [
    {
      a: 'E1',
      b: 'E3',
      clue: 'Dorran stopped selling at 18:40 and had the room key at 18:50: he was not at the door all evening.',
    },
    {
      a: 'E5',
      b: 'E6',
      clue: "The dealer's violin has No. 1's crack repair: the real one was sold on Thursday night.",
    },
  ],
};
