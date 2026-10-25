import {
  CanvasTexture,
  createSystem,
  type Entity,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from '@iwsdk/core';
import { drawBack, drawFace, drawHidden, drawSuspect, type FaceArt } from './card-art.js';
import { activeCase, CASES } from './cases/index.js';
import type { CardText } from './cases/types.js';
import { Evidence, Suspect } from './case-components.js';
import { browserStorage, dayKey, loadNotebook, solvedCount, streak } from './notebook.js';
import {
  CARD_DEPTH,
  CARD_FACE_SCALE_X,
  CARD_FACE_SCALE_Z,
  CARD_THICKNESS,
  CARD_WIDTH,
} from './scene-assets/evidence.scene-asset.js';

// BoxGeometry face order: +x, -x, +y, -y, +z, -z.
const TOP = 2;
const BOTTOM = 3;

// A suspect's back has no printing of its own: initials and a caption.
const PLAIN_BACK: CardText = { title: '', lines: [], reveal: 'none' };

/** The brief, with the detective notebook printed on its back. */
function withNotebook(card: CardText): CardText {
  const notebook = loadNotebook(browserStorage());
  const ids = CASES.map((file) => file.id);
  const days = streak(notebook.days, dayKey(new Date()));
  return {
    ...card,
    hint: card.hint ?? 'Your detective notebook is on the back.',
    back: [
      'NOTEBOOK',
      `Solved ${solvedCount(notebook, ids)} of ${ids.length}`,
      ids.map((id) => `${id} ${notebook.solved[id] != null ? '✓' : '·'}`).join('   '),
      `Streak: ${days} ${days === 1 ? 'day' : 'days'}`,
    ],
  };
}

function canvasTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/**
 * Prints each card once it appears: the face on top of the pale layer, the
 * back under the coloured backing, and for a 'light' card a clear layer
 * holding the faded words (InspectionSystem fades it in). Suspect photo cards
 * get a portrait face and their initials on the back. The brief's back is the
 * detective notebook: cases solved in this browser and the streak of days.
 *
 * Leaves on the card's object3D.userData:
 * - `rim`: the card's own backing material, which glows once a clue is found
 * - `hidden`: the faded words' material (light cards only), opacity 0 to start
 */
export class CardFaceSystem extends createSystem({
  cards: { required: [Evidence] },
  suspects: { required: [Suspect] },
}) {
  init(): void {
    this.queries.cards.subscribe('qualify', (entity) => this.print(entity));
    this.queries.suspects.subscribe('qualify', (entity) => this.printSuspect(entity));
    for (const entity of this.queries.cards.entities) {
      this.print(entity);
    }
    for (const entity of this.queries.suspects.entities) {
      this.printSuspect(entity);
    }
  }

  private print(entity: Entity): void {
    const id = entity.getValue(Evidence, 'evidenceId') as string;
    const root = entity.object3D;
    if (activeCase.cards[id] == null || root == null || root.userData.printed === true) {
      return;
    }
    const card = id === 'BRIEF' ? withNotebook(activeCase.cards[id]) : activeCase.cards[id];
    entity.setValue(Evidence, 'label', card.title);
    let art: FaceArt | undefined;
    this.dress(
      entity,
      (accent) => {
        art = drawFace(id, card, accent);
        return art.canvas;
      },
      (accent) => drawBack(id, card, accent),
    );
    if (card.reveal === 'light' && art != null) {
      const hidden = new MeshStandardMaterial({
        map: canvasTexture(drawHidden(card, art)),
        roughness: 0.9,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const layer = new Mesh(
        new PlaneGeometry(CARD_WIDTH * CARD_FACE_SCALE_X, CARD_DEPTH * CARD_FACE_SCALE_Z),
        hidden,
      );
      layer.name = 'card-hidden';
      layer.rotation.x = -Math.PI / 2;
      layer.position.y = CARD_THICKNESS + 0.0004;
      root.add(layer);
      root.userData.hidden = hidden;
    }
  }

  private printSuspect(entity: Entity): void {
    const suspect = activeCase.suspects[entity.getValue(Suspect, 'suspectId') as string];
    if (suspect == null) {
      return;
    }
    entity.setValue(Suspect, 'name', suspect.name);
    const initials = suspect.name
      .split(' ')
      .map((word) => word[0])
      .join('');
    this.dress(
      entity,
      () => drawSuspect(suspect),
      (accent) =>
        drawBack('', PLAIN_BACK, accent, initials, `SUSPECT · ${suspect.name.toUpperCase()}`),
    );
  }

  /** Swaps one card's plain layers for printed ones, once. */
  private dress(
    entity: Entity,
    face: (accent: string) => HTMLCanvasElement,
    back: (accent: string) => HTMLCanvasElement,
  ): void {
    const root = entity.object3D;
    const faceMesh = root?.getObjectByName('card-face');
    const backMesh = root?.getObjectByName('card-back');
    if (
      root == null ||
      root.userData.printed === true ||
      !(faceMesh instanceof Mesh) ||
      !(backMesh instanceof Mesh)
    ) {
      return;
    }
    const paper = faceMesh.material as MeshStandardMaterial;
    // A copy per card, so one card's glow never lights up another.
    const rim = (backMesh.material as MeshStandardMaterial).clone();
    const accent = `#${rim.color.getHexString()}`;

    const facePrint = new MeshStandardMaterial({
      map: canvasTexture(face(accent)),
      roughness: 0.9,
    });
    const faceMaterials = [paper, paper, paper, paper, paper, paper];
    faceMaterials[TOP] = facePrint;
    faceMesh.material = faceMaterials;

    const backPrint = new MeshStandardMaterial({
      map: canvasTexture(back(accent)),
      roughness: 0.6,
    });
    const backMaterials = [rim, rim, rim, rim, rim, rim];
    backMaterials[BOTTOM] = backPrint;
    backMesh.material = backMaterials;
    root.userData.rim = rim;
    root.userData.printed = true;
  }
}
