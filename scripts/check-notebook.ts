// Checks the notebook's plain functions: today's case, the streak, and saving
// when storage works, is empty, holds junk or is blocked.
// Run: npm run check:notebook   (exit 1 on any failed check)
import {
  dailyCaseId,
  dayKey,
  emptyNotebook,
  loadNotebook,
  recordSolve,
  saveNotebook,
  solvedCount,
  streak,
} from '../src/notebook.ts';

const IDS = ['01', '02', '03', '04', '05', '06', '07'];
const failures: string[] = [];
let checks = 0;

function check(name: string, ok: boolean, detail = ''): void {
  checks += 1;
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
}

// Today's case: one per local day, every case once in any seven days in a row.
const week = Array.from({ length: 7 }, (_, i) => dailyCaseId(IDS, new Date(2026, 10, 1 + i, 12)));
check('seven days give seven different cases', new Set(week).size === 7, week.join(','));
for (let i = 0; i < 30; i += 1) {
  const first = dailyCaseId(IDS, new Date(2026, 9, 1 + i, 0, 0, 1));
  const last = dailyCaseId(IDS, new Date(2026, 9, 1 + i, 23, 59, 59));
  check(`day ${i + 1} keeps one case from 00:00 to 23:59`, first === last, `${first} vs ${last}`);
  const next = dailyCaseId(IDS, new Date(2026, 9, 2 + i, 0, 0, 1));
  check(`day ${i + 1} and the next differ`, first !== next, first);
}
// Across the end of a month and a year, and the night European clocks go
// forward (the count works from the calendar date, in any time zone).
for (const [y, m, d] of [
  [2026, 9, 31],
  [2026, 11, 31],
  [2027, 2, 28],
]) {
  const a = dailyCaseId(IDS, new Date(y, m, d, 12));
  const b = dailyCaseId(IDS, new Date(y, m, d + 1, 12));
  check(`${y}-${m + 1}-${d} to the next day moves on by one`, IDS.indexOf(b) === (IDS.indexOf(a) + 1) % 7, `${a} -> ${b}`);
}
check('dayKey pads month and day', dayKey(new Date(2026, 0, 5, 9)) === '2026-01-05', dayKey(new Date(2026, 0, 5, 9)));

// The streak.
check('no days: streak 0', streak([], '2026-10-26') === 0);
check('today only: 1', streak(['2026-10-26'], '2026-10-26') === 1);
check('yesterday only, today still open: 1', streak(['2026-10-25'], '2026-10-26') === 1);
check('two days ago only: 0', streak(['2026-10-24'], '2026-10-26') === 0);
check('three days in a row: 3', streak(['2026-10-24', '2026-10-25', '2026-10-26'], '2026-10-26') === 3);
check('a gap ends it: 1', streak(['2026-10-23', '2026-10-24', '2026-10-26'], '2026-10-26') === 1);
check('across a month end: 2', streak(['2026-10-31', '2026-11-01'], '2026-11-01') === 2);
check('across a year end: 2', streak(['2026-12-31', '2027-01-01'], '2027-01-01') === 2);

// Saving and loading.
const store = new Map<string, string>();
const storage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
};
check('nothing saved yet: empty notebook', solvedCount(loadNotebook(storage), IDS) === 0);
let book = recordSolve(emptyNotebook(), '03', { date: '2026-10-25', clues: 4, total: 4, wrong: 1 });
book = recordSolve(book, '05', { date: '2026-10-26', clues: 3, total: 4, wrong: 0 });
book = recordSolve(book, '03', { date: '2026-10-26', clues: 4, total: 4, wrong: 0 });
check('saving works', saveNotebook(storage, book) === true);
const back = loadNotebook(storage);
check('two cases solved after three solves', solvedCount(back, IDS) === 2, String(solvedCount(back, IDS)));
check('each day kept once', back.days.join() === '2026-10-25,2026-10-26', back.days.join());
check('a case solved again keeps its latest result', back.solved['03']?.wrong === 0);
check('streak from the saved days: 2', streak(back.days, '2026-10-26') === 2);
check('ids outside the case list are not counted', solvedCount(recordSolve(back, '99', { date: '2026-10-26', clues: 0, total: 0, wrong: 0 }), IDS) === 2);

store.set('case-on-the-table/notebook', '{not json');
check('junk in storage: empty notebook', solvedCount(loadNotebook(storage), IDS) === 0);
store.set('case-on-the-table/notebook', '{"solved":{"01":{}},"days":"2026-10-26"}');
check('wrong shape in storage: empty notebook', solvedCount(loadNotebook(storage), IDS) === 0);

const blocked = {
  getItem: (): string | null => {
    throw new Error('SecurityError');
  },
  setItem: (): void => {
    throw new Error('QuotaExceededError');
  },
};
check('blocked storage loads an empty notebook', solvedCount(loadNotebook(blocked), IDS) === 0);
check('blocked storage reports the save failed', saveNotebook(blocked, book) === false);
check('no storage at all loads an empty notebook', solvedCount(loadNotebook(null), IDS) === 0);
check('no storage at all reports the save failed', saveNotebook(null, book) === false);

console.log(`ran ${checks} checks`);
for (const failure of failures) console.log(`  FAILED ${failure}`);
console.log(failures.length === 0 ? 'OK' : `${failures.length} failed`);
process.exitCode = failures.length === 0 && checks > 0 ? 0 : 1;
