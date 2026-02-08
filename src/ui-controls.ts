import { canvas, draw, getCursorCoords } from './canvas.js';
import {
  addPoint,
  currentStartPoint,
  resetCircles,
  resetCurrents,
  resetView,
  setCursorPosition,
  setEndPoint,
  viewParams,
} from './state.js';
import type { Point } from './types.js';

// a move shorter than this time in milliseconds counts as a click
const MIN_MOVE_TIME_MS = 100;

window.addEventListener('load', setUpListeners);

function setUpListeners() {
  canvas.addEventListener('wheel', mouseZoom);
  canvas.addEventListener('mousemove', mouseMove);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mouseleave', mouseLeave);
  document.addEventListener('keydown', keyDown);

  const resetButtons = document.querySelectorAll('button.reset');
  for (const btn of resetButtons) {
    btn.addEventListener('click', resetData);
  }
}

function mouseZoom(e: WheelEvent) {
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

  e.stopPropagation();
  e.preventDefault();
}

let currentMouseStart: Point | undefined = undefined;
let currentMouseMoving = false;
let currentMouseMoveMinTime = 0;

function mouseDown(e: MouseEvent) {
  currentMouseStart = getCursorCoords(e);
  currentMouseMoveMinTime = Date.now() + MIN_MOVE_TIME_MS;
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
    const [x, y] = getCursorCoords(e, snap);
    setCursorPosition([x, y]);

    if (currentStartPoint) {
      setEndPoint([x, y]);
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

function resetData(e: Event) {
  // throw an exception if the data doesn't parse
  const circles = JSON.parse((e.target as HTMLElement).dataset.circles ?? 'error');
  resetCircles(circles);
  draw();
}
