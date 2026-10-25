import { CASE01 } from './case01.js';
import { CASE02 } from './case02.js';
import { CASE03 } from './case03.js';
import type { CaseFile } from './types.js';

export const CASES: CaseFile[] = [CASE01, CASE02, CASE03];

/** ?case=02 in the address wins, then VITE_CASE when the app was served, then case 01. */
function pickCase(): CaseFile {
  const fromAddress =
    typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('case');
  const wanted = String(fromAddress ?? import.meta.env.VITE_CASE ?? '01').padStart(2, '0');
  return CASES.find((file) => file.id === wanted) ?? CASE01;
}

/** The case on the table for this visit. */
export const activeCase: CaseFile = pickCase();
