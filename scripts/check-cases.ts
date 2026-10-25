// Checks every case file in src/cases against the slots the scene provides.
// Run: npm run check:cases   (exit 1 on any problem, including no cases found)
// Optional arguments point it at another cases folder and scene, for its own tests.
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type Card = {
  title: string;
  lines: string[];
  reveal: 'none' | 'flip' | 'light';
  back?: string[];
  fadedLine?: number;
  hiddenText?: string;
};
type CaseFile = {
  id: string;
  title: string;
  cards: Record<string, Card>;
  suspects: Record<string, { name: string; culprit: boolean; verdict: string }>;
  links: { a: string; b: string; clue: string }[];
};

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const casesDir = process.argv[2] ?? join(root, 'src', 'cases');
const EVIDENCE = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7'];
const SUSPECTS = ['S1', 'S2', 'S3'];
// Two cards closer than this at the start would link without being brought
// together: the link distance (0.13 m in inspection-system.ts) plus room.
const MIN_LINK_START_DISTANCE = 0.16;
// Longer text overflows the three-row tags over the box.
const MAX_TAG_CHARS = 120;

// Where each evidence slot starts, from the scene itself.
const scenePath = process.argv[3] ?? join(root, 'public', 'scenes', 'main.iwsdk.scene.json');
const scene = JSON.parse(readFileSync(scenePath, 'utf-8'));
const slotPositions = new Map<string, number[]>();
for (const node of scene.nodes.flatMap((n: { children?: unknown[] }) => [n, ...(n.children ?? [])])) {
  const id = node.components?.Evidence?.evidenceId;
  if (id) slotPositions.set(id, node.transform.position);
}

const files = readdirSync(casesDir).filter((name) => /^case\d+\.ts$/.test(name)).sort();
const indexSource = readFileSync(join(casesDir, 'index.ts'), 'utf-8');
const problems: string[] = [];
if (files.length === 0) problems.push('no case files found in src/cases');

const seenIds = new Set<string>();
for (const file of files) {
  const module = await import(pathToFileURL(join(casesDir, file)).href);
  const entries = Object.entries(module) as [string, CaseFile][];
  if (entries.length !== 1) {
    problems.push(`${file}: should export exactly one case`);
    continue;
  }
  const [exportName, c] = entries[0];
  const where = `${file} (${c.id})`;
  if (file !== `case${c.id}.ts`) problems.push(`${where}: id does not match the file name`);
  if (seenIds.has(c.id)) problems.push(`${where}: duplicate id`);
  seenIds.add(c.id);
  if (!new RegExp(`\\b${exportName}\\b`).test(indexSource)) problems.push(`${where}: not listed in cases/index.ts`);
  if (!c.title) problems.push(`${where}: empty title`);

  const cardIds = Object.keys(c.cards).sort();
  const wantCards = ['BRIEF', ...EVIDENCE].sort();
  if (cardIds.join() !== wantCards.join()) problems.push(`${where}: cards are ${cardIds.join()}, want ${wantCards.join()}`);
  for (const [id, card] of Object.entries(c.cards)) {
    if (!card.title || card.lines.length === 0) problems.push(`${where}: ${id} has no title or lines`);
    if (card.reveal === 'flip' && !card.back?.length) problems.push(`${where}: ${id} flips but has nothing on the back`);
    if (card.reveal === 'light') {
      if (card.fadedLine == null || card.fadedLine < 0 || card.fadedLine >= card.lines.length) {
        problems.push(`${where}: ${id} fadedLine is not one of its lines`);
      }
      if (!card.hiddenText) problems.push(`${where}: ${id} has no hiddenText`);
    }
  }
  const reveals = Object.values(c.cards).map((card) => card.reveal);
  if (!reveals.includes('flip')) problems.push(`${where}: no card to turn over`);
  if (!reveals.includes('light')) problems.push(`${where}: no card to hold to the light`);
  if (c.links.length === 0) problems.push(`${where}: no cards to bring together`);

  const linked = new Set<string>();
  for (const link of c.links) {
    for (const id of [link.a, link.b]) {
      if (!EVIDENCE.includes(id)) problems.push(`${where}: link uses ${id}, not an evidence slot`);
      if (linked.has(id)) problems.push(`${where}: ${id} is in two links`);
      linked.add(id);
    }
    const pa = slotPositions.get(link.a);
    const pb = slotPositions.get(link.b);
    if (!pa || !pb) {
      problems.push(`${where}: link ${link.a}+${link.b} has a slot missing from the scene`);
    } else {
      const d = Math.hypot(pa[0] - pb[0], pa[2] - pb[2]);
      if (d < MIN_LINK_START_DISTANCE) {
        problems.push(`${where}: ${link.a} and ${link.b} start ${d.toFixed(3)} m apart (min ${MIN_LINK_START_DISTANCE})`);
      }
    }
    if (link.clue.length > MAX_TAG_CHARS) problems.push(`${where}: clue for ${link.a}+${link.b} is ${link.clue.length} chars`);
  }

  const suspectIds = Object.keys(c.suspects).sort();
  if (suspectIds.join() !== SUSPECTS.join()) problems.push(`${where}: suspects are ${suspectIds.join()}, want ${SUSPECTS.join()}`);
  const culprits = Object.values(c.suspects).filter((s) => s.culprit).length;
  if (culprits !== 1) problems.push(`${where}: ${culprits} culprits, want 1`);
  for (const [id, s] of Object.entries(c.suspects)) {
    if (s.verdict.length > MAX_TAG_CHARS) problems.push(`${where}: verdict for ${id} is ${s.verdict.length} chars`);
  }
}

console.log(`checked ${files.length} case file(s): ${files.join(', ')}`);
for (const problem of problems) console.log(`  PROBLEM ${problem}`);
console.log(problems.length === 0 ? 'OK' : `${problems.length} problem(s)`);
// exitCode, not exit(): exiting mid-import trips a libuv assertion on Windows.
process.exitCode = problems.length === 0 ? 0 : 1;
