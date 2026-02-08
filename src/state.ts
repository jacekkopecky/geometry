import { getCircleIntersections } from './nearest.js';
import type { Circle, Point } from './types.js';

const MIN_SCALE = 1;
const MAX_SCALE = 100000;
const DEFAULT_SCALE = 80 * window.devicePixelRatio;

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
  _scale: DEFAULT_SCALE,
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

export let currentCursor: Point | undefined = undefined;
export let currentUnfinished: Circle | undefined = undefined;

loadState();

export function setCursorPosition(p?: Point) {
  currentCursor = p;
}

export function addFromUnfinished() {
  if (currentUnfinished) {
    const intersections = getCircleIntersections(currentUnfinished, circles);
    circles.push(currentUnfinished, ...intersections);
  }
  saveState();
  currentUnfinished = undefined;
}

export function setUnfinished(c?: Circle) {
  currentUnfinished = c;
}

export function resetView() {
  viewParams._scale = DEFAULT_SCALE;
  viewParams._offset = [0, 0];
  currentUnfinished = undefined;
  saveState();
}

export function resetCircles(arr: Circle[]) {
  circles.length = 0;
  circles.push(...arr);
  resetView();
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
