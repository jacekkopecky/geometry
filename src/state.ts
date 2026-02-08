import type { Circle, Point } from './types.js';

const MIN_SCALE = 1;
const MAX_SCALE = 100000;

const LOCAL_STORAGE_KEY = 'geometry-state';

interface ViewParams {
  scale: number;
  readonly offset: Point;
  moveOffset(x: number, y: number): void;

  // internal
  _scale: number;
  _offset: Point;
}

export const viewParams: ViewParams = {
  _scale: 80 * window.devicePixelRatio,
  get scale() {
    return this._scale;
  },
  set scale(n) {
    this._scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));
    saveState();
  },

  _offset: [0, 0] as Point,
  get offset() {
    return this._offset;
  },

  moveOffset(x, y) {
    this._offset = [this._offset[0] + x, this._offset[1] + y];
    saveState();
  },
};

export const circles: Circle[] = [
  [0, 0, 1],
  [0, 0],
];

loadState();

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
    saveState();
    resetCurrents();
  } else {
    currentStartPoint = p;
    currentEndPoint = undefined;
  }
}

export function setEndPoint(p: Point) {
  if (currentStartPoint) currentEndPoint = p;
}

function saveState() {
  const state = {
    _scale: viewParams._scale,
    _offset: viewParams._offset,
    circles,
  };

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const stateJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stateJson) {
      const state = JSON.parse(stateJson);
      viewParams._scale = state._scale;
      viewParams._offset = state._offset;
      circles.length = 0;
      circles.push(...state.circles);
    }
  } catch (e) {
    console.warn(`cannot load ${LOCAL_STORAGE_KEY}`, e);
  }
}
