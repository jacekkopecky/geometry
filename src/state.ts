import type { Circle, Point } from './types.js';

const MIN_SCALE = 1;
const MAX_SCALE = 100000;

export const viewParams = {
  _scale: 80 * window.devicePixelRatio,
  get scale() {
    return this._scale;
  },
  set scale(n) {
    this._scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));
  },

  offset: [0, 0] as Point,
};

export const circles: Circle[] = [
  [0, 0, 1],
  [0, 0],
];

export let currentCursor: Point | undefined = undefined;
export let currentStartPoint: Point | undefined = undefined;
export let currentEndPoint: Point | undefined = undefined;

export function setCursorPosition(p?: Point) {
  currentCursor = p;
}

export function resetCurrents() {
  currentStartPoint = undefined;
  currentEndPoint = undefined;
}

export function addPoint(p: Point) {
  if (currentStartPoint) {
    if (currentEndPoint) {
      // a circle added
      const [x, y] = currentStartPoint;
      const [x2, y2] = currentEndPoint;
      circles.push([x, y, Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2)]);
    } else {
      // a single point added
      circles.push(p);
    }
    resetCurrents();
  } else {
    currentStartPoint = p;
    currentEndPoint = undefined;
  }
}

export function setEndPoint(p: Point) {
  if (currentStartPoint) currentEndPoint = p;
}
