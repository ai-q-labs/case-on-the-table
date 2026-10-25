/**
 * The shape of one case: the words printed on each card, the hand
 * inspections that reveal hidden clues, the links between cards, and the
 * three suspects. Plain data, so every case is one file.
 *
 * Card slots are fixed by the scene: BRIEF on top of the pile, E1–E7 in the
 * tray, S1–S3 (left to right) on the back rim. A case chooses which slot holds
 * what, and must link only slots that do not start next to each other
 * (`npm run check:cases` checks this and the rest of the shape).
 */

/** How a card hides its clue until the player handles it. */
export type Reveal = 'none' | 'flip' | 'light';

export interface CardText {
  title: string;
  lines: string[];
  /** A nudge printed small at the foot of the face. */
  hint?: string;
  /** Draw a sketch of the corridor photo above the lines. */
  photo?: boolean;
  reveal: Reveal;
  /** Words on the back. Without them the back shows the card's number. */
  back?: string[];
  /**
   * For a 'light' card: the face line that has faded, the ghost left of it
   * (default '··:··'), and the words that show once the card is held up.
   */
  fadedLine?: number;
  ghostText?: string;
  hiddenText?: string;
}

export interface CardLink {
  a: string;
  b: string;
  /** What the two cards say together, shown above them once linked. */
  clue: string;
}

export interface SuspectText {
  name: string;
  role: string;
  statement: string;
  culprit: boolean;
  /** Shown when this photo goes in the box. */
  verdict: string;
  /** Portrait colours: background, hair, skin, coat. */
  palette: [string, string, string, string];
  hair: 'bun' | 'short' | 'bob';
}

export interface CaseFile {
  /** Two digits, as in ?case=02. */
  id: string;
  /** Printed on every card's header and back. */
  title: string;
  /** BRIEF and E1–E7. */
  cards: Record<string, CardText>;
  /** S1–S3, left to right. */
  suspects: Record<string, SuspectText>;
  links: CardLink[];
}
