import { defineAssets } from '@iwsdk/core';
import {
  createEvidenceBox,
  createEvidenceCard,
} from './scene-assets/evidence.scene-asset.js';

// Case 01 "The Empty Case": one card per piece of evidence (E1–E7).
// The backing colour tells the cards apart before their faces get text.
export default defineAssets({
  'evidence-box': createEvidenceBox(),
  'card-e1': createEvidenceCard(0x27415e), // guard's patrol card
  'card-e2': createEvidenceCard(0x6b4a2b), // key log book
  'card-e3': createEvidenceCard(0x9c2f2f), // torn ticket stub
  'card-e4': createEvidenceCard(0x2b2b2b), // Iris's ticket wallet
  'card-e5': createEvidenceCard(0x7a7f86), // parking receipt
  'card-e6': createEvidenceCard(0x1f6f6a), // corridor photo
  'card-e7': createEvidenceCard(0x5b3a7a), // office shoes
  'card-brief': createEvidenceCard(0x8a6a1e), // case brief, read first
  'card-suspect': createEvidenceCard(0x3a3f47), // one per suspect photo
});
