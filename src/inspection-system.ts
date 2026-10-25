import {
  CanvasTexture,
  createSystem,
  CylinderGeometry,
  type Entity,
  Grabbed,
  Mesh,
  MeshBasicMaterial,
  type MeshStandardMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  Vector3,
} from '@iwsdk/core';
import { drawLabel } from './card-art.js';
import { CARDS, LINKS } from './case01.js';
import { Evidence } from './case-components.js';

/** Back facing the eyes this much (cosine) counts as turned over. */
const FLIP_DOT = -0.35;
/** Held no lower than this below the eyes counts as up to the light. */
const LIGHT_BELOW_EYES = 0.06;
const LIGHT_REACH = 0.7;
/** Seconds of holding it up before the faded print is fully readable. */
const LIGHT_SECONDS = 0.6;
/** Card centres closer than this, one of them in hand, count as brought together. */
const LINK_DISTANCE = 0.1;
const LABEL_RISE = 0.075;
const GOLD = 0xc9a227;

/**
 * The three ways a player examines evidence with their hands:
 * - turn a 'flip' card over to read its back            → Evidence.flipped
 * - hold a 'light' card up to eye level: the print shows → Evidence.lit
 * - bring two cards of a link together: a red thread and
 *   the clue they make appear above them                 → Evidence.linked
 * A card whose clue is found keeps a gold glow on its backing.
 */
export class InspectionSystem extends createSystem({
  cards: { required: [Evidence] },
}) {
  private head!: Vector3;
  private cardPos!: Vector3;
  private otherPos!: Vector3;
  private axis!: Vector3;
  private yAxis!: Vector3;
  private threads!: Mesh[];
  private labels!: Mesh[];

  init(): void {
    this.head = new Vector3();
    this.cardPos = new Vector3();
    this.otherPos = new Vector3();
    this.axis = new Vector3();
    this.yAxis = new Vector3(0, 1, 0);
    const threadGeometry = new CylinderGeometry(0.0016, 0.0016, 1, 6);
    const threadMaterial = new MeshBasicMaterial({ color: 0xb3261e });
    const labelGeometry = new PlaneGeometry(0.2, 0.05);
    this.threads = [];
    this.labels = [];
    for (const link of LINKS) {
      const thread = new Mesh(threadGeometry, threadMaterial);
      thread.visible = false;
      this.world.createTransformEntity(thread);
      this.threads.push(thread);
      const texture = new CanvasTexture(drawLabel(link.clue));
      texture.colorSpace = SRGBColorSpace;
      const label = new Mesh(
        labelGeometry,
        new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
      );
      label.visible = false;
      this.world.createTransformEntity(label);
      this.labels.push(label);
    }
  }

  update(delta: number): void {
    this.player.head.getWorldPosition(this.head);
    for (const entity of this.queries.cards.entities) {
      if (entity.hasComponent(Grabbed)) {
        this.examineHeld(entity, delta);
      }
    }
    for (let index = 0; index < LINKS.length; index += 1) {
      this.updateLink(index);
    }
  }

  private examineHeld(entity: Entity, delta: number): void {
    const object = entity.object3D;
    const card = CARDS[entity.getValue(Evidence, 'evidenceId') as string];
    if (object == null || card == null) {
      return;
    }
    object.getWorldPosition(this.cardPos);
    if (card.reveal === 'flip' && entity.getValue(Evidence, 'flipped') !== true) {
      // The card's face points along its local +Y.
      this.axis.setFromMatrixColumn(object.matrixWorld, 1).normalize();
      this.otherPos.subVectors(this.head, this.cardPos).normalize();
      if (this.axis.dot(this.otherPos) < FLIP_DOT) {
        entity.setValue(Evidence, 'flipped', true);
        this.glow(entity);
      }
    } else if (card.reveal === 'light' && entity.getValue(Evidence, 'lit') !== true) {
      const hidden = object.userData.hidden as MeshStandardMaterial | undefined;
      const raised =
        this.cardPos.y > this.head.y - LIGHT_BELOW_EYES &&
        this.cardPos.distanceTo(this.head) < LIGHT_REACH;
      if (hidden != null && raised) {
        hidden.opacity = Math.min(1, hidden.opacity + delta / LIGHT_SECONDS);
        if (hidden.opacity >= 1) {
          entity.setValue(Evidence, 'lit', true);
          this.glow(entity);
        }
      }
    }
  }

  private updateLink(index: number): void {
    const link = LINKS[index];
    const a = this.findCard(link.a);
    const b = this.findCard(link.b);
    const aObject = a?.object3D;
    const bObject = b?.object3D;
    if (a == null || b == null || aObject == null || bObject == null) {
      return;
    }
    aObject.getWorldPosition(this.cardPos);
    bObject.getWorldPosition(this.otherPos);
    // Both flags set means this pair was linked (each case-01 card has one link).
    let found =
      a.getValue(Evidence, 'linked') === true && b.getValue(Evidence, 'linked') === true;
    if (
      !found &&
      (a.hasComponent(Grabbed) || b.hasComponent(Grabbed)) &&
      this.cardPos.distanceTo(this.otherPos) < LINK_DISTANCE
    ) {
      a.setValue(Evidence, 'linked', true);
      b.setValue(Evidence, 'linked', true);
      this.glow(a);
      this.glow(b);
      found = true;
    }
    if (!found) {
      return;
    }

    const thread = this.threads[index];
    this.axis.subVectors(this.otherPos, this.cardPos);
    const length = this.axis.length();
    thread.visible = length > 0.0005;
    if (thread.visible) {
      thread.position.addVectors(this.cardPos, this.otherPos).multiplyScalar(0.5);
      thread.position.y += 0.004;
      thread.quaternion.setFromUnitVectors(this.yAxis, this.axis.divideScalar(length));
      thread.scale.set(1, length, 1);
    }

    const label = this.labels[index];
    label.visible = true;
    label.position.addVectors(this.cardPos, this.otherPos).multiplyScalar(0.5);
    label.position.y += LABEL_RISE;
    label.rotation.set(
      0,
      Math.atan2(this.head.x - label.position.x, this.head.z - label.position.z),
      0,
    );
  }

  private findCard(evidenceId: string): Entity | undefined {
    for (const entity of this.queries.cards.entities) {
      if (entity.getValue(Evidence, 'evidenceId') === evidenceId) {
        return entity;
      }
    }
    return undefined;
  }

  private glow(entity: Entity): void {
    const rim = entity.object3D?.userData.rim as MeshStandardMaterial | undefined;
    rim?.emissive.setHex(GOLD);
    if (rim != null) {
      rim.emissiveIntensity = 0.45;
    }
  }
}
