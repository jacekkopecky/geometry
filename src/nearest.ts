import { isPoint, type Circle, type Point } from './types.js';

export function findNearestPoint(
  pos: Point,
  circles: readonly Circle[],
  threshold: number,
): Point | undefined {
  const point = nearestOnlyPoint(pos, circles, threshold);
  if (point) return point;

  const circle = nearestPointOnCircles(pos, circles, threshold);
  if (circle) return circle;

  return undefined;
}

function nearestOnlyPoint(pos: Point, circles: readonly Circle[], threshold: number) {
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

function nearestPointOnCircles(pos: Point, circlesAndPoints: readonly Circle[], threshold: number) {
  const circles = circlesAndPoints.filter((c) => !isPoint(c));

  let minDist = threshold;
  let closest;

  for (const c of circles) {
    const point = nearestPointOnCircle(pos, c);
    const d = point ? dist(point, pos) : Infinity;
    if (d < minDist) {
      minDist = d;
      closest = point;
    }
  }

  return closest;
}

function nearestPointOnCircle(p: Point, c: Circle): Point | undefined {
  if (p[0] === c[0] && p[1] === c[1]) return undefined;

  const a = Math.atan2(p[1] - c[1], p[0] - c[0]);
  const r = c[2] || 0;
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
}

export function dist(p1: Point, p2: Point) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}
