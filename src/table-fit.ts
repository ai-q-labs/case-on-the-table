/**
 * Fitting a rectangular tray onto a real table's outline. Pure geometry on
 * the table plane's own x/z (no DOM, no ECS), so it works the same for
 * square, round and odd-shaped tables.
 */

export interface PlanePoint {
  readonly x: number;
  readonly z: number;
}

export interface Spot {
  x: number;
  z: number;
}

const WALK_STEPS = 64;

/** Even-odd test: is (x, z) inside the outline? */
export function insidePolygon(polygon: ArrayLike<PlanePoint>, x: number, z: number): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if (a.z > z !== b.z > z && x < ((b.x - a.x) * (z - a.z)) / (b.z - a.z) + a.x) {
      inside = !inside;
    }
  }
  return inside;
}

/**
 * Is the whole tray inside, centred at (x, z) with its depth axis along the
 * unit vector (fx, fz)? Checks the corners and the middle of each side.
 */
function trayInside(
  polygon: ArrayLike<PlanePoint>,
  x: number,
  z: number,
  fx: number,
  fz: number,
  halfWidth: number,
  halfDepth: number,
): boolean {
  for (let along = -1; along <= 1; along += 1) {
    for (let side = -1; side <= 1; side += 1) {
      if (along === 0 && side === 0) {
        continue;
      }
      const px = x + fx * halfDepth * along - fz * halfWidth * side;
      const pz = z + fz * halfDepth * along + fx * halfWidth * side;
      if (!insidePolygon(polygon, px, pz)) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Finds where the tray goes: walking from the player toward the middle of the
 * table, the first spot where the tray, turned to face the player, lies fully
 * inside the outline. That is the table edge nearest the player. Writes the
 * spot to `out`; returns false (spot = the middle) when the tray never fits.
 */
export function fitOnTable(
  polygon: ArrayLike<PlanePoint>,
  playerX: number,
  playerZ: number,
  halfWidth: number,
  halfDepth: number,
  out: Spot,
): boolean {
  let middleX = 0;
  let middleZ = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    middleX += polygon[i].x;
    middleZ += polygon[i].z;
  }
  middleX /= Math.max(1, polygon.length);
  middleZ /= Math.max(1, polygon.length);
  out.x = middleX;
  out.z = middleZ;
  if (polygon.length < 3) {
    return false;
  }
  for (let step = 0; step <= WALK_STEPS; step += 1) {
    const t = step / WALK_STEPS;
    const x = playerX + (middleX - playerX) * t;
    const z = playerZ + (middleZ - playerZ) * t;
    let fx = playerX - x;
    let fz = playerZ - z;
    const length = Math.hypot(fx, fz);
    if (length < 1e-6) {
      fx = 0;
      fz = 1;
    } else {
      fx /= length;
      fz /= length;
    }
    if (trayInside(polygon, x, z, fx, fz, halfWidth, halfDepth)) {
      out.x = x;
      out.z = z;
      return true;
    }
  }
  return false;
}
