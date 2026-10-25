import {
  CanvasTexture,
  createSystem,
  type Entity,
  Grabbed,
  Mesh,
  MeshBasicMaterial,
  type MeshStandardMaterial,
  type Object3D,
  PlaneGeometry,
  type Quaternion,
  SRGBColorSpace,
  Vector3,
} from '@iwsdk/core';
import { drawVerdict, VERDICT_SIZE } from './card-art.js';
import { CARDS, LINKS, SUSPECTS } from './case01.js';
import { Evidence, EvidenceBox, Suspect } from './case-components.js';

// The inside of the tray, in the box's own space (origin at its bottom face).
const TRAY_HALF_WIDTH = 0.16;
const TRAY_HALF_DEPTH = 0.105;
const TRAY_TOP = 0.1;
const VERDICT_RISE = 0.24;
const GOLD = 0xc9a227;

/**
 * Accusing a suspect: let go of their photo inside the tray.
 * - The culprit: EvidenceBox.solved, and a gold verdict tag over the box with
 *   the clues found and the wrong guesses.
 * - Anyone else: EvidenceBox.wrongGuesses goes up, a red tag says why they are
 *   innocent, and the photo goes back to its place on the rim to pick again.
 * Each photo remembers its place on the rim when it first appears.
 */
export class AccusationSystem extends createSystem({
  boxes: { required: [EvidenceBox] },
  cards: { required: [Evidence] },
  suspects: { required: [Suspect] },
  held: { required: [Suspect, Grabbed] },
}) {
  private head!: Vector3;
  private local!: Vector3;
  private boxPos!: Vector3;
  private released!: Entity[];
  private verdict!: Mesh;
  private verdictCanvas!: HTMLCanvasElement;
  private verdictTexture!: CanvasTexture;

  init(): void {
    this.head = new Vector3();
    this.local = new Vector3();
    this.boxPos = new Vector3();
    this.released = [];
    this.verdictCanvas = document.createElement('canvas');
    this.verdictCanvas.width = VERDICT_SIZE.width;
    this.verdictCanvas.height = VERDICT_SIZE.height;
    this.verdictTexture = new CanvasTexture(this.verdictCanvas);
    this.verdictTexture.colorSpace = SRGBColorSpace;
    this.verdict = new Mesh(
      new PlaneGeometry(0.24, 0.08),
      new MeshBasicMaterial({ map: this.verdictTexture, transparent: true, depthWrite: false }),
    );
    this.verdict.visible = false;
    this.world.createTransformEntity(this.verdict);

    this.queries.suspects.subscribe('qualify', (entity) => this.rememberHome(entity));
    for (const entity of this.queries.suspects.entities) {
      this.rememberHome(entity);
    }
    // Judge on the next update, once the grab system has let go of the card.
    this.queries.held.subscribe('disqualify', (entity) => {
      this.released.push(entity);
    });
  }

  update(): void {
    let box: Entity | undefined;
    for (const entity of this.queries.boxes.entities) {
      box = entity;
      break;
    }
    const boxObject = box?.object3D;
    if (box == null || boxObject == null) {
      return;
    }
    while (this.released.length > 0) {
      this.judge(this.released.pop() as Entity, box, boxObject);
    }
    if (this.verdict.visible) {
      this.player.head.getWorldPosition(this.head);
      boxObject.getWorldPosition(this.boxPos);
      this.verdict.position.copy(this.boxPos);
      this.verdict.position.y += VERDICT_RISE;
      this.verdict.rotation.set(
        0,
        Math.atan2(this.head.x - this.boxPos.x, this.head.z - this.boxPos.z),
        0,
      );
    }
  }

  private rememberHome(entity: Entity): void {
    const object = entity.object3D;
    if (object == null || object.userData.home != null) {
      return;
    }
    object.userData.home = object.position.clone();
    object.userData.homeQuaternion = object.quaternion.clone();
  }

  private judge(entity: Entity, box: Entity, boxObject: Object3D): void {
    const object = entity.object3D;
    const suspect = SUSPECTS[entity.getValue(Suspect, 'suspectId') as string];
    if (
      object == null ||
      suspect == null ||
      entity.hasComponent(Grabbed) ||
      box.getValue(EvidenceBox, 'solved') === true
    ) {
      return;
    }
    object.getWorldPosition(this.local);
    boxObject.worldToLocal(this.local);
    const inTray =
      Math.abs(this.local.x) < TRAY_HALF_WIDTH &&
      Math.abs(this.local.z) < TRAY_HALF_DEPTH &&
      this.local.y > -0.02 &&
      this.local.y < TRAY_TOP;
    if (!inTray) {
      return;
    }
    entity.setValue(Suspect, 'accused', true);
    const wrong = box.getValue(EvidenceBox, 'wrongGuesses') as number;

    if (suspect.culprit) {
      box.setValue(EvidenceBox, 'solved', true);
      this.show(
        suspect.verdict,
        `Clues found ${this.cluesFound()} of ${this.cluesTotal()}  ·  Wrong guesses ${wrong}`,
        true,
      );
      const rim = object.userData.rim as MeshStandardMaterial | undefined;
      rim?.emissive.setHex(GOLD);
      if (rim != null) {
        rim.emissiveIntensity = 0.45;
      }
      return;
    }

    box.setValue(EvidenceBox, 'wrongGuesses', wrong + 1);
    this.show(suspect.verdict, 'Pick again: the photo is back on the rim.', false);
    const home = object.userData.home as Vector3 | undefined;
    const homeQuaternion = object.userData.homeQuaternion as Quaternion | undefined;
    if (home != null && homeQuaternion != null) {
      object.position.copy(home);
      object.quaternion.copy(homeQuaternion);
    }
  }

  private show(text: string, footer: string, solved: boolean): void {
    drawVerdict(this.verdictCanvas, text, footer, solved);
    this.verdictTexture.needsUpdate = true;
    this.verdict.visible = true;
  }

  /** Clues a case hides: every flip or light card, and every link. */
  private cluesTotal(): number {
    let total = LINKS.length;
    for (const id in CARDS) {
      if (CARDS[id].reveal !== 'none') {
        total += 1;
      }
    }
    return total;
  }

  private cluesFound(): number {
    let found = 0;
    for (const entity of this.queries.cards.entities) {
      if (entity.getValue(Evidence, 'flipped') === true) {
        found += 1;
      }
      if (entity.getValue(Evidence, 'lit') === true) {
        found += 1;
      }
    }
    for (const link of LINKS) {
      if (this.isLinked(link.a) && this.isLinked(link.b)) {
        found += 1;
      }
    }
    return found;
  }

  private isLinked(evidenceId: string): boolean {
    for (const entity of this.queries.cards.entities) {
      if (entity.getValue(Evidence, 'evidenceId') === evidenceId) {
        return entity.getValue(Evidence, 'linked') === true;
      }
    }
    return false;
  }
}
