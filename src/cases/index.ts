import { CASE01 } from './case01.js';
import { CASE02 } from './case02.js';
import { CASE03 } from './case03.js';
import { CASE04 } from './case04.js';
import { CASE05 } from './case05.js';
import { CASE06 } from './case06.js';
import { CASE07 } from './case07.js';
import { browserStorage, caseForToday, loadNotebook } from '../notebook.js';
import type { CaseFile } from './types.js';

export const CASES: CaseFile[] = [CASE01, CASE02, CASE03, CASE04, CASE05, CASE06, CASE07];
/** Opens once every daily case is solved. ?case=07 still plays it any time. */
export const FINAL_CASE: CaseFile = CASE07;
/** The cases that take turns, one a day. */
export const DAILY_IDS: string[] = CASES.filter((file) => file !== FINAL_CASE).map((file) => file.id);

/** ?case=02 in the address wins, then VITE_CASE when the app was served, then today's case. */
function pickCase(): CaseFile {
  const fromAddress =
    typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('case');
  const today = caseForToday(DAILY_IDS, FINAL_CASE.id, loadNotebook(browserStorage()), new Date());
  const wanted = String(fromAddress ?? import.meta.env.VITE_CASE ?? today).padStart(2, '0');
  return CASES.find((file) => file.id === wanted) ?? CASE01;
}

/** The case on the table for this visit. */
export const activeCase: CaseFile = pickCase();
