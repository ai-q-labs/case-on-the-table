import { activeCase } from './cases/index.js';
import type { CardText, SuspectText } from './cases/types.js';

/**
 * Draws the printed side of evidence cards on 2D canvases. Runtime only (it
 * needs the DOM), so the asset manifest never imports it.
 *
 * Canvas sizes keep the proportions of the card meshes, so text is not
 * stretched: the face print is 0.0748 x 0.108 m, the backing 0.085 x 0.12 m.
 */

export const FACE_SIZE = { width: 512, height: 740 };
export const BACK_SIZE = { width: 512, height: 724 };
export const LABEL_SIZE = { width: 768, height: 192 };
export const VERDICT_SIZE = { width: 768, height: 256 };

const PAPER = '#f2ece0';
const INK = '#2a2420';
const FADED = '#d8d0c2';
const HINT = '#7a6f62';
const MARGIN = 30;
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export interface FaceArt {
  canvas: HTMLCanvasElement;
  /** Where the hidden words go on a 'light' card, in canvas pixels. */
  hiddenX: number;
  hiddenY: number;
}

function makeCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.textBaseline = 'alphabetic';
  return { canvas, ctx };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number): string[] {
  const rows: string[] = [];
  let row = '';
  for (const word of text.split(' ')) {
    const next = row === '' ? word : `${row} ${word}`;
    if (row !== '' && ctx.measureText(next).width > width) {
      rows.push(row);
      row = word;
    } else {
      row = next;
    }
  }
  if (row !== '') {
    rows.push(row);
  }
  return rows;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** A grey corridor with a wet-floor sign and heel prints heading to a case. */
function drawCorridorPhoto(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const floor = ctx.createLinearGradient(0, y, 0, y + h);
  floor.addColorStop(0, '#6d6a66');
  floor.addColorStop(1, '#a9a49d');
  ctx.fillStyle = floor;
  ctx.fillRect(x, y, w, h);
  // A wet sheen across the middle of the floor.
  ctx.fillStyle = 'rgba(200, 220, 235, 0.35)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.45, y + h * 0.62, w * 0.42, h * 0.22, -0.15, 0, Math.PI * 2);
  ctx.fill();
  // The display case, open and empty, at the far end.
  ctx.strokeStyle = '#e9e4da';
  ctx.lineWidth = 4;
  ctx.strokeRect(x + w * 0.7, y + h * 0.14, w * 0.2, h * 0.3);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.7, y + h * 0.14);
  ctx.lineTo(x + w * 0.78, y + h * 0.03);
  ctx.lineTo(x + w * 0.98, y + h * 0.03);
  ctx.lineTo(x + w * 0.9, y + h * 0.14);
  ctx.stroke();
  // The yellow sign.
  const sx = x + w * 0.16;
  const sy = y + h * 0.2;
  ctx.fillStyle = '#f2c230';
  ctx.beginPath();
  ctx.moveTo(sx, sy);
  ctx.lineTo(sx + 44, sy + 92);
  ctx.lineTo(sx - 44, sy + 92);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = `700 15px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('WET', sx, sy + 62);
  ctx.fillText('FLOOR', sx, sy + 80);
  ctx.textAlign = 'left';
  // Heel prints: a small heel dot behind a sole, stepping toward the case.
  ctx.fillStyle = 'rgba(35, 30, 28, 0.75)';
  for (let step = 0; step < 6; step += 1) {
    const t = step / 5;
    const px = x + w * (0.3 + t * 0.42) + (step % 2 === 0 ? -9 : 9);
    const py = y + h * (0.9 - t * 0.42);
    ctx.beginPath();
    ctx.ellipse(px, py - 13, 6, 10, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px + 5, py + 6, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#f7f3ec';
  ctx.lineWidth = 6;
  ctx.strokeRect(x, y, w, h);
}

/** The printed face: header band, title, body lines and a small hint. */
export function drawFace(id: string, card: CardText, accent: string): FaceArt {
  const { width, height } = FACE_SIZE;
  const { canvas, ctx } = makeCanvas(width, height);
  const textWidth = width - MARGIN * 2;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, width, 76);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText(id, MARGIN, 53);
  ctx.font = `600 20px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(activeCase.title, width - MARGIN, 49);
  ctx.textAlign = 'left';

  let y = 76 + 52;
  ctx.fillStyle = INK;
  ctx.font = `750 38px ${FONT}`;
  for (const row of wrap(ctx, card.title, textWidth)) {
    ctx.fillText(row, MARGIN, y);
    y += 44;
  }
  y += 6;

  if (card.photo) {
    drawCorridorPhoto(ctx, MARGIN, y, textWidth, 230);
    y += 230 + 42;
  }

  let hiddenX = MARGIN;
  let hiddenY = y;
  ctx.font = `500 29px ${FONT}`;
  card.lines.forEach((line, index) => {
    for (const row of wrap(ctx, line, textWidth)) {
      ctx.fillStyle = INK;
      ctx.fillText(row, MARGIN, y);
      if (index === card.fadedLine) {
        // The thermal print faded here; only a ghost of the digits is left.
        hiddenX = MARGIN + ctx.measureText(`${row} `).width;
        hiddenY = y;
        ctx.fillStyle = FADED;
        ctx.fillText(card.ghostText ?? '··:··', hiddenX, y);
      }
      y += 37;
    }
    y += 12;
  });

  if (card.hint != null) {
    ctx.fillStyle = HINT;
    ctx.font = `italic 500 25px ${FONT}`;
    const rows = wrap(ctx, card.hint, textWidth);
    let hy = height - 30 - (rows.length - 1) * 31;
    for (const row of rows) {
      ctx.fillText(row, MARGIN, hy);
      hy += 31;
    }
  }
  return { canvas, hiddenX, hiddenY };
}

/**
 * The words a 'light' card shows once held up, on a clear canvas: they start
 * where the faded line ends and wrap onto the rows below it.
 */
export function drawHidden(card: CardText, art: FaceArt): HTMLCanvasElement {
  const { canvas, ctx } = makeCanvas(FACE_SIZE.width, FACE_SIZE.height);
  ctx.fillStyle = '#3b1f4a';
  ctx.font = `800 31px ${FONT}`;
  const right = FACE_SIZE.width - MARGIN;
  let x = art.hiddenX;
  let y = art.hiddenY;
  for (const word of (card.hiddenText ?? '').split(' ')) {
    if (x > MARGIN && x + ctx.measureText(word).width > right) {
      x = MARGIN;
      y += 37;
    }
    ctx.fillText(word, x, y);
    x += ctx.measureText(`${word} `).width;
  }
  return canvas;
}

/**
 * The back: the card's colour, its number (or `big`), and any words printed
 * there. `small` replaces the case title under the number.
 */
export function drawBack(
  id: string,
  card: CardText,
  accent: string,
  big = id,
  small = activeCase.title,
): HTMLCanvasElement {
  const { width, height } = BACK_SIZE;
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 4;
  ctx.strokeRect(22, 22, width - 44, height - 44);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  if (card.back == null) {
    ctx.font = `800 120px ${FONT}`;
    ctx.fillText(big, width / 2, height / 2 + 20);
    ctx.font = `600 24px ${FONT}`;
    ctx.fillText(small, width / 2, height / 2 + 80);
    ctx.textAlign = 'left';
    return canvas;
  }

  ctx.font = `700 28px ${FONT}`;
  ctx.fillText(`${id}  BACK`, width / 2, 80);
  // The printing on the back of the ticket itself.
  const paperY = 140;
  const paperH = height - paperY - 120;
  ctx.fillStyle = PAPER;
  roundedRect(ctx, 50, paperY, width - 100, paperH, 14);
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = `800 46px ${FONT}`;
  let y = paperY + 110;
  card.back.forEach((line, index) => {
    if (index === 1) {
      ctx.font = `500 26px ${FONT}`;
    }
    for (const row of wrap(ctx, line, width - 140)) {
      ctx.fillText(row, width / 2, y);
      y += index === 0 ? 70 : 38;
    }
    y += 14;
  });
  ctx.textAlign = 'left';
  return canvas;
}

/** A dark tag with light text, hung above two linked cards. */
export function drawLabel(text: string): HTMLCanvasElement {
  const { width, height } = LABEL_SIZE;
  const { canvas, ctx } = makeCanvas(width, height);
  ctx.fillStyle = 'rgba(29, 26, 23, 0.94)';
  roundedRect(ctx, 4, 4, width - 8, height - 8, 26);
  ctx.fill();
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.fillStyle = '#f7f1e3';
  ctx.font = `600 33px ${FONT}`;
  const rows = wrap(ctx, text, width - 70);
  let y = height / 2 - ((rows.length - 1) * 42) / 2 + 12;
  for (const row of rows) {
    ctx.fillText(row, 35, y);
    y += 42;
  }
  return canvas;
}

/** A head-and-shoulders sketch in the suspect's colours, inside a photo frame. */
function drawPortrait(
  ctx: CanvasRenderingContext2D,
  suspect: SuspectText,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const [background, hair, skin, coat] = suspect.palette;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  const light = ctx.createLinearGradient(0, y, 0, y + h);
  light.addColorStop(0, background);
  light.addColorStop(1, '#4a4644');
  ctx.fillStyle = light;
  ctx.fillRect(x, y, w, h);
  const cx = x + w / 2;
  const ellipse = (ex: number, ey: number, rx: number, ry: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  };
  ellipse(cx, y + h + 20, 175, 125, coat);
  ctx.fillStyle = skin;
  ctx.fillRect(cx - 26, y + h * 0.55, 52, 60);
  if (suspect.hair === 'bob') {
    ellipse(cx, y + 168, 86, 96, hair);
  }
  if (suspect.hair === 'bun') {
    ellipse(cx, y + 62, 32, 30, hair);
  }
  ellipse(cx, y + 128, 66, 58, hair);
  ellipse(cx, y + 160, 60, 74, skin);
  if (suspect.hair === 'bob') {
    ellipse(cx, y + 106, 64, 32, hair);
  }
  ctx.restore();
  ctx.strokeStyle = '#f7f3ec';
  ctx.lineWidth = 10;
  ctx.strokeRect(x, y, w, h);
}

/** A suspect's photo card: portrait, name, role and what they claim. */
export function drawSuspect(suspect: SuspectText): HTMLCanvasElement {
  const { width, height } = FACE_SIZE;
  const { canvas, ctx } = makeCanvas(width, height);
  const textWidth = width - MARGIN * 2;
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);
  drawPortrait(ctx, suspect, MARGIN, MARGIN, textWidth, 320);

  let y = MARGIN + 320 + 58;
  ctx.fillStyle = INK;
  ctx.font = `800 42px ${FONT}`;
  ctx.fillText(suspect.name, MARGIN, y);
  y += 44;
  ctx.font = `500 27px ${FONT}`;
  for (const row of wrap(ctx, suspect.role, textWidth)) {
    ctx.fillText(row, MARGIN, y);
    y += 34;
  }
  y += 14;
  ctx.font = `italic 600 28px ${FONT}`;
  for (const row of wrap(ctx, suspect.statement, textWidth)) {
    ctx.fillText(row, MARGIN, y);
    y += 36;
  }
  ctx.fillStyle = HINT;
  ctx.font = `italic 500 24px ${FONT}`;
  ctx.fillText('Accuse: put this photo in the box.', MARGIN, height - 30);
  return canvas;
}

/** The verdict tag over the box: what happened, then a small footer line. */
export function drawVerdict(
  canvas: HTMLCanvasElement,
  text: string,
  footer: string,
  solved: boolean,
  note = '',
): void {
  const { width, height } = VERDICT_SIZE;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(29, 26, 23, 0.95)';
  roundedRect(ctx, 4, 4, width - 8, height - 8, 28);
  ctx.fill();
  ctx.strokeStyle = solved ? '#c9a227' : '#b3261e';
  ctx.lineWidth = 7;
  ctx.stroke();
  ctx.fillStyle = '#f7f1e3';
  // With the notebook line there is room for three rows: shrink to fit them.
  const maxRows = note === '' ? Infinity : 3;
  let size = 33;
  ctx.font = `650 ${size}px ${FONT}`;
  let rows = wrap(ctx, text, width - 70);
  while (rows.length > maxRows && size > 25) {
    size -= 2;
    ctx.font = `650 ${size}px ${FONT}`;
    rows = wrap(ctx, text, width - 70);
  }
  let y = 62;
  for (const row of rows) {
    ctx.fillText(row, 35, y);
    y += Math.round(size * 1.27);
  }
  ctx.fillStyle = solved ? '#e3c25a' : '#c9beb0';
  ctx.font = `600 26px ${FONT}`;
  ctx.fillText(footer, 35, height - 32);
  if (note !== '') {
    // The notebook line, between the verdict and the clue count.
    ctx.fillStyle = '#c9beb0';
    ctx.fillText(note, 35, height - 70);
  }
}
