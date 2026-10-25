import { createComponent, Types } from '@iwsdk/core';

/** The tray that holds a case. Moved onto a detected table when one appears. */
export const EvidenceBox = createComponent('EvidenceBox', {
  placedOnTable: { type: Types.Boolean, default: false },
  /** True when the whole tray fits inside the table's real outline. */
  fitsTable: { type: Types.Boolean, default: false },
  /** The player put the culprit's photo in the tray. */
  solved: { type: Types.Boolean, default: false },
  /** Photos of innocent suspects put in the tray before solving. */
  wrongGuesses: { type: Types.Int8, default: 0 },
});

/** One piece of evidence the player can pick up. */
export const Evidence = createComponent('Evidence', {
  evidenceId: { type: Types.String, default: '' },
  label: { type: Types.String, default: '' },
  /** The player turned the card over and saw its back. */
  flipped: { type: Types.Boolean, default: false },
  /** The player held the card up to the light and the faded print showed. */
  lit: { type: Types.Boolean, default: false },
  /** The player brought this card to the one it connects with. */
  linked: { type: Types.Boolean, default: false },
});

/** A suspect's photo card. Putting it in the tray accuses them. */
export const Suspect = createComponent('Suspect', {
  suspectId: { type: Types.String, default: '' },
  name: { type: Types.String, default: '' },
  /** This photo has been put in the tray at least once. */
  accused: { type: Types.Boolean, default: false },
});
