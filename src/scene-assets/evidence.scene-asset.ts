import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from '@iwsdk/core';

/**
 * The evidence box and the evidence cards, built in code so the app downloads
 * no models. Sizes are real-world metres: the box fits on a desk in front of a
 * seated player, and every card stays within reach (a 2 ft radius).
 *
 * Origins sit at the bottom face, so a node's Y is its contact height.
 */

const BOX_WIDTH = 0.34;
const BOX_DEPTH = 0.24;
const BOX_WALL = 0.012;
const BOX_HEIGHT = 0.05;

export const CARD_WIDTH = 0.085;
export const CARD_THICKNESS = 0.004;
export const CARD_DEPTH = 0.12;

const woodMaterial = new MeshStandardMaterial({
  color: 0x5a3b26,
  roughness: 0.8,
});
const feltMaterial = new MeshStandardMaterial({
  color: 0x1f3a2e,
  roughness: 1,
});

function slab(
  width: number,
  height: number,
  depth: number,
  material: MeshStandardMaterial,
  x: number,
  y: number,
  z: number,
): Mesh {
  const mesh = new Mesh(new BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  return mesh;
}

/** An open wooden tray lined with green felt. */
export function createEvidenceBox(): Group {
  const root = new Group();
  const halfW = BOX_WIDTH / 2;
  const halfD = BOX_DEPTH / 2;
  const wallY = BOX_HEIGHT / 2;
  root.add(slab(BOX_WIDTH, BOX_WALL, BOX_DEPTH, woodMaterial, 0, BOX_WALL / 2, 0));
  root.add(
    slab(BOX_WIDTH - BOX_WALL * 2, 0.002, BOX_DEPTH - BOX_WALL * 2, feltMaterial, 0, BOX_WALL + 0.001, 0),
  );
  root.add(slab(BOX_WIDTH, BOX_HEIGHT, BOX_WALL, woodMaterial, 0, wallY, -halfD + BOX_WALL / 2));
  root.add(slab(BOX_WIDTH, BOX_HEIGHT, BOX_WALL, woodMaterial, 0, wallY, halfD - BOX_WALL / 2));
  root.add(slab(BOX_WALL, BOX_HEIGHT, BOX_DEPTH, woodMaterial, -halfW + BOX_WALL / 2, wallY, 0));
  root.add(slab(BOX_WALL, BOX_HEIGHT, BOX_DEPTH, woodMaterial, halfW - BOX_WALL / 2, wallY, 0));
  return root;
}

export const CARD_FACE_SCALE_X = 0.88;
export const CARD_FACE_SCALE_Z = 0.9;

/**
 * One evidence card lying flat: a pale face on a coloured backing. The
 * printing is added at runtime (CardFaceSystem), which finds the two layers
 * by name: 'card-face' on top and 'card-back' underneath.
 */
export function createEvidenceCard(backColor: number): Group {
  const root = new Group();
  const back = new MeshStandardMaterial({ color: backColor, roughness: 0.6 });
  const face = new MeshStandardMaterial({ color: 0xf2ece0, roughness: 0.9 });
  const backing = slab(CARD_WIDTH, CARD_THICKNESS * 0.6, CARD_DEPTH, back, 0, CARD_THICKNESS * 0.3, 0);
  backing.name = 'card-back';
  const print = slab(
    CARD_WIDTH * CARD_FACE_SCALE_X,
    CARD_THICKNESS * 0.4,
    CARD_DEPTH * CARD_FACE_SCALE_Z,
    face,
    0,
    CARD_THICKNESS * 0.8,
    0,
  );
  print.name = 'card-face';
  root.add(backing, print);
  return root;
}
