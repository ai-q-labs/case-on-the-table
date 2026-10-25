/**
 * The detective notebook: which cases this browser has solved, and on which
 * days, kept in localStorage. Today's case comes from the local calendar day.
 * Plain functions with no IWSDK imports, so scripts/check-notebook.ts can test
 * them under Node.
 */

export interface SolvedEntry {
  /** The day it was last solved, as 2026-10-26. */
  date: string;
  clues: number;
  total: number;
  wrong: number;
}

export interface Notebook {
  solved: Record<string, SolvedEntry>;
  /** Days with at least one solve, oldest first. */
  days: string[];
}

const KEY = 'case-on-the-table/notebook';
const DAY_MS = 86_400_000;
// Enough for the longest streak anyone keeps; older days are dropped.
const MAX_DAYS = 400;

/** The local calendar day, as 2026-10-26. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Whole days since 1970-01-01 for a day key, so clock changes never skip one. */
function dayNumber(key: string): number {
  const [year, month, day] = key.split('-').map(Number);
  return Math.round(Date.UTC(year, month - 1, day) / DAY_MS);
}

function keyOfDay(n: number): string {
  return new Date(n * DAY_MS).toISOString().slice(0, 10);
}

/** Today's case: the ids take turns, one per local calendar day. */
export function dailyCaseId(ids: string[], date: Date): string {
  const n = dayNumber(dayKey(date));
  return ids[((n % ids.length) + ids.length) % ids.length];
}

/** Days in a row with a solve, ending today, or yesterday while today is still open. */
export function streak(days: string[], today: string): number {
  const solved = new Set(days);
  let n = dayNumber(today);
  if (!solved.has(today)) {
    n -= 1;
  }
  let count = 0;
  while (solved.has(keyOfDay(n))) {
    count += 1;
    n -= 1;
  }
  return count;
}

export function emptyNotebook(): Notebook {
  return { solved: {}, days: [] };
}

/** The saved notebook, or an empty one when there is none or storage is blocked. */
export function loadNotebook(storage: Pick<Storage, 'getItem'> | null): Notebook {
  try {
    const parsed = JSON.parse(storage?.getItem(KEY) ?? 'null') as Partial<Notebook> | null;
    if (parsed == null || typeof parsed.solved !== 'object' || !Array.isArray(parsed.days)) {
      return emptyNotebook();
    }
    return {
      solved: parsed.solved ?? {},
      days: parsed.days.filter((day): day is string => typeof day === 'string'),
    };
  } catch {
    return emptyNotebook();
  }
}

/** Saves the notebook; returns false when storage is blocked (private window, previews). */
export function saveNotebook(storage: Pick<Storage, 'setItem'> | null, notebook: Notebook): boolean {
  try {
    storage?.setItem(KEY, JSON.stringify(notebook));
    return storage != null;
  } catch {
    return false;
  }
}

/** The notebook with one more solve written in. */
export function recordSolve(notebook: Notebook, caseId: string, entry: SolvedEntry): Notebook {
  const days = notebook.days.includes(entry.date) ? notebook.days : [...notebook.days, entry.date];
  return {
    solved: { ...notebook.solved, [caseId]: entry },
    days: days.sort().slice(-MAX_DAYS),
  };
}

/** How many of these cases the notebook has solved. */
export function solvedCount(notebook: Notebook, ids: string[]): number {
  return ids.filter((id) => notebook.solved[id] != null).length;
}

/** The browser's localStorage, or null where reaching it throws. */
export function browserStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}
