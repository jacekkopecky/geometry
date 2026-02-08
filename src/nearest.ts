import { isPoint, type Circle, type Point, type Vector } from './types.js';

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

export function dist(p1: Point | Circle, p2: Point | Circle) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

export function getCircleIntersections(c: Circle, circles: Circle[]): Point[] {
  const retval: Point[] = [];

  for (const c2 of circles) {
    retval.push(...getIntersectionsOfTwoCircles(c, c2));
  }

  return retval;
}

function getIntersectionsOfTwoCircles(c1: Circle, c2: Circle): Point[] {
  const d = dist(c1, c2);
  const r1 = c1[2] ?? 0;
  const r2 = c2[2] ?? 0;

  // if the circles are too far (or just touching), return no points
  if (d >= r1 + r2) return [];

  // if one circle is within the other (or just touching), return no points
  if (d + r1 < r2 || d + r2 < r1) return [];

  // find intersection points using method from https://mathworld.wolfram.com/Circle-CircleIntersection.html
  // x is how far from center of c1 is the chord between the intersection points
  // y is how far from the line c1-c2 those points are
  const x = (d ** 2 - r2 ** 2 + r1 ** 2) / (2 * d);
  const y = Math.sqrt(r1 ** 2 - x ** 2);

  // [x,±y] is in the rotated frame of reference where c1 is at [0,0] and c2 is at [d,0]

  // go along v=c2-c1 for x (this is the center of the chord, ch), then along an orthogonal vector
  const v = vect(c1, c2);
  const ch = vAlong(c1, v, x);
  const orth = vOrth(v);

  return [vAlong(ch, orth, y), vAlong(ch, orth, -y)];
}

function vect(p1: Circle, p2: Circle): Vector {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function vAlong(start: Point | Circle, v: Vector, d: number): Point {
  const normV = Math.sqrt(v[0] ** 2 + v[1] ** 2);
  return [start[0] + (v[0] / normV) * d, start[1] + (v[1] / normV) * d];
}

function vOrth(v: Vector): Vector {
  return [v[1], -v[0]];
}
