import { canvas, draw, getCursorCoords } from './canvas.js';
import { dist } from './nearest.js';
import {
  addFromUnfinished,
  resetCircles,
  resetView,
  setCursorPosition,
  setUnfinished,
  viewParams,
} from './state.js';
import type { Circle, Point } from './types.js';

// a move shorter than this time in milliseconds counts as a click
const MIN_MOVE_TIME_MS = 100;

// variables for the workflow of selecting points that define a circle
let currentStartPoint: Point | undefined;
let currentEndPoint: Point | undefined;

// variables for dragging the canvas
let currentMouseStart: Point | undefined = undefined;
let currentMouseMoving = false;
let currentMouseMoveMinTime = 0;

window.addEventListener('load', setUpListeners);

function setUpListeners() {
  canvas.addEventListener('wheel', mouseZoom, { passive: false });
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mouseleave', mouseLeave);
  document.addEventListener('keydown', keyDown);

  const resetButtons = document.querySelectorAll('button.reset');
  for (const btn of resetButtons) {
    btn.addEventListener('click', resetCanvasData);
  }
}

function mouseZoom(e: WheelEvent) {
  e.stopPropagation();
  e.preventDefault();

  const zoomSpeed = 1 / 200;
  const max = 20;

  if (e.deltaY) {
    const [oldX, oldY] = getCursorCoords(e);

    const delta = e.deltaY < -max ? -max : e.deltaY > max ? max : e.deltaY;
    viewParams.scale *= 1 - delta * zoomSpeed;

    const [newX, newY] = getCursorCoords(e);
    viewParams.moveOffset(newX - oldX, newY - oldY);

    draw();
  }
}

function mouseDown(e: MouseEvent) {
  currentMouseStart = getCursorCoords(e);
  currentMouseMoveMinTime = Date.now() + MIN_MOVE_TIME_MS;
}

function addPoint(p: Point) {
  if (currentStartPoint) {
    addFromUnfinished();
    resetCurrents();
  } else {
    currentStartPoint = p;
    currentEndPoint = undefined;
    updateUnfinished();
  }
}

function updateUnfinished() {
  if (currentStartPoint && currentEndPoint) {
    // a circle added
    const [x, y] = currentStartPoint;
    const c: Circle = [x, y, dist(currentStartPoint, currentEndPoint)];
    setUnfinished(c);
  } else {
    // a single point or nothing
    setUnfinished(currentStartPoint);
  }
}

function mouseUp(e: MouseEvent) {
  if (currentMouseStart && !currentMouseMoving) {
    // clicked without a move
    const snap = !e.shiftKey;
    addPoint(getCursorCoords(e, snap));
    draw();
  } else {
    draw();
  }
  currentMouseStart = undefined;
  currentMouseMoving = false;
}

function mouseMove(e: MouseEvent) {
  if (currentMouseStart) {
    // we're dragging the canvas

    // ignore the first MIN_MOVE_TIME_MS of a move
    if (Date.now() < currentMouseMoveMinTime) return;

    const [x, y] = getCursorCoords(e);
    viewParams.moveOffset(x - currentMouseStart[0], y - currentMouseStart[1]);
    draw();

    // recompute canvas coords as we've moved the offset
    currentMouseStart = getCursorCoords(e);
    currentMouseMoving = true;
  } else {
    // not dragging

    const snap = !e.shiftKey;
    const p = getCursorCoords(e, snap);
    setCursorPosition(p);

    if (currentStartPoint) {
      currentEndPoint = p;
      updateUnfinished();
    }
    draw();
  }
}

function mouseLeave() {
  setCursorPosition(undefined);
  draw();
}

function keyDown(e: KeyboardEvent) {
  // ignore keys with modifiers
  if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;

  switch (e.key) {
    case 'Escape':
      resetCurrents();
      draw();
      break;

    case 'r':
      resetView();
      draw();
      break;
  }
}

function resetCurrents() {
  currentEndPoint = undefined;
  currentStartPoint = undefined;
  setUnfinished(undefined);
}

function resetCanvasData(e: Event) {
  // throw an exception if the data doesn't parse
  const circles = JSON.parse((e.target as HTMLElement).dataset.circles ?? 'error');
  resetCircles(circles);
  draw();
}
