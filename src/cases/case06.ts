import type { CaseFile } from './types.js';

/**
 * Case 06 "The Prize Call": a radio phone-in quiz is won with the answers
 * from the host's own sheet. Every person, place and station here is fictional.
 */
export const CASE06: CaseFile = {
  id: '06',
  title: 'THE PRIZE CALL',
  cards: {
    BRIEF: {
      title: 'Case 06',
      lines: [
        "Brackwater FM, Wednesday 18:40. A caller wins 1,000 on the phone-in quiz. Her answers match the host's sheet, mistake and all.",
        'Someone showed her the sheet.',
        'Find who did it. When you know, put their photo in the box.',
      ],
      reveal: 'none',
    },
    E1: {
      title: 'Folded Copy',
      lines: ['A copy of the quiz sheet, folded small.', 'Found in the car park bin at 19:10.', 'Faint yellow printer dots:'],
      hint: 'Hold it up to the light.',
      reveal: 'light',
      fadedLine: 2,
      ghostText: '· · ·',
      hiddenText: 'WED 18:05',
    },
    E2: {
      title: 'Microphone Log',
      lines: [
        'Studio 1, Wednesday.',
        'Mic 1, R. Quill: open 18:02–18:13, live interview.',
        'Mic 3, H. Lisk: open 18:00–18:07, the news.',
      ],
      reveal: 'none',
    },
    E3: {
      title: 'Office Door Log',
      lines: ['Card reader, station office. Wednesday.', '17:28  card 02  R. Quill', '18:04  card 07  G. Tamsett'],
      hint: 'Compare it with the printer.',
      reveal: 'none',
    },
    E4: {
      title: "Host's Quiz Sheet",
      lines: [
        'R. Quill. Printed 17:30, one copy, kept in the studio.',
        'Q7  Year of the first Moon landing?  1996',
        'A typo: the right answer is 1969.',
      ],
      reveal: 'none',
    },
    E5: {
      title: 'Switchboard Slip',
      lines: ['18:38 prize call. 212 callers waiting.', 'Put through: line 4, "Dee T."', 'Chosen by: G. Tamsett, engineer on duty.'],
      reveal: 'none',
    },
    E6: {
      title: 'Printer Card',
      lines: ['Office printer, Brackwater FM.', 'Toner low. Paper A4.', 'Keeps its last jobs in memory.'],
      hint: 'Turn it over.',
      reveal: 'flip',
      back: ['LAST JOBS', '17:30  quiz sheet  1 copy', '18:05  quiz sheet  1 copy, reprint'],
    },
    E7: {
      title: 'Prize Call Sheet',
      lines: [
        'Ten in a Row, 18:40. Caller: Dee Tamsett.',
        'Ten right in 41 seconds. Prize: 1,000.',
        'Q7, answer given: "1996". Marked right on air.',
      ],
      reveal: 'none',
    },
  },
  suspects: {
    S1: {
      name: 'Gil Tamsett',
      role: 'Studio engineer. Picks which caller goes on air.',
      statement: '"I never left the control desk all evening."',
      culprit: true,
      verdict: 'Solved. Gil Tamsett printed the sheet again at 18:05, passed it to Dee Tamsett and put her call through.',
      palette: ['#b4bcc4', '#2b2420', '#d9a982', '#2f4a3a'],
      hair: 'short',
    },
    S2: {
      name: 'Rosa Quill',
      role: 'Host of Drive Time. Writes the quiz.',
      statement: '"I printed one copy at 17:30. It never left my desk."',
      culprit: false,
      verdict: 'Not Rosa Quill. Her microphone was open from 18:02 to 18:13, when the sheet was printed again.',
      palette: ['#c9b9a3', '#8a4a2b', '#f1d2b6', '#5a3a6b'],
      hair: 'bob',
    },
    S3: {
      name: 'Hana Lisk',
      role: 'Newsreader.',
      statement: '"I read the news at six. I never saw the quiz sheet."',
      culprit: false,
      verdict: 'Not Hana Lisk. She was reading the news live from 18:00 to 18:07, when the sheet was printed again.',
      palette: ['#aab9c2', '#121010', '#b98262', '#a0523d'],
      hair: 'bun',
    },
  },
  links: [
    {
      a: 'E3',
      b: 'E6',
      clue: "Tamsett's card opened the office at 18:04, and the quiz sheet was printed again at 18:05.",
    },
    {
      a: 'E4',
      b: 'E7',
      clue: 'The caller gave 1996, the typo on the sheet, not 1969: she had seen the sheet.',
    },
  ],
};
