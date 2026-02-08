import { isPoint, type Circle, type Point } from './types.js';

export function findNearestPoint(
  pos: Point,
  circles: readonly Circle[],
  threshold: number,
): Point | undefined {
  const points = circles.filter((c) => isPoint(c));

  let minDist = threshold;
  let closest;

  for (const p of points) {
    const d = dist(p, pos);
    if (d < minDist) {
      minDist = d;
      closest = p;
    }
  }

  return closest;
}

export function dist(p1: Point, p2: Point) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}
