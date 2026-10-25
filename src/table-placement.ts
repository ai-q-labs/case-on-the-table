import { createSystem, Grabbed, Vector3, XRPlane } from '@iwsdk/core';
import { EvidenceBox } from './case-components.js';
import { fitOnTable, type Spot } from './table-fit.js';

// Half the tray's footprint plus a little room, so it never hangs over the edge.
const EDGE_ROOM = 0.015;
const BOX_HALF_WIDTH = 0.2 + EDGE_ROOM;
const BOX_HALF_DEPTH = 0.14 + EDGE_ROOM;
// A table where the tray does not fit ranks behind every table where it does.
const NO_FIT_PENALTY = 100;

/**
 * Puts the evidence box on the player's real table.
 *
 * Scene understanding turns every detected surface into an entity with an
 * XRPlane component. For each horizontal plane labelled "table", the box goes
 * to the edge nearest the player where it lies fully inside the table's real
 * outline (round tables included), turned to face the player. The nearest such
 * table wins; then the box stays put. With no table detected the box keeps its
 * authored spot in front of a seated player.
 */
export class TablePlacementSystem extends createSystem({
  planes: { required: [XRPlane] },
  boxes: { required: [EvidenceBox], excluded: [Grabbed] },
}) {
  private head!: Vector3;
  private local!: Vector3;
  private spot!: Vector3;
  private best!: Vector3;
  private fit!: Spot;
  private bestFits = false;

  init(): void {
    this.head = new Vector3();
    this.local = new Vector3();
    this.spot = new Vector3();
    this.best = new Vector3();
    this.fit = { x: 0, z: 0 };
  }

  update(): void {
    for (const box of this.queries.boxes.entities) {
      if (box.getValue(EvidenceBox, 'placedOnTable')) {
        continue;
      }
      const boxObject = box.object3D;
      if (boxObject == null || !this.findTableSpot()) {
        continue;
      }
      boxObject.parent?.worldToLocal(this.best);
      boxObject.position.copy(this.best);
      boxObject.rotation.set(
        0,
        Math.atan2(this.head.x - this.best.x, this.head.z - this.best.z),
        0,
      );
      box.setValue(EvidenceBox, 'fitsTable', this.bestFits);
      box.setValue(EvidenceBox, 'placedOnTable', true);
    }
  }

  /** Fills `best` and `bestFits` with the nearest table spot; false if none. */
  private findTableSpot(): boolean {
    this.player.head.getWorldPosition(this.head);
    let bestScore = Infinity;
    for (const plane of this.queries.planes.entities) {
      const xrPlane = plane.getValue(XRPlane, '_plane') as
        | globalThis.XRPlane
        | undefined;
      const planeObject = plane.object3D;
      if (
        xrPlane == null ||
        planeObject == null ||
        xrPlane.orientation !== 'horizontal' ||
        xrPlane.semanticLabel !== 'table'
      ) {
        continue;
      }
      // The outline is in the plane's own space, which is planeObject's.
      planeObject.updateWorldMatrix(true, false);
      this.local.copy(this.head);
      planeObject.worldToLocal(this.local);
      const fits = fitOnTable(
        xrPlane.polygon,
        this.local.x,
        this.local.z,
        BOX_HALF_WIDTH,
        BOX_HALF_DEPTH,
        this.fit,
      );
      this.spot.set(this.fit.x, 0, this.fit.z);
      planeObject.localToWorld(this.spot);
      const dx = this.spot.x - this.head.x;
      const dz = this.spot.z - this.head.z;
      const score = Math.hypot(dx, dz) + (fits ? 0 : NO_FIT_PENALTY);
      if (score < bestScore) {
        bestScore = score;
        this.best.copy(this.spot);
        this.bestFits = fits;
      }
    }
    return bestScore < Infinity;
  }
}
